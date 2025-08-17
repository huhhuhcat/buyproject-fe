import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService, {type Order } from '../services/orderService';
import Layout from '../components/Layout';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (id && user) {
      fetchOrder();
    }
  }, [id, user]);

  useEffect(() => {
    if (order) {
      const nextStatuses = orderService.getNextStatuses(order.status);
      setAvailableStatuses(nextStatuses);
    }
  }, [order]);

  const fetchOrder = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderData = await orderService.getOrderById(parseInt(id));
      setOrder(orderData);
    } catch (err: any) {
      console.error('獲取訂單詳情失敗:', err);
      setError(err.response?.data || err.message || '獲取訂單詳情失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || !id) return;
    
    const statusNames: { [key: string]: string } = {
      'CONFIRMED': '確認',
      'PROCESSING': '處理',
      'SHIPPED': '發貨',
      'DELIVERED': '送達',
      'COMPLETED': '完成',
      'CANCELLED': '取消',
      'REFUNDED': '退款'
    };
    
    if (!window.confirm(`確定要將訂單狀態更新為「${statusNames[newStatus] || newStatus}」嗎？`)) {
      return;
    }
    
    setUpdating(true);
    try {
      const updatedOrder = await orderService.updateOrderStatus(parseInt(id), newStatus);
      setOrder(updatedOrder);
      alert('訂單狀態已成功更新');
    } catch (err: any) {
      alert(err.response?.data || err.message || '更新訂單狀態失敗');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !id) return;
    
    if (!window.confirm('確定要取消此訂單嗎？取消後將恢復商品庫存。')) {
      return;
    }
    
    setUpdating(true);
    try {
      const updatedOrder = await orderService.cancelOrder(parseInt(id));
      setOrder(updatedOrder);
      alert('訂單已成功取消');
    } catch (err: any) {
      alert(err.response?.data || err.message || '取消訂單失敗');
    } finally {
      setUpdating(false);
    }
  };

  const isOwner = order && user && order.user.id === user.id;
  const isAgent = order && user && 
    (user.userType === 'AGENT' || user.userType === 'BOTH') &&
    order.orderItems.some(item => item.agentId === user.id);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <Layout title="訂單詳情" showBackButton onBack={() => navigate('/orders')}>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout title="訂單詳情" showBackButton onBack={() => navigate('/orders')}>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="text-red-600 text-lg mb-4">{error || '訂單不存在'}</div>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            返回訂單列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="訂單詳情" showBackButton onBack={() => navigate('/orders')}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        
        {/* 訂單標題與狀態 */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                訂單 #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                下單時間: {new Date(order.createdAt).toLocaleString('zh-TW')}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${orderService.getStatusColor(order.status)}`}>
                {order.statusDisplayName}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 主要內容 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 訂單商品 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單商品</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          無圖片
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      {item.productDescription && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.productDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                          <span>代購商: {item.agentName}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">
                            NT$ {item.unitPrice.toLocaleString()} × {item.quantity}
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            NT$ {item.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 訂單總計 */}
              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    總計 ({order.totalItems} 件商品)
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    NT$ {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 配送資訊 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">配送資訊</h2>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">收件人</label>
                    <p className="mt-1 text-sm text-gray-900">{order.receiverName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">聯絡電話</label>
                    <p className="mt-1 text-sm text-gray-900">{order.receiverPhone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">收貨地址</label>
                  <p className="mt-1 text-sm text-gray-900">{order.shippingAddress}</p>
                </div>
                
                {order.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">訂單備註</label>
                    <p className="mt-1 text-sm text-gray-900">{order.notes}</p>
                  </div>
                )}
                
                {order.expectedDeliveryDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">預計送達時間</label>
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                )}
                
                {order.actualDeliveryDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">實際送達時間</label>
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      {new Date(order.actualDeliveryDate).toLocaleString('zh-TW')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            
            {/* 訂單狀態 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單狀態</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${orderService.getStatusColor(order.status)}`}>
                    {order.statusDisplayName}
                  </span>
                </div>
                
                {/* 代購商操作 */}
                {isAgent && availableStatuses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 text-center">更新狀態為:</p>
                    {availableStatuses.map((status) => {
                      const statusNames: { [key: string]: string } = {
                        'CONFIRMED': '確認訂單',
                        'PROCESSING': '開始處理',
                        'SHIPPED': '已發貨',
                        'DELIVERED': '已送達',
                        'COMPLETED': '完成訂單',
                        'CANCELLED': '取消訂單',
                        'REFUNDED': '已退款'
                      };
                      
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          disabled={updating}
                          className="w-full px-3 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? '更新中...' : statusNames[status]}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">操作</h2>
              
              <div className="space-y-3">
                {/* 買家可以取消訂單 */}
                {isOwner && orderService.canCancelOrder(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={updating}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? '處理中...' : '取消訂單'}
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  返回訂單列表
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  繼續購物
                </button>
              </div>
            </div>

            {/* 客服資訊 */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>需要幫助？</strong><br />
                    如對訂單有任何疑問，請聯絡我們的客服團隊或直接與代購商溝通。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;