const { Restaurant, Post, Comment } = require("../models");

const createRestaurantService = async (data) => {
  try {
    let newRestaurant = await Restaurant.create({
      name: data.name,
      description: data.description,
      category: data.category,
      address: data.address,
      addressSub: data.addressSub,
      phone: data.phone,
      priceRange: data.priceRange,
      amenities: data.amenities,
      tags: data.tags,
      images: data.images,
      hours: data.hours,
      rating: data.rating,
      reviewCount: data.reviewCount,
    });
    return {
      EC: 0,
      EM: "Created Successfully",
      DATA: {
        id: newRestaurant._id,
        name: newRestaurant.name,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "There is something wrong",
    };
  }
};

const getRestaurantByIDService = async (id) => {
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return {
        EC: 1,
        EM: "Restaurant not found",
      };
    }

    // Tính điểm trung bình và số lượng đánh giá dựa trên comments của các post thuộc restaurant
    const stats = await Comment.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      { $match: { "post.restaurantId": restaurant._id } },
      {
        $group: {
          _id: "$post.restaurantId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const computedRating = stats.length > 0 ? stats[0].avgRating : 0;
    const computedReviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

    return {
      EC: 0,
      EM: "Find restaurant successfully",
      RESTAURANT: {
        ...restaurant.toObject(),
        rating: computedRating,
        reviewCount: computedReviewCount,
      },
    };
  } catch (error) {
    console.log(">>> Error find restaurant by id: ", error);
    return {
      EC: 2,
      EM: "Failed to find restaurant",
      ERROR: error.message,
    };
  }
};

module.exports = { createRestaurantService, getRestaurantByIDService };
