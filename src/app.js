const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const auth = require('./middleware/auth')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/users',userRouter)
app.use('/books', auth ,bookRouter)

module.exports = app