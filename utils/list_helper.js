const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce(function (sum, blog) {
        return sum + blog.likes
    }, 0)
    console.log(total)
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
    console.log('favourite', result)
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
            console.log('1 already there ', blogMap.get(blog.author))
        } else {
            blogMap.set(blog.author, blog.likes)
            console.log('1 not yet there ', blog.author, blogMap.get(blog.author))
        }
    })
    let result = null
    console.log('2 shouldbe null ', result)
    for (let [key, value] of blogMap.entries()) {
        console.log('2 iteration ', key)

        if (result == null) {
            console.log('2 we come to null with ', result)
            result = { ' author': key, 'likes': value }
            console.log('2 value of result ', result.likes)
            console.log('2 value of value ', value)
        } if (value >= result.likes) {
            console.log('2 do we visit here ', result.likes)
            result = { 'author': key, 'likes': value }
        }
        console.log('2 result ', result)
    }
    return result

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}