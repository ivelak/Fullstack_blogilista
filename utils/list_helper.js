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
        if (blogs[index].likes>comp.likes){
            comp=blogs[index]
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
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }