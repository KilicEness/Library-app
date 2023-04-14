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

