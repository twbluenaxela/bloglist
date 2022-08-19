const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

// blogsRouter.get('/', (req, res) => {
//   res.send('<h1>Hi!</h1>');
// });

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { body } = request;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  if (blog.title && blog.url) {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } else {
    response.sendStatus(400);
  }

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
});

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {

  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query'})
  
  response.json(updatedBlog)
})

module.exports = blogsRouter;
