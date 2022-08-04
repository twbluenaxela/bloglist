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
    const topPost = blogList.reduce((topLikes, blog) => ((topLikes.likes > blog.likes) ? topLikes : blog), 0)
    return {
        title: topPost.title,
        author: topPost.author,
        likes: topPost.likes,
    };
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
