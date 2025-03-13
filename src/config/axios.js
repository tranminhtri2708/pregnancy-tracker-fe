import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5141/api/Auth/",
  baseURL: "http://localhost:5141/api/",
});
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default api;
