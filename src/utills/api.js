import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000", // Set this in .env file
  // baseURL: "https://sova-admin.cyberxinfosolution.com", // Set this in .env file
  baseURL: `${process.env.REACT_APP_API_URL}`, // Set this in .env file
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // Remove token on unauthorized
      window.location.href = "/signin"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
