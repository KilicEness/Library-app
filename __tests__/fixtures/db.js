const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Book = require('../../src/models/book')

//create userOne to database
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Ross',
    email: 'ross@gmail.com',
    password: '1234567',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

//create userTwo to database
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Rachel',
    email: 'rachel@gmail.com',
    password: '12345678',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

//create bookOne for userOne to database
const bookOne = {
    _id: new mongoose.Types.ObjectId(),
    name: '1984',
    author: 'George Orwell',
    completed: false,
    owner: userOne._id
}

//create bookTwo for userOne to database
const bookTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Satranc',
    author: 'Stefan Zweig',
    completed: true,
    owner: userOne._id
}

//create bookThree for userTwo to database
const bookThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Donusum',
    author: 'Franz Kafka',
    owner: userTwo._id
}

//Setup database for each test
const setupDatabase = async () => {
    await User.deleteMany()
    await Book.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Book(bookOne).save()
    await new Book(bookTwo).save()
    await new Book(bookThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    bookOne,
    bookTwo,
    bookThree,
    setupDatabase,
}