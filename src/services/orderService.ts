import api from './api';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  productImageUrl?: string;
  agentName: string;
  agentId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  statusDisplayName: string;
  totalAmount: number;
  totalItems: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  notes?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: UserSummary;
}

export interface CreateOrderRequest {
  items?: Array<{
    productId: number;
    quantity: number;
  }>;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  notes?: string;
}

export interface OrderStatus {
  [key: string]: string;
}

class OrderService {
  // 創建訂單
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await api.post('/api/orders', request);
    return response.data;
  }

  // 從購物車創建訂單
  async createOrderFromCart(request: Omit<CreateOrderRequest, 'items'>): Promise<Order> {
    const response = await api.post('/api/orders/from-cart', request);
    return response.data;
  }

  // 獲取用戶訂單列表（分頁）
  async getUserOrders(page: number = 0, size: number = 10): Promise<Order[]> {
    const response = await api.get('/api/orders', {
      params: { page, size }
    });
    return response.data;
  }

  // 獲取用戶所有訂單
  async getAllUserOrders(): Promise<Order[]> {
    const response = await api.get('/api/orders/all');
    return response.data;
  }

  // 根據ID獲取訂單詳情
  async getOrderById(orderId: number): Promise<Order> {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  }

  // 根據訂單號獲取訂單詳情
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`/api/orders/number/${orderNumber}`);
    return response.data;
  }

  // 更新訂單狀態（代購商操作）
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  }

  // 取消訂單（用戶操作）
  async cancelOrder(orderId: number): Promise<Order> {
    const response = await api.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  }

  // 獲取代購商相關的訂單（分頁）
  async getAgentOrders(page: number = 0, size: number = 10): Promise<Order[]> {
    const response = await api.get('/api/orders/agent', {
      params: { page, size }
    });
    return response.data;
  }

  // 獲取代購商待處理的訂單
  async getAgentPendingOrders(): Promise<Order[]> {
    const response = await api.get('/api/orders/agent/pending');
    return response.data;
  }

  // 獲取訂單狀態列表
  async getOrderStatuses(): Promise<OrderStatus> {
    const response = await api.get('/api/orders/statuses');
    return response.data;
  }

  // 輔助方法：格式化訂單狀態顯示
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-indigo-100 text-indigo-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // 輔助方法：檢查訂單是否可以取消
  canCancelOrder(status: string): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  // 輔助方法：檢查訂單是否可以更新狀態（代購商）
  canUpdateStatus(status: string): boolean {
    return ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status);
  }

  // 輔助方法：獲取下一個可用狀態
  getNextStatuses(currentStatus: string): string[] {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING':
        return ['SHIPPED', 'CANCELLED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      case 'DELIVERED':
        return ['COMPLETED', 'REFUNDED'];
      case 'COMPLETED':
        return ['REFUNDED'];
      default:
        return [];
    }
  }

  // 輔助方法：格式化日期
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 輔助方法：格式化金額
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(amount);
  }
}

const orderService = new OrderService();
export default orderService;
export { CreateOrderRequest };