import axios from "axios";

// Admin routes live under /ad (see twinfin-backend/app.js)
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "/api") + "/ad",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("adminToken")) {
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (err) => err.response?.data?.message || err.message || "Something went wrong";

export default api;
