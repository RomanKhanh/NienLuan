const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  createUser,
  findUserByEmail,
  loginUser,
  getAccountInfo,
  googleLogin,
  updateProfile,
  changePassword,
} = require("../controller/userController");

const {
  createRestaurant,
  getRestaurantByID,
} = require("../controller/restaurantController");

const {
  createPost,
  getPostByID,
  getPosts,
} = require("../controller/postController");

const {
  createComment,
  getRestaurantComments,
} = require("../controller/commentController");

const apiRouter = express.Router();

apiRouter.all("*", authMiddleware);

//User
apiRouter.post("/register", createUser);
apiRouter.post("/login", loginUser);
apiRouter.post("/google-login", googleLogin);
apiRouter.get("/users/:email", findUserByEmail);
apiRouter.get("/account", getAccountInfo);
apiRouter.patch("/update-profile", updateProfile);
apiRouter.patch("/change-password", changePassword);

//Restaurant
apiRouter.post("/create-restaurant", createRestaurant);
apiRouter.get("/restaurant/:id", getRestaurantByID);

//Post
apiRouter.post("/create-post", createPost);
apiRouter.get("/post/:id", getPostByID);
apiRouter.get("/posts", getPosts);

//Comment
apiRouter.post("/restaurant/:restaurantId/create-comment", createComment);
apiRouter.get("/restaurant/:restaurantId/comments", getRestaurantComments);

module.exports = apiRouter;
