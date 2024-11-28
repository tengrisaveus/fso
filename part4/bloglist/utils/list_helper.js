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
    return blogs.reduce((mostLiked, current) => {
        return current.likes > mostLiked.likes ? current : mostLiked;
    });
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const authorBlogCounts = _.map(groupedByAuthor, (blogs, author) => ({
        author: author,
        blogs: blogs.length
    }))
    return _.maxBy(authorBlogCounts, 'blogs')
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const authorLikeCounts = _.map(groupedByAuthor, (blogs, author) => ({
        author: author,
        likes: _.sumBy(blogs, 'likes')
    }))
    return _.maxBy(authorLikeCounts, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}