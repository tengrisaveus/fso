const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.length == 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
    blogs.reduce((mostLiked, current) => {
        current.likes > mostLiked.likes ? current : mostLiked
    })
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const authorBlogCounts = _.map(groupedByAuthor, (blogs, author) => ({
        author: author,
        blogs: blogs.length
    }))
    console.log(authorBlogCounts)
    return _.maxBy(authorBlogCounts, 'blogs')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}