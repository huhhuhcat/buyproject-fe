import api from './api';
import type { Product, ProductRequest } from '../types';

export const productService = {
  async createProduct(productData: ProductRequest): Promise<Product> {
    const response = await api.post<Product>('/api/products', productData);
    return response.data;
  },

  async getMyProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/api/products/my');
    return response.data;
  },

  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/api/products');
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  async updateProduct(id: number, productData: ProductRequest): Promise<Product> {
    const response = await api.put<Product>(`/api/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  }
};