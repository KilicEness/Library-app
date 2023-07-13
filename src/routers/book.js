const express = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = express.Router()


//Create books
router.post('/', async (req, res) => {
    const book = new Book({
        ...req.body,
        ownerId: req.user._id,
        // ownerName: req.user.name
    })

    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(404).send(e)
    }
})

//Read books
//GET /books?completed=true
//GET /books?limit=5&skip=10
//GET /books?sortBy=createdAt:desc
router.get('/', async (req, res) => {
    // const match = {}
    // const sort = {}

    // if (req.query.completed) {
    //     match.completed = req.query.completed === 'true'
    // }

    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    // try {
    //     await req.user.populate({
    //         path: 'books',
    //         match,
    //         options: {
    //             limit: parseInt(req.query.limit),
    //             skip: parseInt(req.query.skip),
    //             sort
    //         }
    //     })
    //     res.send(req.user.books)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
    try {
        const books = await Book.find({}).lean();
        for (let book of books) {
            const user = await User.findOne({_id: book.ownerId}).lean();
            book.ownerName = user.name;
        }
        res.status(200).send(books);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
})

//Read books by own id
router.get('/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const book = await Book.findOne({ _id, ownerId: req.user._id }).lean()
        
        if (!book) {
            return res.status(404).send();
        }

        const user = await User.findOne({_id: book.ownerId});
        book.ownerName = user.name;
        res.send(book)
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
})

// Get user's books
router.get('/:id/books', async (req, res) => {
    try {
        const ownerId = req.params.id;
        const books = await Book.find({ ownerId }).lean();
        const user = await User.find({_id: req.user_id});
        books.forEach((book) => {
            book.ownerName = user.name;
        })
        res.status(200).json(books);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Get user own books on the navlink
router.get('/:id/myBooks', auth, async (req, res) => {
    try {
        const books = await Book.find({ ownerId: req.user._id }).lean();
        const user = await User.findOne({_id: req.user._id});
        // const booksWithOwnerNames = books.map((book) => ({ ...book._doc, ownerName: user.name }))
        books.forEach((book) => {
            book.ownerName = user.name;
        })
        res.status(200).json(books);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


//Update books by id
router.patch('/:id', async (req, res) => {
    for (let field in req.body) {
        if (req.body[field] === null) {
            delete req.body[field]
        }
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'author', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        const book = await Book.findOne({ _id: req.params.id, ownerId: req.user._id })

        if (!book) {
            return res.status(404).send()
        }
        updates.forEach((update) => book[update] = req.body[update])
        await book.save()
        res.send(book)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Delete books by id
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id })

        if (!book) {
            return res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
