const mongoose = require('mongoose')
const Book = require('../../src/models/book')
const db = require('../fixtures/db')

const userDataId = new mongoose.Types.ObjectId()

const bookData = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Seker Portakali',
    author: 'Jose Mauro de Vasconcelos',
    completed: false,
    owner: userDataId._id
}

beforeAll(async () => {
    await db.setUp()
})

afterEach(async () => {
    await db.dropCollections()
})

afterAll(async () => {
    await db.dropDatabase()
})

//Book model
describe('Book model', () => {
    it('create and save book successfully', async () => {
        const book = new Book(bookData)
        const savedBook = await book.save()
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedBook.name).toBe(bookData.name)
        expect(savedBook._id).toBeDefined()
        expect(savedBook.author).toBe(bookData.author)
        expect(savedBook.completed).toBe(bookData.completed)
        expect(savedBook.owner).toBeDefined()
    })

    // You shouldn't be able to add in any field that isn't defined in the schema
    it('insert book successfully, but the field not defined in schema should be undefined', async () => {
        const bookWithInvalidField = new Book({
            ...bookData,
            page: 200,
        })
        const savedBookWithInvalidField = await bookWithInvalidField.save()
        expect(savedBookWithInvalidField._id).toBeDefined()
        expect(savedBookWithInvalidField.page).toBeUndefined()
    })

    // It should us tell us the errors in on email field.
    it('create book without required field should failed', async () => {
        const bookWithoutRequiredField = new Book({
            name: 'Momo'
        })

        let err
        try {
            await bookWithoutRequiredField.save()
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.author).toBeDefined()
    })
})