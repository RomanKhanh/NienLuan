const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Index để lấy comment mới nhất của restaurant
commentSchema.index({ restaurantId: 1, createdAt: -1 });

// Sau khi tạo comment
commentSchema.post("save", async function () {
  const Restaurant = mongoose.model("Restaurant");

  // Tính lại rating trung bình
  const stats = await mongoose.model("Comment").aggregate([
    {
      $match: {
        restaurantId: this.restaurantId,
      },
    },
    {
      $group: {
        _id: "$restaurantId",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(this.restaurantId, {
      rating: stats[0].avgRating,
      reviewCount: stats[0].reviewCount,
    });
  }
});

// Sau khi xoá comment
commentSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  const Restaurant = mongoose.model("Restaurant");

  const stats = await mongoose.model("Comment").aggregate([
    {
      $match: {
        restaurantId: doc.restaurantId,
      },
    },
    {
      $group: {
        _id: "$restaurantId",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(doc.restaurantId, {
      rating: stats[0].avgRating,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    // Không còn review nào
    await Restaurant.findByIdAndUpdate(doc.restaurantId, {
      rating: 0,
      reviewCount: 0,
    });
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
