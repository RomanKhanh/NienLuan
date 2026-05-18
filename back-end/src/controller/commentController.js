const {
  createCommentService,
  getRestaurantCommentsService,
} = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const data = {
      ...req.body,
      restaurantId: req.params.restaurantId,
      userId: req.user._id,
    };
    const result = await createCommentService(data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getRestaurantComments = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const comments = await getRestaurantCommentsService(restaurantId);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { createComment, getRestaurantComments };
