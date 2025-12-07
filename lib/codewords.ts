import { createServiceClient } from "@codewords/client";

const client = createServiceClient(process.env.CODEWORDS_API_KEY!);
const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID!;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  rating: number;
  image: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export const api = {
  getDashboard: async () => {
    return await client.runService(SERVICE_ID, "/", { show_details: true });
  },

  register: async (username: string, email: string, password: string) => {
    return await client.runService(SERVICE_ID, "/user/register", { username, email, password });
  },

  login: async (username: string, password: string) => {
    return await client.runService(SERVICE_ID, "/user/login", { username, password });
  },

  listProducts: async () => {
    return await client.runService(SERVICE_ID, "/products/list", {});
  },

  searchProducts: async (query: string, limit: number = 10) => {
    return await client.runService(SERVICE_ID, "/products/search", { query, limit });
  },

  addToCart: async (user_id: string, product_id: string, quantity: number = 1) => {
    return await client.runService(SERVICE_ID, "/cart/add", { user_id, product_id, quantity });
  },

  viewCart: async (user_id: string) => {
    return await client.runService(SERVICE_ID, "/cart/view", { user_id });
  },

  createOrder: async (user_id: string, delivery_address: string, priority = "standard", payment_method = "credit_card") => {
    return await client.runService(SERVICE_ID, "/orders/create", { user_id, delivery_address, priority, payment_method });
  },

  getOrderHistory: async (user_id: string) => {
    return await client.runService(SERVICE_ID, "/orders/history", { user_id });
  },

  addReview: async (user_id: string, product_id: string, rating: number, comment: string) => {
    return await client.runService(SERVICE_ID, "/reviews/add", { user_id, product_id, rating, comment });
  },

  getReviews: async (product_id: string) => {
    return await client.runService(SERVICE_ID, "/reviews/get", { product_id });
  },

  checkStock: async (product_id: string) => {
    return await client.runService(SERVICE_ID, "/inventory/check", { product_id });
  },
};
