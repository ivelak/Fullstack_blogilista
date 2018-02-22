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
  
  module.exports = {
    dummy,
    totalLikes
  }