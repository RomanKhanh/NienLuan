const { Favorite, Post } = require("../models");

const addFavoriteService = async (userId, postId) => {
  try {
    // kiểm tra đã thêm vào yêu thích chưa
    const existingFavorite = await Favorite.findOne({
      userId,
      postId,
    });
    if (existingFavorite) {
      return {
        EC: 1,
        EM: "You have already added this post to favorites",
      };
    }
    // tạo yêu thích
    const newFavorite = await Favorite.create({
      userId,
      postId,
    });

    return {
      EC: 0,
      EM: "Post added to favorites successfully",
      FAVORITE: newFavorite,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 2,
      EM: error.message,
    };
  }
};

const removeFavoriteService = async (userId, postId) => {
  try {
    // tìm và xoá yêu thích
    const deletedFavorite = await Favorite.findOneAndDelete({
      userId,
      postId,
    });
    if (!deletedFavorite) {
      return {
        EC: 1,
        EM: "You have not added this post to favorites",
      };
    }
    return {
      EC: 0,
      EM: "Post removed from favorites successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 2,
      EM: error.message,
    };
  }
};

const getFavoritesByUserIdService = async (userId) => {
  try {
    const favorites = await Favorite.find({ userId }).populate({
      path: "postId",
      populate: [
        {
          path: "restaurantId",
        },
        {
          path: "userId",
        },
      ],
    });

    return {
      EC: 0,
      EM: "Get favorites successfully",
      FAVORITES: favorites.map((fav) => fav.postId),
    };
  } catch (error) {
    console.log(error);

    return {
      EC: 1,
      EM: error.message,
    };
  }
};

module.exports = {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesByUserIdService,
};
