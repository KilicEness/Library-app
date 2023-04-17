const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/user')
const { userOneId, userOne, setupDatabase } = require('../fixtures/db')

//save and delete users for each test 
beforeEach(setupDatabase)

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

//Update user test
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Breeze'
        })
        .expect(200)
    //Validation of changed
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Breeze')
})

//Wrong update user test
test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Ankara'
        })
        .expect(400)
})
