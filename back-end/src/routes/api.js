const express = require("express");
const { createUser, findUserByEmail } = require("../controller/userController");
const apiRouter = express.Router();

apiRouter.post("/register", createUser);
apiRouter.get("/users/:email", findUserByEmail);

module.exports = apiRouter;
