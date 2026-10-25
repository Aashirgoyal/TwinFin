import axios from "axios";

// Customer routes live at the backend root (see twinfin-backend/app.js)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

// Attach the customer token automatically when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("customerToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired token: clear the session and go to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("customerToken")) {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customer");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (err) => err.response?.data?.message || err.message || "Something went wrong";

export const money = (n, currency = JSON.parse(localStorage.getItem("customer") || "{}").currency || "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);

export default api;
