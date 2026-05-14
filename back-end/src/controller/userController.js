const {
  createUserService,
  findUserByEmailService,
  loginUserService,
  loginGoogleService,
  updateProfileService,
  changePasswordService,
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

const googleLogin = async (req, res) => {
  try {
    console.log("Run google login controller");
    const { email, name } = req.body;
    const existedUser = await findUserByEmailService(email);
    if (existedUser.EC !== 0) {
      await createUserService(name, email, null, null);
    }
    const user = await loginGoogleService(email);
    return res.status(200).json(user);
  } catch (error) {
    console.log(">>> Error google login: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAccountInfo = async (req, res) => {
  const data = await findUserByEmailService(req.user.email);
  return res.status(200).json(data);
};

const updateProfile = async (req, res) => {
  try {
    const { newName, newEmail, newPhone, newAvatar } = req.body;
    const data = await updateProfileService(
      req.user.email,
      newName,
      newEmail,
      newPhone,
      newAvatar,
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await changePasswordService(
    req.user.email,
    currentPassword,
    newPassword,
  );
  return res.status(200).json(result);
};

module.exports = {
  createUser,
  findUserByEmail,
  loginUser,
  getAccountInfo,
  googleLogin,
  updateProfile,
  changePassword,
};
