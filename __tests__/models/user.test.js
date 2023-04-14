const request = require('supertest')
const app = require('../../src/app')

test('Should register a new user', async () => {
    await request(app).post('/users/register').send({
        name: 'Ross',
        email: 'ross@gmail.com',
        password: '123456'
    }).expect(201)
})