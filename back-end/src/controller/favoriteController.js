const {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesByUserIdService,
} = require("../services/favoriteService");

const addFavorite = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const result = await addFavoriteService(userId, postId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const result = await removeFavoriteService(userId, postId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getFavoritesByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getFavoritesByUserIdService(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByUserId,
};
