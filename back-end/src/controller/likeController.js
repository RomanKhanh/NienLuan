const {
  likePostService,
  unlikePostService,
} = require("../services/likeService");

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const io = req.app.get("io");
    const result = await likePostService(postId, userId, io);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const result = await unlikePostService(postId, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { likePost, unlikePost };
