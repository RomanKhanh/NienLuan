const {
  createPostService,
  getPostByIDService,
  getPostsService,
} = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const { restaurantId, description, images, rating } = req.body;
    const data = {
      userId: req.user._id || req.user.id,
      restaurantId: restaurantId,
      description: description,
      images: images,
      rating: rating,
    };
    const result = await createPostService(data);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostByID = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPostByIDService(id);
    return res.status(200).json(post);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await getPostsService();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  getPostByID,
  getPosts,
};
