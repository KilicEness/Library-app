const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/user')

const userOne = {
    name: 'Ross',
    email: 'ross@gmail.com',
    password: '123456'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should register a new user', async () => {
    await request(app).post('/users/register').send({
        name: 'Enes',
        email: 'enes@gmail.com',
        password: '123456'
    }).expect(201)
})

test('Should login exist user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'Wrongpassword'
    }).expect(400)
})