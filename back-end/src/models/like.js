const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
    timestamps: true,
  },
);

// Mỗi user chỉ like một post 1 lần
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Sau khi like → tăng likeCount trong Post
likeSchema.post("save", async function () {
  const Post = mongoose.model("Post");
  await Post.findByIdAndUpdate(this.postId, { $inc: { likeCount: 1 } });
});

// Sau khi unlike (xoá) → giảm likeCount
likeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Post = mongoose.model("Post");
    await Post.findByIdAndUpdate(doc.postId, { $inc: { likeCount: -1 } });
  }
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
