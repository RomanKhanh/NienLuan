const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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

// Index để lấy comment của một bài post
commentSchema.index({ postId: 1, createdAt: -1 });

// Sau khi lưu comment → tự động cập nhật commentCount trong Post
commentSchema.post("save", async function () {
  const Post = mongoose.model("Post");
  await Post.findByIdAndUpdate(this.postId, { $inc: { commentCount: 1 } });
});

// Sau khi xoá comment → giảm commentCount
commentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Post = mongoose.model("Post");
    await Post.findByIdAndUpdate(doc.postId, { $inc: { commentCount: -1 } });
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
