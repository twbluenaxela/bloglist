const { mapValues, maxBy, countBy } = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogList) => blogList.reduce(
  (sum, blog) =>
  //   console.log('----')
  //   console.log("Current sum: ", sum)
  //   console.log('Current blog like count: ', blog.likes)
    sum + blog.likes,
  0,
);

const favoriteBlog = (blogList) => {
  const topPost = blogList.reduce((topLikes, blog) => ((topLikes.likes > blog.likes) ? topLikes : blog), 0);
  return {
    title: topPost.title,
    author: topPost.author,
    likes: topPost.likes,
  };
};

const mostBlogs = (blogs) => {
  const authorWithMostBlogs = maxBy(blogs, 'author')
  const topAuthor = authorWithMostBlogs.author
  const rankAuthors = countBy(blogs, 'author')
  const totalBlogs = rankAuthors[topAuthor]
  // console.log('Top author: ', topAuthor);
  // console.log('Authors by rank: ', rankAuthors);
  // console.log('Total blogs: ', totalBlogs);

  const mostBlogObject = {
    author: topAuthor,
    blogs: totalBlogs,
  }

  return mostBlogObject;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
