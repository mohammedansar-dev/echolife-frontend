import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});
/* =========================================================
   JWT REQUEST INTERCEPTOR
   ========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("echolife_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* =========================================================
   AUTH ERROR HANDLING
   ========================================================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("echolife_auth_token");
      localStorage.removeItem("echolife_auth_user");
    }

    return Promise.reject(error);
  },
);

export default api;
