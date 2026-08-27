import axios from "axios";

const sessionApi = axios.create({
  baseURL: import.meta.env.VITE_SESSION_API_BASE_URL || "http://localhost:8082",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

/* =========================================================
   JWT REQUEST INTERCEPTOR
   ========================================================= */

sessionApi.interceptors.request.use(
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

sessionApi.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("echolife_auth_token");
      localStorage.removeItem("echolife_auth_user");
    }

    return Promise.reject(error);
  },
);

export default sessionApi;
