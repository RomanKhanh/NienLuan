const {
  createRestaurantService,
  getRestaurantByIDService,
} = require("../services/restaurantService");

const createRestaurant = async (req, res) => {
  try {
    const data = req.body;
    const result = await createRestaurantService(data);

    return res.status(200).json(result);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRestaurantByID = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await getRestaurantByIDService(id);
    return res.status(200).json(restaurant);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurantByID,
};
