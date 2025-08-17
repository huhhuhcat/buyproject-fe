import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService, {type Order } from '../services/orderService';
import Layout from '../components/Layout';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buyer' | 'agent'>('buyer');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let orderData: Order[];
      
      if (activeTab === 'buyer') {
        orderData = await orderService.getAllUserOrders();
      } else {
        // 代購商訂單
        if (user.userType === 'AGENT' || user.userType === 'BOTH') {
          orderData = await orderService.getAgentOrders(0, 100);
        } else {
          orderData = [];
        }
      }
      
      setOrders(orderData);
    } catch (err: any) {
      console.error('獲取訂單失敗:', err);
      setError(err.response?.data || err.message || '獲取訂單失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleCancelOrder = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    
    if (window.confirm('確定要取消此訂單嗎？取消後將恢復商品庫存。')) {
      try {
        await orderService.cancelOrder(orderId);
        await fetchOrders(); // 重新獲取訂單列表
        alert('訂單已成功取消');
      } catch (err: any) {
        alert(err.response?.data || err.message || '取消訂單失敗');
      }
    }
  };

  const canShowAgentTab = user && (user.userType === 'AGENT' || user.userType === 'BOTH');

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout title="我的訂單" showBackButton onBack={() => navigate('/')}>
      <div className="max-w-6xl mx-auto py-6 px-4">
        
        {/* 標籤切換 */}
        {canShowAgentTab && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('buyer')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'buyer'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  我的購買訂單
                </button>
                <button
                  onClick={() => setActiveTab('agent')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'agent'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  代購訂單管理
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* 載入狀態 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* 訂單列表 */}
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  {activeTab === 'buyer' ? '您還沒有任何購買訂單' : '您還沒有任何代購訂單'}
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  去逛逛
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="bg-white shadow-sm hover:shadow-md border border-gray-200 rounded-lg p-6 cursor-pointer transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      
                      {/* 訂單基本資訊 */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              訂單編號: {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {activeTab === 'agent' ? `買家: ${order.user.firstName} ${order.user.lastName}` : `收件人: ${order.receiverName}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderService.getStatusColor(order.status)}`}>
                              {order.statusDisplayName}
                            </span>
                          </div>
                        </div>

                        {/* 商品預覽 */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {order.orderItems.slice(0, 3).map((item, index) => (
                            <div key={item.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-md">
                              <span className="text-sm text-gray-700 truncate max-w-32">
                                {item.productName}
                              </span>
                              <span className="text-xs text-gray-500">×{item.quantity}</span>
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <div className="flex items-center px-3 py-1 bg-gray-100 rounded-md">
                              <span className="text-xs text-gray-600">
                                +{order.orderItems.length - 3} 更多商品
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 訂單統計 */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                          <div className="space-x-4">
                            <span>總計 {order.totalItems} 件商品</span>
                            <span>下單時間: {new Date(order.createdAt).toLocaleDateString('zh-TW')}</span>
                          </div>
                          
                          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                            <span className="text-lg font-semibold text-blue-600">
                              NT$ {order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.id}`);
                          }}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            activeTab === 'agent' && orderService.canUpdateStatus(order.status)
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {activeTab === 'agent' && orderService.canUpdateStatus(order.status) ? '管理訂單' : '查看詳情'}
                        </button>
                        
                        {activeTab === 'buyer' && orderService.canCancelOrder(order.status) && (
                          <button
                            onClick={(e) => handleCancelOrder(e, order.id)}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium"
                          >
                            取消訂單
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 快速操作 */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 font-medium"
            >
              繼續購物
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;