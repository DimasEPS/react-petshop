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

// Admin Orders API
export const adminOrdersAPI = {
  getAll: () => api.get("/admin/orders/get"),
  getDetail: (id) => api.get(`/admin/orders/detail/${id}`),
  updateStatus: (id, status) =>
    api.put(`/admin/orders/status/${id}`, { status }),
  getStats: () => api.get("/admin/orders/stats"),
};

// Admin Bookings API
export const adminBookingsAPI = {
  getAll: () => api.get("/admin/bookings/get"),
  updateStatus: (id, status) =>
    api.put(`/admin/bookings/status/${id}`, { status }),
  getStats: () => api.get("/admin/bookings/stats"),
};

// Shop Products API (public)
export const shopProductsAPI = {
  getAll: (params) => api.get("/shop/products", { params }),
  getById: (id) => api.get(`/shop/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get("/shop/cart"),
  add: (data) => api.post("/shop/cart", data),
  update: (itemId, data) => api.put(`/shop/cart/${itemId}`, data),
  remove: (itemId) => api.delete(`/shop/cart/${itemId}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get("/shop/orders"),
  getById: (id) => api.get(`/shop/orders/${id}`),
  create: (data) => api.post("/shop/orders", data),
  cancel: (id) => api.put(`/shop/orders/${id}/cancel`),
};

// Address API
export const addressAPI = {
  getAll: () => api.get("/shop/address"),
  add: (data) => api.post("/shop/address", data),
  update: (id, data) => api.put(`/shop/address/${id}`, data),
  remove: (id) => api.delete(`/shop/address/${id}`),
  setDefault: (id) => api.put(`/shop/address/${id}/default`),
};

// Profile API
export const profileAPI = {
  get: () => api.get("/shop/profile"),
  update: (data) => api.put("/shop/profile", data),
  changePassword: (data) => api.put("/shop/profile/password", data),
};

// Booking API
export const bookingAPI = {
  getAll: () => api.get("/shop/booking"),
  create: (data) => api.post("/shop/booking", data),
  cancel: (id) => api.put(`/shop/booking/${id}/cancel`),
  getSlots: (date) => api.get("/shop/booking/slots", { params: { date } }),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get("/shop/wishlist"),
  toggle: (productId) => api.post("/shop/wishlist/toggle", { productId }),
};

export default api;
