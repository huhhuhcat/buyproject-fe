import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type {Order} from '../services/orderService';
import Layout from '../components/Layout';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { order, message }: { order?: Order; message?: string } = location.state || {};

  if (!order) {
    return (
      <Layout title="訂單結果">
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="text-gray-500 mb-4">無法找到訂單資訊</div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            回到首頁
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="訂單成功">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          
          {/* 成功標題 */}
          <div className="bg-green-50 px-6 py-8 text-center border-b">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">訂單創建成功！</h1>
            <p className="text-green-600">{message || '您的訂單已成功提交'}</p>
          </div>

          {/* 訂單資訊 */}
          <div className="px-6 py-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">訂單編號:</span>
                <span className="font-mono text-gray-900 font-medium">{order.orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">訂單狀態:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800`}>
                  {order.statusDisplayName}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">訂單金額:</span>
                <span className="text-lg font-semibold text-blue-600">
                  NT$ {order.totalAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">商品數量:</span>
                <span className="font-medium">{order.totalItems} 件</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">收件人:</span>
                <span className="font-medium">{order.receiverName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">聯絡電話:</span>
                <span className="font-medium">{order.receiverPhone}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block mb-1">收貨地址:</span>
                <span className="font-medium text-gray-900">{order.shippingAddress}</span>
              </div>
              
              {order.notes && (
                <div>
                  <span className="text-gray-600 block mb-1">訂單備註:</span>
                  <span className="text-gray-900">{order.notes}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">下單時間:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleString('zh-TW')}
                </span>
              </div>
              
              {order.expectedDeliveryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">預計送達:</span>
                  <span className="font-medium text-green-600">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString('zh-TW')}
                  </span>
                </div>
              )}
            </div>

            {/* 訂單商品 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">訂單商品</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
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
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">代購商: {item.agentName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">
                          NT$ {item.unitPrice.toLocaleString()} × {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          NT$ {item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                查看我的訂單
              </button>
              
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
              >
                查看訂單詳情
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 font-medium"
              >
                繼續購物
              </button>
            </div>
          </div>
        </div>

        {/* 提示訊息 */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>重要提醒:</strong> 您的訂單已提交給相關代購商處理，我們會透過郵件或簡訊通知您訂單狀態的變更。
                如有任何問題，請聯絡我們的客服團隊。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;