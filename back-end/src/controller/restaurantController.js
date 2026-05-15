const { createRestaurantService } = require("../services/restaurantService");

const createRestaurant = async (req, res) => {
  const data = req.body;
  const result = await createRestaurantService(data);

  return res.status(200).json(result);
};

module.exports = {
  createRestaurant,
};
