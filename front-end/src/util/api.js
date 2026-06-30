import axios from "./axios.customize";

const callRegisterAPI = (name, email, phone, password) => {
  const URL = "/api/register";
  const data = {
    name,
    email,
    phone,
    password,
  };
  return axios.post(URL, data);
};

const callFindUserByEmailAPI = (email) => {
  const URL = `/api/users/${email}`;
  return axios.get(URL);
};

const callLoginAPI = (email, password) => {
  const URL = "/api/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL, data);
};

const callGoogleLoginAPI = (data) => {
  const URL = "/api/google-login";

  return axios.post(URL, data);
};

const callUpdateProfileAPI = (data) => {
  const URL = "/api/update-profile";
  return axios.patch(URL, data);
};

const callChangePasswordAPI = (currentPassword, newPassword) => {
  const URL = "/api/change-password";
  const data = {
    currentPassword,
    newPassword,
  };
  return axios.patch(URL, data);
};

const callCreateRestaurantAPI = (data) => {
  const URL = "/api/create-restaurant";
  return axios.post(URL, data);
};

const callCreatePostAPI = (restaurantId, description, images, rating) => {
  const URL = "/api/create-post";
  const data = {
    restaurantId,
    description,
    images,
    rating,
  };
  return axios.post(URL, data);
};

const callFetchPostsAPI = async (search = "", category = "") => {
  const URL = "/api/posts";
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  return axios.get(URL, { params });
};

const callGetPostByIdAPI = async (id) => {
  const URL = `/api/post/${id}`;
  return axios.get(URL);
};

const callFetchRestaurantAPI = async (id) => {
  const URL = `/api/restaurant/${id}`;
  return axios.get(URL);
};

const callCreateCommentAPI = async (postId, newText, newRating) => {
  const URL = `/api/post/${postId}/create-comment`;
  const data = { text: newText, rating: newRating };
  return axios.post(URL, data);
};

const callFetchCommentsAPI = async (postId) => {
  const URL = `/api/post/${postId}/comments`;
  return axios.get(URL);
};

const callLikeAPI = async (postId) => {
  const URL = `/api/post/${postId}/like`;
  return axios.post(URL);
};

const callUnlikeAPI = async (postId) => {
  const URL = `/api/post/${postId}/unlike`;
  return axios.post(URL);
};

const callAddFavoritePostAPI = async (postId) => {
  const URL = `/api/post/${postId}/favorite`;
  return axios.post(URL);
};

const callRemoveFavoritePostAPI = async (postId) => {
  const URL = `/api/post/${postId}/unfavorite`;
  return axios.post(URL);
};

const callGetFavoritePostsAPI = async () => {
  const URL = "/api/favorites";
  return axios.get(URL);
};
export {
  callRegisterAPI,
  callFindUserByEmailAPI,
  callLoginAPI,
  callGoogleLoginAPI,
  callUpdateProfileAPI,
  callChangePasswordAPI,
  callCreateRestaurantAPI,
  callCreatePostAPI,
  callFetchPostsAPI,
  callFetchRestaurantAPI,
  callGetPostByIdAPI,
  callCreateCommentAPI,
  callFetchCommentsAPI,
  callLikeAPI,
  callUnlikeAPI,
  callAddFavoritePostAPI,
  callRemoveFavoritePostAPI,
  callGetFavoritePostsAPI,
};
