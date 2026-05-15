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

module.exports = { createRestaurantService };
