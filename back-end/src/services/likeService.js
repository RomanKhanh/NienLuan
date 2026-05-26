const { Like, Post } = require("../models");

const likePostService = async (postId, userId) => {
  try {
    // kiểm tra đã like chưa
    const existingLike = await Like.findOne({
      postId,
      userId,
    });

    if (existingLike) {
      return {
        EC: 1,
        EM: "You have already liked this post",
      };
    }

    // tạo like
    const newLike = await Like.create({
      postId,
      userId,
    });

    // tăng likeCount
    await Post.findByIdAndUpdate(postId, {
      $inc: {
        likeCount: 1,
      },
    });

    return {
      EC: 0,
      EM: "Post liked successfully",
      LIKE: newLike,
    };
  } catch (error) {
    console.log(error);

    return {
      EC: 2,
      EM: error.message,
    };
  }
};

const unlikePostService = async (postId, userId) => {
  try {
    // tìm và xoá like
    const deletedLike = await Like.findOneAndDelete({
      postId,
      userId,
    });

    if (!deletedLike) {
      return {
        EC: 1,
        EM: "You have not liked this post",
      };
    }

    // giảm likeCount
    await Post.findByIdAndUpdate(postId, {
      $inc: {
        likeCount: -1,
      },
    });

    return {
      EC: 0,
      EM: "Post unliked successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      EC: 2,
      EM: error.message,
    };
  }
};

module.exports = {
  likePostService,
  unlikePostService,
};
