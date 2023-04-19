const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Book = require('./book')

//Define our user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    birthDay: {
        type: Date
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please provide an email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//Relationship for book between user
userSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'owner'
})

//Hiding private data
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

//Generating authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Validation of logging on user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Invalid password')
    }

    return user
}

//Hash the plain text password before saving 
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user books when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Book.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User