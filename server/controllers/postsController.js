const { posts } = require("../utils");

exports.getUserPosts = (req, res) => {
  res.json(posts.filter((post) => post.author === req.user.name));
};

exports.getAllPosts = (req, res) => {
  res.json(posts);
};

exports.updatePost = (req, res) => {
  // you can skip saving updated post as it is not important for this task
  if (req.params.id in posts) {
    const postToUpdate = posts[req.params.id];
    if (postToUpdate.author === req.user.name) {
      res.json(Object.assign(postToUpdate, req.body));
    }
    res.sendStatus(403);
  }
  return res.status(404).json({
    status: "fail",
    message: "Invalid post id",
  });
};
