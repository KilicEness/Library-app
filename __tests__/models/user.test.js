const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../../src/app')
const User = require('../../src/models/user')

//create userOne to database
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

//delete users for each test 
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

//Test register request
test('Should register a new user', async () => {
    const response = await request(app).post('/users/register').send({
        name: 'Enes',
        email: 'enes@gmail.com',
        password: '123456'
    }).expect(201)

    //ASsert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Enes',
            email: 'enes@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('123456')
})

//Test login request
test('Should login exist user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    //second token validation test
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//Test wrong login request
test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'Wrongpassword'
    }).expect(400)
})

//Test getting user request
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

//Test getting unauthenticated user request
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/')
        .send()
        .expect(401)
})

//Test delete user request
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    //Validate user is removed
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

//Test unauthenticated delete user request
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/')
        .send()
        .expect(401)
})