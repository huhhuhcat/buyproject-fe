import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderService, {type CreateOrderRequest } from '../services/orderService';
import Layout from '../components/Layout';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, summary, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    receiverName: user ? `${user.firstName} ${user.lastName}` : '',
    receiverPhone: '',
    shippingAddress: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 檢查是否從購物車頁面來的
  const fromCart = location.state?.fromCart || false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.receiverName.trim()) {
      newErrors.receiverName = '收件人姓名不能為空';
    }

    if (!formData.receiverPhone.trim()) {
      newErrors.receiverPhone = '收件人電話不能為空';
    } else if (!/^[\d\-\+\(\)\s]+$/.test(formData.receiverPhone.trim())) {
      newErrors.receiverPhone = '請輸入有效的電話號碼';
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = '收貨地址不能為空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('購物車是空的，無法結帳');
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      let order;
      
      if (fromCart) {
        // 從購物車創建訂單
        order = await orderService.createOrderFromCart({
          receiverName: formData.receiverName.trim(),
          receiverPhone: formData.receiverPhone.trim(),
          shippingAddress: formData.shippingAddress.trim(),
          notes: formData.notes.trim() || undefined
        });
      } else {
        // 直接創建訂單
        const orderRequest: CreateOrderRequest = {
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          receiverName: formData.receiverName.trim(),
          receiverPhone: formData.receiverPhone.trim(),
          shippingAddress: formData.shippingAddress.trim(),
          notes: formData.notes.trim() || undefined
        };
        
        order = await orderService.createOrder(orderRequest);
      }

      // 清空購物車（如果是從購物車來的）
      if (fromCart) {
        await clearCart();
      }

      // 導航到訂單成功頁面
      navigate('/order-success', {
        state: { 
          order,
          message: '訂單創建成功！'
        }
      });

    } catch (error: any) {
      console.error('創建訂單失敗:', error);
      alert(error.response?.data || error.message || '創建訂單失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    return (
      <Layout title="結帳" showBackButton onBack={() => navigate('/cart')}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-4">購物車是空的</div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              去逛逛
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="結帳" showBackButton onBack={() => navigate('/cart')}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 收貨資訊 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">收貨資訊</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700 mb-1">
                    收件人姓名 *
                  </label>
                  <input
                    type="text"
                    id="receiverName"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.receiverName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="請輸入收件人姓名"
                  />
                  {errors.receiverName && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    收件人電話 *
                  </label>
                  <input
                    type="tel"
                    id="receiverPhone"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.receiverPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="請輸入收件人電話"
                  />
                  {errors.receiverPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverPhone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    收貨地址 *
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="請輸入詳細的收貨地址"
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    訂單備註
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="選填：對訂單的特殊要求或備註"
                  />
                </div>
              </div>
            </div>

            {/* 訂單摘要 */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">訂單摘要</h2>
              
              {/* 商品列表 */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
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
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500">代購商: {item.sellerName}</p>
                      <div className="flex items-center justify-between mt-1">
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

              {/* 總計 */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span>商品總計 ({summary.itemCount} 件)</span>
                  <span>NT$ {summary.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>運費</span>
                  <span className="text-green-600">免運費</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>應付總額</span>
                  <span className="text-blue-600">NT$ {summary.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              返回購物車
            </button>
            
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '處理中...' : '確認下單'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;