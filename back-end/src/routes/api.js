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

const { createRestaurant } = require("../controller/restaurantController");

const apiRouter = express.Router();

apiRouter.all("*", authMiddleware);
apiRouter.post("/register", createUser);
apiRouter.post("/login", loginUser);
apiRouter.post("/google-login", googleLogin);
apiRouter.get("/users/:email", findUserByEmail);
apiRouter.get("/account", getAccountInfo);
apiRouter.patch("/update-profile", updateProfile);
apiRouter.patch("/change-password", changePassword);
apiRouter.post("/create-restaurant", createRestaurant);

module.exports = apiRouter;
