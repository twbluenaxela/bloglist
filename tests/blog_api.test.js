const { after } = require("lodash");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");

const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  console.log("entered test");
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("that the blog id is formatted correctly", async () => {
  const resultBlogs = await api.get("/api/blogs");
  console.log(resultBlogs.body);
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

  const blogIds = resultBlogs.body.map((b) => expect(b.id).toBeDefined());
});

test("if a blog post has been successfully added", async () => {
  const newBlog = {
    title: "Hi",
    author: "Gladwell",
    url: "https://supaman.com",
    likes: 9001,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const authors = blogsAtEnd.map((b) => b.author);
  expect(authors).toContain("Gladwell");
});

test("if like is set to zero if missing like value", async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    const resultBlogs = response.body.map(blog => {
        //if there is no like property, then it will fail the test. 
        expect(blog.likes).toBeDefined()
    } )

});

test('if missing blog title or url will send a 400 bad request', async () => {

    const newBlog = {
        author: "Gladwell",
        url: "https://supaman.com",
        likes: 9001,
      };

    const correctlyFormattedBlog = {
        title: "Hi",
        author: "Gladwell",
        url: "https://supaman.com",
        likes: 9001,
      };

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

describe('deletion of blogs', () => {
  test('returns 204 if deleted', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    
    const authors = blogsAtEnd.map(b => b.author)

    expect(authors).not.toContain(blogToDelete.author)

  })
})

describe('update blog', () => {
  test('update likes of blog entry by id', async () => {
    const blogs = await helper.blogsInDb()
    console.log('Blogs: ', blogs)
    const blogId = blogs[0].id
    console.log('Old likes: ', blogs[0].likes)
    const newBlog = {...blogs[0], likes: 8}
    await api
    .put(`/api/blogs/${blogId}`)
    .send(newBlog)
    .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    
    const likeCount = blogsAtEnd.map(b => b.likes)

    console.log('New likes: ', blogsAtEnd[0].likes)

    expect(likeCount).toContain(newBlog.likes)

  })
})

afterAll(() => {
  mongoose.connection.close();
});
