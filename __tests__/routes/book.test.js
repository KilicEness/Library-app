const request = require('supertest')
const app = require('../../src/app')
const Book = require('../../src/models/book')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    bookOne,
    bookTwo,
    bookThree,
    setupDatabase
} = require('../fixtures/db')

//delete db for each test 
beforeEach(setupDatabase)

//testing create books for users
test('Should create book for user', async () => {
    const response = await request(app)
        .post('/books/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Animal Farm',
            author: 'George Orwell'
        })
        .expect(201)
    const book = await Book.findById(response.body._id)
    expect(book).not.toBeNull()
    expect(book.completed).toEqual(false)
})

//Testing get users book
test('Should fetch users book', async () => {
    const response = await request(app)
        .get('/books/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

//Testing read books by own id
test('Should fetch books when given own id', async () => {
    const response = await request(app)
        .get('/books/' + bookThree._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
})

//Testing update books
test('Should update users books', async () => {
    const response = await request(app)
        .patch('/books/' + bookOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(200)
    const book = await Book.findById(bookOne._id)
    expect(book.completed).toEqual(true)
})

//Testing if user try to update another users book
test('Should not update other users book', async () => {
    const response = await request(app)
        .patch('/books/' + bookTwo._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(404)
})

//Testing delete books
test('Should delete users own book', async () => {
    const response = await request(app)
        .delete('/books/' + bookOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const book = await Book.findById(bookOne._id)
    expect(book).toBeNull()
})

//Testing delete an unauthenticated user 
test('Sould not delete book if unauthenticated', async () => {
    const response = request(app)
        .delete('/books/' + bookThree._id)
        .send()
        .expect(401)
    const book = await Book.findById(bookThree._id)
    expect(book).not.toBeNull()
})

//Testing other users cant delete users book
test('Should not delete other users book', async () => {
    const response = await request(app)
        .delete(`/books/${bookOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const book = await Book.findById(bookOne._id)
    expect(book).not.toBeNull()
})
