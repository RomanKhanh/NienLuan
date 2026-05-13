const express = require("express");
const {
  createUser,
  findUserByEmail,
  loginUser,
} = require("../controller/userController");
const apiRouter = express.Router();

apiRouter.post("/register", createUser);
apiRouter.post("/login", loginUser);
apiRouter.get("/users/:email", findUserByEmail);

module.exports = apiRouter;
