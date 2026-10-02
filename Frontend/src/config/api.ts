export const API_BASE = "http://localhost:5000";

// Keep compatibility with current backend route mounts.
export const API_AUTH = `${API_BASE}/api/auth`;
export const API_PRODUCTS = `${API_AUTH}/products`;
export const API_CART = `${API_AUTH}/cart`;
export const API_ORDERS = `${API_AUTH}/orders`;
export const API_SETTINGS = API_AUTH;
