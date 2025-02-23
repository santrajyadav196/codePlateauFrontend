import axiosInstance from "./axiosInstance";

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

export const refreshAccessToken = async () => {
  const { data } = await axiosInstance.post("/auth/refresh-token");
  return data.accessToken;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const getUserProfile = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};

export const updateUserRole = async (formData) => {
  const { data } = await axiosInstance.put("/auth/update-role", formData);
  return data;
};

export const fetchUsers = async () => {
  const { data } = await axiosInstance.get("/auth/users");
  return data;
};
