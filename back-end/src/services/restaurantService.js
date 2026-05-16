const { Restaurant } = require("../models");

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
    return {
      EC: 0,
      EM: "Find restaurant successfully",
      RESTAURANT: {
        name: restaurant.name,
        description: restaurant.description,
        category: restaurant.category,
        address: restaurant.address,
        addressSub: restaurant.addressSub,
        phone: restaurant.phone,
        priceRange: restaurant.priceRange,
        amenities: restaurant.amenities,
        tags: restaurant.tags,
        images: restaurant.images,
        hours: restaurant.hours,
        rating: restaurant.rating,
        reviewCount: restaurant.reviewCount,
      },
    };
  } catch (error) {
    console.log(">>> Error find restaurant by email: ", error);
    return {
      EC: 2,
      EM: "Failed to find restaurant",
      ERROR: error.message,
    };
  }
};

module.exports = { createRestaurantService, getRestaurantByIDService };
