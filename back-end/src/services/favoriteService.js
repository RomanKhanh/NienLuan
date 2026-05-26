const { Favorite, Post } = require("../models");
const { createNotification } = require("./notificationService");

const addFavoriteService = async (userId, postId, io) => {
  try {
    const existingFavorite = await Favorite.findOne({ userId, postId });
    if (existingFavorite) {
      return { EC: 1, EM: "You have already added this post to favorites" };
    }

    const newFavorite = await Favorite.create({ userId, postId });

    // Gửi notification cho chủ bài đăng
    const post = await Post.findById(postId);
    if (post) {
      await createNotification(io, {
        recipientId: post.userId,
        senderId: userId,
        type: "favorite",
        postId,
      });
    }

    return {
      EC: 0,
      EM: "Post added to favorites successfully",
      FAVORITE: newFavorite,
    };
  } catch (error) {
    console.log(error);
    return { EC: 2, EM: error.message };
  }
};

const removeFavoriteService = async (userId, postId) => {
  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ userId, postId });
    if (!deletedFavorite) {
      return { EC: 1, EM: "You have not added this post to favorites" };
    }
    return { EC: 0, EM: "Post removed from favorites successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 2, EM: error.message };
  }
};

const getFavoritesByUserIdService = async (userId) => {
  try {
    const favorites = await Favorite.find({ userId }).populate({
      path: "postId",
      populate: [{ path: "restaurantId" }, { path: "userId" }],
    });
    return {
      EC: 0,
      EM: "Get favorites successfully",
      FAVORITES: favorites.map((fav) => fav.postId),
    };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: error.message };
  }
};

module.exports = {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesByUserIdService,
};
