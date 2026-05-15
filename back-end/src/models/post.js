const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Thông tin snapshot của quán tại thời điểm đăng
    // (phòng trường hợp quán bị xoá/đổi tên về sau)
    restaurantSnapshot: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      category: { type: String },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    }, // Mảng URL ảnh (tối đa 5 như frontend)

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    }, // Rating của bài post này

    // Cached counters — cập nhật khi có like/comment mới
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index để lấy feed nhanh (sort theo mới nhất)
postSchema.index({ createdAt: -1 });
// Index để lấy bài đăng theo quán
postSchema.index({ restaurantId: 1, createdAt: -1 });
// Index để lấy bài đăng của user
postSchema.index({ userId: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
