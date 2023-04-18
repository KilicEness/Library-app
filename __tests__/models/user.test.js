const mongoose = require('mongoose')
const User = require('../../src/models/user')
const db = require('../fixtures/db')

const userData = {
    name: 'Ragnar',
    email: 'ragnar@gmail.com',
    password: 'lothbroks',
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


//User model
describe('User model', () => {
    it('create and save user successfully', async () => {
        const validUser = new User(userData)
        await validUser.generateAuthToken()
        const savedUser = await validUser.save()
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser.name).toBe(userData.name)
        expect(savedUser._id).toBeDefined()
        expect(savedUser.email).toBe(userData.email)
    })

    // You shouldn't be able to add in any field that isn't defined in the schema
    it('insert user successfully, but the field not defined in schema should be undefined', async () => {
        const userWithInvalidField = new User({
            ...userData,
            nickname: 'KingRagnar',
        })
        const savedUserWithInvalidField = await userWithInvalidField.save()
        expect(savedUserWithInvalidField._id).toBeDefined()
        expect(savedUserWithInvalidField.nickname).toBeUndefined()
    })

    // It should us tell us the errors in on email field.
    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new User({
            name: 'Enes'
        })

        let err
        try {
            await userWithoutRequiredField.save()
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined()
    })
})