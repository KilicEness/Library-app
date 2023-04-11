const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/users',userRouter)
app.use('/books',auth ,bookRouter)

//Listen server
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})