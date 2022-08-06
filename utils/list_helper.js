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
  const authorWithMostBlogs = maxBy(blogs, 'author');
  const topAuthor = authorWithMostBlogs.author;
  const rankAuthors = countBy(blogs, 'author');
  const totalBlogs = rankAuthors[topAuthor];
  // console.log('Top author: ', topAuthor);
  // console.log('Authors by rank: ', rankAuthors);
  // console.log('Total blogs: ', totalBlogs);

  const mostBlogObject = {
    author: topAuthor,
    blogs: totalBlogs,
  };

  return mostBlogObject;
};

const mostLikes = (blogs) => {
  const listOfAuthors = [...new Set(blogs.map((blog) => blog.author))];
  console.log('List of authors...', listOfAuthors);
  const topAuthor = listOfAuthors.map((author) => {
    const authorArray = blogs.filter((blog) => blog.author === author);
    console.log('Author array ', authorArray);
    const numOfLikes = authorArray.reduce((sum, a) => sum + a.likes, 0);
    console.log('Num of likes: ', numOfLikes);
    const authorObj = { author, likes: numOfLikes };
    console.log('Author obj', authorObj);
    return authorObj;
  });

  return maxBy(topAuthor, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
