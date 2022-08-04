const dummy = (blogs) => 1;

const totalLikes = (blogList) => blogList.reduce(
  (sum, blog) =>
//   console.log('----')
//   console.log("Current sum: ", sum)
//   console.log('Current blog like count: ', blog.likes)
    sum + blog.likes,
  0,
);

module.exports = {
  dummy,
  totalLikes,
};
