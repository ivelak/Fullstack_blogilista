const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { dummy,
    listWithManyBlogs,
    listWithOneBlog,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    format,
    nonExistingId,
    blogsInDb,
    usersInDb } = require('../utils/list_helper')

const initialBlogs = listWithManyBlogs

const testUser = { username: 'testman', name: 'Test Man', mature: true }


describe('when there is initially some blogs saved', async () => {
    beforeAll(async () => {
        await Blog.remove({})
        console.log('blog cleared...')

        const blogObjects = initialBlogs.map(blog => new Blog(blog))
        await Promise.all(blogObjects.map(n => n.save()))

        await User.remove({})
        console.log('user cleared...')
        const testUser = new User({ username: 'testman', name: 'Test Man', mature: true })
        await testUser.save()


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
    beforeAll(async () => {
        await User.remove({})
        console.log('user cleared...')

    })

    test('a valid blog can be added', async () => {
        const testUser = new User({ username: 'testman', name: 'Test Man', mature: true })
        await testUser.save()
        const blogsBeforeAdding = await blogsInDb()
        console.log('before ', blogsBeforeAdding.length)
        const newBlog = {
            title: "Lisäys",
            author: "test",
            url: "www",
            likes: 0,
            user: testUser.id
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
        const testUser = new User({ username: 'testman', name: 'Test Man', mature: true })
        await testUser.save()
        const newBlog = {
            title: "LikenLisäysIlmanArvoa",
            author: "test",
            url: "www",
            user: testUser.id
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
describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'poisto pyynnöllä HTTP DELETE',
            author: 'poistetaan',
            url: 'www.delete.end'
        })
        await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
        const blogsAtStart = await blogsInDb()

        await api
            .delete(`/api/blogs/${addedBlog._id}`)
            .expect(204)

        const blogsAfterOperation = await blogsInDb()

        const titles = blogsAfterOperation.map(r => r.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
})

describe('when there is initially one user at db', async () => {
    beforeAll(async () => {
        await User.remove({})
        const user = new User({ username: 'root', password: 'sekret' })
        await user.save()
    })

    test('POST /api/users succeeds with a fresh username', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
            mature: true
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
            mature: true
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
    test('POST /api/users fails if username is too short', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'salainen',
            mature: true
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be at least 3 characters long' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
    test('POST /api/users undefined mature is true', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'matureman',
            name: 'Le Mature',
            password: 'salainen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)

        const response = await api
            .get('/api/users')

        const addedUser = response.body.find(user => user.username == "matureman")
        expect(addedUser.mature).toBe(true)
    })

})

afterAll(() => {
    server.close()
})