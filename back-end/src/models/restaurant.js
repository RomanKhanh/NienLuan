const mongoose = require("mongoose");

const hourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // "Thứ 2", "Thứ 3", ...
    time: { type: String, required: true }, // "06:00 - 22:00"
    isToday: { type: Boolean, default: false },
  },
  { _id: false },
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    }, // VD: "Ẩm thực Nam Bộ", "Lẩu", "Cơm tấm"

    address: {
      type: String,
      required: true,
      trim: true,
    },

    addressSub: {
      type: String,
      trim: true,
    }, // VD: "Quận Ninh Kiều, Cần Thơ"

    phone: {
      type: String,
      trim: true,
    },

    priceRange: {
      type: String,
      trim: true,
    }, // VD: "30.000 - 80.000đ"

    amenities: {
      type: String,
      trim: true,
    }, // VD: "Wifi, Điều hoà, Chỗ đậu xe"

    tags: {
      type: [String],
      default: [],
    }, // VD: ["Ngon", "Rẻ", "Sạch"]

    images: {
      type: [String],
      default: [],
    }, // Mảng URL ảnh

    hours: {
      type: [hourSchema],
      default: [],
    },

    // Computed/cached — cập nhật mỗi khi có comment/like mới
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index tìm kiếm theo tên và địa chỉ
restaurantSchema.index({ name: "text", address: "text", description: "text" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
