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

export { callRegisterAPI, callFindUserByEmailAPI };
