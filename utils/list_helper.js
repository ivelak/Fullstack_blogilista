const Blog = require('../models/blog')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const listWithManyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const format = (blog) => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      id: blog._id
    }
  }
  
  const nonExistingId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    console.log(blogs)
    return blogs.map(format)
  }
  

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce(function (sum, blog) {
        return sum + blog.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    let comp = blogs[0]
    for (let index = 0; index < blogs.length; index++) {
        if (blogs[index].likes > comp.likes) {
            comp = blogs[index]
        }

    }
    const result = {
        title: comp.title,
        author: comp.author,
        likes: comp.likes
    }
    return result
}

const mostBlogs = (blogs) => {
    let blogMap = new Map()
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)) {
            blogMap.set(blog.author, blogMap.get(blog.author) + 1)
        } else {
            blogMap.set(blog.author, 1)
        }
    })
    let result = null
    for (let [key, value] of blogMap.entries()) {

        if (result == null) {
            result = { ' author': key, 'blogs': value }
        } if (value >= result.blogs) {
            result = { 'author': key, 'blogs': value }
        }
    }
    return result
}

const mostLikes = (blogs) => {
    let blogMap = new Map()
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)) {
            blogMap.set(blog.author, blogMap.get(blog.author) + blog.likes)
        } else {
            blogMap.set(blog.author, blog.likes)
        }
    })
    let result = null
    for (let [key, value] of blogMap.entries()) {

        if (result == null) {
            result = { ' author': key, 'likes': value }
        } if (value >= result.likes) {
            result = { 'author': key, 'likes': value }
        }
    }
    return result

}


module.exports = {
    dummy,
    listWithManyBlogs,
    listWithOneBlog,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    format, 
    nonExistingId, 
    blogsInDb
}