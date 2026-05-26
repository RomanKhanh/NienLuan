const { Like, Post } = require("../models");
const { createNotification } = require("./notificationService");

const likePostService = async (postId, userId, io) => {
  try {
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return { EC: 1, EM: "You have already liked this post" };
    }

    const newLike = await Like.create({ postId, userId });

    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    // Lấy post để biết chủ sở hữu rồi gửi notification
    const post = await Post.findById(postId);
    if (post) {
      await createNotification(io, {
        recipientId: post.userId,
        senderId: userId,
        type: "like",
        postId,
      });
    }

    return { EC: 0, EM: "Post liked successfully", LIKE: newLike };
  } catch (error) {
    console.log(error);
    return { EC: 2, EM: error.message };
  }
};

const unlikePostService = async (postId, userId) => {
  try {
    const deletedLike = await Like.findOneAndDelete({ postId, userId });
    if (!deletedLike) {
      return { EC: 1, EM: "You have not liked this post" };
    }
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
    return { EC: 0, EM: "Post unliked successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 2, EM: error.message };
  }
};

module.exports = { likePostService, unlikePostService };
