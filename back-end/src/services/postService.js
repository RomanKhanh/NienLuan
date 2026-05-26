const { Post, Like, Favorite } = require("../models/");

const createPostService = async (data) => {
  try {
    let post = await Post.create({
      userId: data.userId,
      restaurantId: data.restaurantId,
      description: data.description,
      images: data.images,
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

const getPostsService = async (userId) => {
  try {
    const posts = await Post.find()
      .populate("restaurantId")
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const liked = await Like.findOne({
          postId: post._id,
          userId: userId,
        });

        const favorite = await Favorite.findOne({
          postId: post._id,
          userId: userId,
        });

        return {
          ...post,
          isLiked: !!liked,
          isFavorite: !!favorite,
        };
      }),
    );
    return {
      EC: 0,
      EM: "Get posts successfully",
      POSTS: formattedPosts,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: error,
    };
  }
};

const getPostByIDService = async (id, userId) => {
  try {
    const post = await Post.findById(id);

    if (!post) {
      return {
        EC: 1,
        EM: "Post is not found",
      };
    }

    const favorite = await Favorite.findOne({
      postId: post._id,
      userId: userId,
    });

    return {
      EC: 0,
      EM: "Post is found",
      POST: {
        ...post.toObject(),
        isFavorite: !!favorite,
      },
    };
  } catch (error) {
    console.log(">>> Error find post:", error);

    return {
      EC: 2,
      EM: "Failed to find post",
      ERROR: error.message,
    };
  }
};

module.exports = {
  createPostService,
  getPostByIDService,
  getPostsService,
};
