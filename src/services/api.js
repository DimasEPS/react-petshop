import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/check-auth"),
};

// Admin Products API
export const adminProductsAPI = {
  getAll: () => api.get("/admin/products/get"),
  add: (data) => api.post("/admin/products/add", data),
  edit: (id, data) => api.put(`/admin/products/edit/${id}`, data),
  delete: (id) => api.delete(`/admin/products/delete/${id}`),
  uploadImage: (formData) =>
    api.post("/admin/products/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Admin Users API
export const adminUsersAPI = {
  getAll: () => api.get("/admin/users/get"),
  delete: (id) => api.delete(`/admin/users/delete/${id}`),
  getDashboardStats: () => api.get("/admin/users/dashboard"),
};

export default api;
