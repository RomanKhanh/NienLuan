const { Post } = require("../models/");

const createPostService = async (data) => {
  try {
    let post = await Post.create({
      userId: data.userId,
      restaurantId: data.restaurantId,
      description: data.description,
      images: data.images,
      rating: data.rating,
    });
    return {
      EC: 0,
      EM: "Created Successfully",
      POST: post,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: error?.message || "Tạo bài đăng thất bại",
    };
  }
};

const getPostByIDService = async (id) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return {
        EC: 1,
        EM: "Post is not found",
      };
    }
    return {
      EC: 0,
      EM: "Post is found",
      POST: post,
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

module.exports = {
  createPostService,
  getPostByIDService,
};
