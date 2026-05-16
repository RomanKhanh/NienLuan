require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const whileList = ["/", "/login", "/register", "/google-login"];

  if (whileList.includes(req.path)) {
    return next();
  }

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({
      message: "Invalid token.",
    });
  }
};

module.exports = auth;
