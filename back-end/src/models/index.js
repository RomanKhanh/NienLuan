// Tập trung export tất cả models
// Dùng: const { User, Restaurant, Post, Comment, Like, Favorite } = require('./models')

const User = require("./user");
const Restaurant = require("./restaurant");
const Post = require("./post");
const Comment = require("./comment");
const Like = require("./like.js");
const Favorite = require("./favorite");
const Notification = require("./notification");

module.exports = {
  User,
  Restaurant,
  Post,
  Comment,
  Like,
  Favorite,
  Notification,
};
