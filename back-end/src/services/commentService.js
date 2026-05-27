const { Comment, Post } = require("../models/");

const createCommentService = async (data) => {
  try {
    let comment = await Comment.create({
      postId: data.postId,
      userId: data.userId,
      text: data.text,
      rating: data.rating,
    });
    return {
      EC: 0,
      EM: `Created comment successfully`,
      COMMENT: comment,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error,
    };
  }
};

const getPostCommentsService = async (id) => {
  try {
    const post = await Post.findById(id);
    if (!post)
      return {
        EC: 1,
        EM: `Post not found`,
      };
    const comments = await Comment.find({
      postId: post._id,
    })
      .populate("userId")
      .sort({ createdAt: -1 });
    return {
      EC: 0,
      EM: `Get comments successfully`,
      COMMENTS: comments,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error,
    };
  }
};

module.exports = { createCommentService, getPostCommentsService };
