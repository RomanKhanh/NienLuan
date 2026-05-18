const { Comment, Restaurant } = require("../models/");

const createCommentService = async (data) => {
  try {
    let comment = await Comment.create({
      restaurantId: data.restaurantId,
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

const getRestaurantCommentsService = async (id) => {
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant)
      return {
        EC: 1,
        EM: `Restaurant not found`,
      };
    const comments = await Comment.find({
      restaurantId: restaurant._id,
    }).populate("userId");
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

module.exports = { createCommentService, getRestaurantCommentsService };
