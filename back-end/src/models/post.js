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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    }, // Mảng URL ảnh (tối đa 5 như frontend)

    // Cached counters — cập nhật khi có like/comment mới
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
});

// Index để lấy feed nhanh (sort theo mới nhất)
postSchema.index({ createdAt: -1 });
// Index để lấy bài đăng theo quán
postSchema.index({ restaurantId: 1, createdAt: -1 });
// Index để lấy bài đăng của user
postSchema.index({ userId: 1, createdAt: -1 });
// Index để lấy bài đăng được yêu thích nhiều nhất
postSchema.index({ likeCount: -1, createdAt: -1 });
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
