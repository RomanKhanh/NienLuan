require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const whileList = ["/", "/login", "/register", "/google-login"];

  console.log(">>> Run auth middleware: ", req.path);

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

    req.user = {
      email: decoded.email,
      name: decoded.name,
      phone: decoded.phone,
      avatar: decoded.avatar,
      loginType: decoded.loginType,
    };

    next();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Invalid token.",
    });
  }
};

module.exports = auth;
