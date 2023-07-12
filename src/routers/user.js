const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()


//Create users
router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

//Logout user just one session
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Logout all sessions
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Read users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
})

//Get user by id
router.get('/:id', auth, async (req,res) => {
    try {
        const userId = req.params.id;
        //const user = await User.findOne({ _id: userId })
        const user = await User.findById(userId)
        res.status(200).send(user)
    } catch (e) {
        res.status(400).json({message: e.message});
    }
})

//Update user
router.patch('/', auth, async (req, res) => {
    for (let field in req.body) {
        if (req.body[field] === null) {
            delete req.body[field]
        }
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'birthDay']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete user
router.delete('/', auth, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.user._id })
        res.send('USer deleted succesfully.')
    } catch (e) {
        res.status(500).send(e)
    }
})




module.exports = router