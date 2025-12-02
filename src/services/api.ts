import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.exemplo.com",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
