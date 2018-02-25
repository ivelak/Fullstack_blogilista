const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const formatBlog = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}
const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1, mature: 1 })
    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body
    try {
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (body.title === undefined) {
            return response.status(400).json({ error: 'title missing' })
        }
        if (body.url === undefined) {
            return response.status(400).json({ error: 'url missing' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(Blog.format(savedBlog))
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'nyt jokin kusi...' })
        }
    }
})
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }
    const temp= await Blog.findById(request.params.id)
    console.log('isit',Blog.format(temp))
    try {
        console.log('paramsid', request.params.id)
        const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        await updated.save()
        console.log('ID ', req.params.id)
        response.status(200).json(Blog.format(updated))
    } catch (exception) {
        console.log('error', request.params.id)
        response.status(400).send({ error: 'malformatted id' })
    }
})
blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter

/*
blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})
*/