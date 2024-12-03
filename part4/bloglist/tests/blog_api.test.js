const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./blog_test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://testblog.com",
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(titles.includes('Test Blog'))
})

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testurl.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === 'Test Blog')
    assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: "Test Author",
        url: "http://testblog.com",
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        author: "Test Author",
        title: 'Test Blog',
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })
})

describe('update of a note', () => {
    test('succeeds', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedLikes = {
            likes: blogToUpdate.likes,
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedLikes)
            .expect(200)

        assert.strictEqual(response.body.likes, updatedLikes.likes)
        
        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
        
        assert.strictEqual(updatedBlog.likes, updatedLikes.likes)

    })
})

after(async () => {
    await mongoose.connection.close()
})