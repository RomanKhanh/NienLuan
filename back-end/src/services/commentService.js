const { Comment, Post } = require("../models/");
const { createNotification } = require("./notificationService");

const createCommentService = async (data, io) => {
  try {
    let comment = await Comment.create({
      postId: data.postId,
      userId: data.userId,
      text: data.text,
      rating: data.rating,
    });

    // Gửi notification cho chủ bài đăng
    const post = await Post.findById(data.postId);
    if (post) {
      await createNotification(io, {
        recipientId: post.userId,
        senderId: data.userId,
        type: "comment",
        postId: data.postId,
      });
    }

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
