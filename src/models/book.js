const mongoose = require('mongoose')

//Define our task model
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ownerName: {
        type: String,
        ref: 'User'
    },
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book