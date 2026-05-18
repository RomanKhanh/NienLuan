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

const callFetchPostsAPI = async () => {
  const URL = "/api/posts";
  return axios.get(URL);
};

const callGetPostByIdAPI = async (id) => {
  const URL = `/api/post/${id}`;
  return axios.get(URL);
};

const callFetchRestaurantAPI = async (id) => {
  const URL = `/api/restaurant/${id}`;
  return axios.get(URL);
};

const callCreateCommentAPI = async (restaurantId, newText, newRating) => {
  const URL = `/api/restaurant/${restaurantId}/create-comment`;
  const data = { text: newText, rating: newRating };
  return axios.post(URL, data);
};

const callFetchCommentsAPI = async (restaurantId) => {
  const URL = `/api/restaurant/${restaurantId}/comments`;
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
};
