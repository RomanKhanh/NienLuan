const {
  createUserService,
  findUserByEmailService,
  loginUserService,
} = require("../services/userService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const newUser = await createUserService(name, email, password, phone);
    return res.status(200).json(newUser);
  } catch (error) {
    console.log(">>> Error create user: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const findUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await findUserByEmailService(email);
    return res.status(200).json(user);
  } catch (error) {
    console.log(">>> Error find user by email: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService(email, password);
    return res.status(200).json(user);
  } catch (error) {
    console.log(">>> Error login user: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAccountInfo = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  createUser,
  findUserByEmail,
  loginUser,
  getAccountInfo,
};
