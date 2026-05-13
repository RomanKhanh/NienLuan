const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const saltRounds = 10;

const createUserService = async (name, email, password, phone) => {
  try {
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return {
        EC: 1,
        EM: "Email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    return {
      EC: 0,
      EM: "Create user successfully",
      USER: { name: newUser.name, email: newUser.email, phone: newUser.phone },
    };
  } catch (error) {
    console.log(">>> Error create user: ", error);
    return { EC: 2, EM: "Failed to create user" };
  }
};

const findUserByEmailService = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return {
      EC: 0,
      EM: "Find user successfully",
      USER: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.log(">>> Error find user by email: ", error);
    return { EC: 1, EM: "Failed to find user" };
  }
};

const loginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        EC: 1,
        EM: "Email or password is incorrect",
      };
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const payload = {
          email: user.email,
          name: user.name,
          phone: user.phone,
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        });
        return {
          EC: 0,
          EM: "Login successfully",
          TOKEN: token,
          USER: {
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
        };
      } else {
        return {
          EC: 2,
          EM: "Email or password is incorrect",
        };
      }
    }
  } catch (error) {
    console.log(">>> Error login user: ", error);
    return { EC: 3, EM: "Failed to login user" };
  }
};

module.exports = {
  createUserService,
  findUserByEmailService,
  loginUserService,
};
