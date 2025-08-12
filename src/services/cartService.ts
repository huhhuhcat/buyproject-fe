import api from './api';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productImage?: string;
  sellerName: string;
  availableStock: number;
  addedAt: string;
}

export interface CartSummary {
  itemCount: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

class CartService {
  // 獲取購物車商品
  async getCartItems(): Promise<CartItem[]> {
    const response = await api.get('/api/cart');
    return response.data;
  }

  // 添加商品到購物車
  async addToCart(request: AddToCartRequest): Promise<CartItem> {
    const response = await api.post('/api/cart', request);
    return response.data;
  }

  // 更新購物車商品數量
  async updateCartItem(cartId: number, quantity: number): Promise<CartItem> {
    const response = await api.put(`/api/cart/${cartId}?quantity=${quantity}`);
    return response.data;
  }

  // 從購物車移除商品
  async removeFromCart(cartId: number): Promise<void> {
    await api.delete(`/api/cart/${cartId}`);
  }

  // 清空購物車
  async clearCart(): Promise<void> {
    await api.delete('/api/cart');
  }

  // 獲取購物車摘要
  async getCartSummary(): Promise<CartSummary> {
    const response = await api.get('/api/cart/summary');
    return response.data;
  }
}

export default new CartService();