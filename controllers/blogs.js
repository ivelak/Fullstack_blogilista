const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const formatBlog = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1, mature: 1 })
    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (body.title === undefined) {
            return response.status(400).json({ error: 'title missing' })
        }
        if (body.url === undefined) {
            return response.status(400).json({ error: 'url missing' })
        }

        const user = await User.findById(body.user)
        console.log(user)

        if (user === null) {
            return response.status(400).json({ error: 'invalid user' })
        }

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
        console.log(exception)
        response.status(500).json({ error: 'nyt jokin kusi...' })
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