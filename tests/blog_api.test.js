const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// beforeEach(async () => {
//     await Blog.deleteMany({})

// })

test('blogs are returned as json', async () => {
    console.log('entered test')
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})