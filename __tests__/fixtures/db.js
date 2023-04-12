const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Book = require('../../src/models/book')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Ross',
    email: 'ross@gmail.com',
    password: '123456',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Rachel',
    email: 'rachel@gmail.com',
    password: '123456',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const bookOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Animal Farm',
    completed: false,
    owner: userOne._id
}

const bookTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: '1984',
    completed: true,
    owner: userOne._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Book.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(bookOne).save()
    await new Task(bookTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    bookkOne,
    bookTwo,
    setupDatabase
}