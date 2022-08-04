const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

// blogsRouter.get('/', (req, res) => {
//   res.send('<h1>Hi!</h1>');
// });

blogsRouter.get('/', (request, response) => {
  logger.info('Get request...')
  Blog.find({}).then((blogs) => {
    logger.info('Blogs: ', blogs)
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
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
