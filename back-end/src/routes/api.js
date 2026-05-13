const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  createUser,
  findUserByEmail,
  loginUser,
  getAccountInfo,
} = require("../controller/userController");

const apiRouter = express.Router();

apiRouter.all("*", authMiddleware);
apiRouter.post("/register", createUser);
apiRouter.post("/login", loginUser);
apiRouter.get("/users/:email", findUserByEmail);
apiRouter.get("/account", getAccountInfo);

module.exports = apiRouter;
