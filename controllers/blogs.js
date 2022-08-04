const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res) => {
  res.send('<h1>Hi!</h1>');
});

blogsRouter.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post('/api/blogs', (request, response) => {
  const { body } = request;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
