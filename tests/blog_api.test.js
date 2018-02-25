const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { dummy,
    listWithManyBlogs,
    listWithOneBlog,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    format,
    nonExistingId,
    blogsInDb } = require('../utils/list_helper')

const initialBlogs = listWithManyBlogs


describe('when there is initially some blogs saved', async () => {
    beforeAll(async () => {
        await Blog.remove({})
        console.log('cleared...')

        const blogObjects = initialBlogs.map(blog => new Blog(blog))
        await Promise.all(blogObjects.map(n => n.save()))
        const temp = await blogsInDb.length
        console.log('!!!', temp)

    })

    test('blogs are returned as json', async () => {
        console.log('entered test')
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const blogsFromDb = await blogsInDb()
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsFromDb.length)

        const returnedBlogs = response.body.map(n => n.title)
        blogsFromDb.forEach(blog => {
            expect(returnedBlogs).toContain(blog.title)

        })
    })

    test('a specific blog is within the returned notes', async () => {
        const response = await api
            .get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(titles).toContain('Go To Statement Considered Harmful')
    })
})
describe('addition of a new blog', async () => {
    test('a valid blog can be added', async () => {
        const blogsBeforeAdding = await blogsInDb()
        console.log('before ', blogsBeforeAdding.length)
        const newBlog = {
            title: "Lisäys",
            author: "test",
            url: "www",
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const blogsAfterAdding = await blogsInDb()
        console.log('after ', blogsAfterAdding.length)
        expect(blogsAfterAdding.length).toBe(blogsBeforeAdding.length + 1)
        const titles = blogsAfterAdding.map(r => r.title)
        expect(titles).toContain('React patterns')
    })

    test('a blog with no value in likes gets 0 as value', async () => {
        const newBlog = {
            title: "LikenLisäysIlmanArvoa",
            author: "test",
            url: "www"
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/blogs')

        const addedBlog = response.body.find(blog => blog.title == "LikenLisäysIlmanArvoa")
        expect(addedBlog.likes).toBe(0)

    })

    test('a new blog has to have valid title', async () => {
        const newBlog = {
            author: "Kirjailija",
            url: "www",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('a new blog has to have valid url', async () => {
        const newBlog = {
            author: "Kirjailija",
            title: "Otsikko",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

afterAll(() => {
    server.close()
})