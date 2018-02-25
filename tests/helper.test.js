const listHelper = require('../utils/list_helper')



test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () =>{


    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        expect(result).toBe(5)
    })
    test('when list has several blogs equals the likes of them', () => {
        const result = listHelper.totalLikes(listHelper.listWithManyBlogs)
        expect(result).toBe(36)
    })
    test('returns most liked blog', () => {
      const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs)
      expect(result).toEqual({
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      })
    })
    
    test('most blogs', () => {
        const result = listHelper.mostBlogs(listHelper.listWithManyBlogs)
        expect(result).toEqual({'author': "Robert C. Martin", 'blogs': 3
        })
    })

    test('most likes', () => {
        const result = listHelper.mostLikes(listHelper.listWithManyBlogs)
        expect(result).toEqual({'author': "Edsger W. Dijkstra", 'likes': 17
        })
    })
    
})

