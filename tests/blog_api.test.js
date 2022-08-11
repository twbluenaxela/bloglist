const { after } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for(let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }

})

test('blogs are returned as json', async () => {
    console.log('entered test')
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('that the blog id is formatted correctly', async () => {
    const resultBlogs = await api
    .get('/api/blogs')
    console.log(resultBlogs.body)
    //throwing this code here so I can make sure that if even ONE of them doesn't have the correct formatting, it will fail the test.
    // resultBlogs.push({
    //     {
    //         _id: "5a422a851b54a676234d17f7aaaaaa",
    //         title: "React patterns",
    //         author: "Michael Chan",
    //         url: "https://reactpatterns.com/",
    //         likes: 7,
    //         __v: 0
    //       }
    // })

    const blogIds = resultBlogs.body.map(b => expect(b.id).toBeDefined())

})

afterAll(() => {
    mongoose.connection.close()
})