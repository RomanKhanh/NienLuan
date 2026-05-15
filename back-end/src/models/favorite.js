const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt chính là savedAt (thời điểm lưu)
  },
);

// Mỗi user chỉ lưu một post 1 lần
favoriteSchema.index({ userId: 1, postId: 1 }, { unique: true });
// Index để lấy danh sách yêu thích của user, sort mới nhất
favoriteSchema.index({ userId: 1, createdAt: -1 });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
