import axios from "axios";
import { login, logout } from "../stores/slices/authSlice";
import { refreshAccessToken } from "./authService";
import { store } from "../stores/store";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  timeout: 20000,
  withCredentials: true,
});

let isRefreshing = false; // Track if a refresh is in progress
let refreshSubscribers = []; // Queue failed requests

const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 🔹 Attach Access Token to Every Request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle Expired Tokens & Retry Requests
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Network Errors
    if (error.code === "ERR_NETWORK") {
      error.message = "Server error. Please try again!";
      return Promise.reject(error);
    }

    // Handle Refresh Token Expiration
    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      error.message = "Refresh token is invalid. Please log in again.";
      store.dispatch(logout());
      return Promise.reject(error);
    }

    // Handle Access Token Expiration
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newAccessToken);

          // Update Redux store
          const state = store.getState();
          store.dispatch(
            login({
              user: state.auth.user,
              accessToken: newAccessToken,
            })
          );

          // Update Axios headers globally
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        } catch (err) {
          isRefreshing = false;
          store.dispatch(logout());
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
