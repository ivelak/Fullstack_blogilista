const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')


app.use(cors())
app.use(bodyParser.json())

const mongoUrl = 'mongodb://admin:koira@ds245228.mlab.com:45228/bloglist'
mongoose.connect(mongoUrl)

app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})