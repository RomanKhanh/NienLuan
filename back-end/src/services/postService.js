const { Post, Like, Favorite, Comment } = require("../models/");

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

const getPostsService = async (userId, search = "", category = "") => {
  try {
    const normalizedSearch = search?.trim().toLowerCase() || "";
    const normalizedCategory = category?.trim().toLowerCase() || "";

    const posts = await Post.find()
      .populate("restaurantId")
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    const filteredPosts = posts.filter((post) => {
      const matchesName =
        !normalizedSearch ||
        post.restaurantId?.name?.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        !normalizedCategory ||
        post.restaurantId?.category?.toLowerCase() === normalizedCategory;

      return matchesName && matchesCategory;
    });

    // Aggregate comment counts per post
    const postStats = await Comment.aggregate([
      { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
    ]);
    const postCountMap = {};
    postStats.forEach((s) => {
      postCountMap[s._id.toString()] = s.commentCount;
    });

    // Aggregate restaurant-level rating from comments linked to posts
    const restaurantStats = await Comment.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $group: {
          _id: "$post.restaurantId",
          avgRating: { $avg: "$rating" },
          commentCount: { $sum: 1 },
        },
      },
    ]);
    const restaurantStatsMap = {};
    restaurantStats.forEach((r) => {
      restaurantStatsMap[r._id.toString()] = r;
    });

    const formattedPosts = await Promise.all(
      filteredPosts.map(async (post) => {
        const liked = await Like.findOne({
          postId: post._id,
          userId: userId,
        });

        const favorite = await Favorite.findOne({
          postId: post._id,
          userId: userId,
        });

        const commentCount = postCountMap[post._id.toString()] || 0;
        const restaurantRating =
          (post.restaurantId &&
          restaurantStatsMap[post.restaurantId._id.toString()]
            ? restaurantStatsMap[post.restaurantId._id.toString()].avgRating
            : post.restaurantId?.rating) || 0;

        return {
          ...post,
          isLiked: !!liked,
          isFavorite: !!favorite,
          commentCount,
          restaurantRating,
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

    // count comments for this post
    const commentCount = await Comment.countDocuments({ postId: post._id });

    // compute restaurant rating based on comments for posts of the restaurant
    let restaurantRating = post.restaurantId?.rating || 0;
    try {
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
        { $match: { "post.restaurantId": post.restaurantId } },
        {
          $group: { _id: "$post.restaurantId", avgRating: { $avg: "$rating" } },
        },
      ]);
      if (stats.length > 0) restaurantRating = stats[0].avgRating;
    } catch (e) {
      console.log("Error computing restaurant rating:", e.message);
    }

    return {
      EC: 0,
      EM: "Post is found",
      POST: {
        ...post.toObject(),
        isFavorite: !!favorite,
        commentCount,
        restaurantRating,
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
