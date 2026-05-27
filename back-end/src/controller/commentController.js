const {
  createCommentService,
  getPostCommentsService,
} = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const data = {
      ...req.body,
      postId: req.params.postId,
      userId: req.user._id,
    };
    const result = await createCommentService(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await getPostCommentsService(postId);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { createComment, getPostComments };
