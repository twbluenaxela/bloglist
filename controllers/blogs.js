const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');

// blogsRouter.get('/', (req, res) => {
//   res.send('<h1>Hi!</h1>');
// });

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user');
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }

  const { user } = request;
  logger.info(`User: ${user}`)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  if (blog.title && blog.url) {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } else {
    response.sendStatus(400);
  }

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  // const blogsOfUser = user.blogs.map(b => b.toString())

  // logger.info(`User: ${user}`)
  // logger.info(`Blog: ${blog}`)
  // logger.info(`Blogs of user: ${blogsOfUser}`)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else if (blog.user.toString !== user._id.toString()) {
    return response.status(401).json({ error: 'Not authorized to delete this post.' });
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const {
    title, author, url, likes,
  } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title, author, url, likes,
    },
    { new: true, runValidators: true, context: 'query' },
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
