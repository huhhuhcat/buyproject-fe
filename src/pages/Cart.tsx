import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Cart: React.FC = () => {
  const { items, summary, loading, error, updateQuantity, removeItem, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [updateError, setUpdateError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartId));
    try {
      setUpdateError(null);
      await updateQuantity(cartId, newQuantity);
    } catch (err: any) {
      setUpdateError(err.message || '更新數量失敗');
      setTimeout(() => setUpdateError(null), 3000);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    if (window.confirm('確定要移除此商品嗎？')) {
      await removeItem(cartId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('確定要清空購物車嗎？')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('購物車是空的，無法結帳');
      return;
    }
    
    // 導航到結帳頁面，並傳遞來源信息
    navigate('/checkout', {
      state: { fromCart: true }
    });
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-gray-500">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout title="購物車" showBackButton onBack={() => navigate(-1)}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-700 text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  繼續購物
                </button>
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-500 text-xs sm:text-sm px-2"
                  >
                    清空購物車
                  </button>
                )}
              </div>
            </div>
          </div>

          {(error || updateError) && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{error || updateError}</p>
            </div>
          )}

          {/* Cart Items */}
          <div className="px-6">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-gray-500 mb-4">購物車是空的</div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  去逛逛
                </button>
              </div>
            ) : (
              <div className="py-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">無圖片</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 ml-6">
                      <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.productDescription}</p>
                      <p className="text-sm text-gray-500">代購人: {item.sellerName}</p>
                      <p className="text-sm text-gray-500">庫存: {item.availableStock} 件</p>
                      <p className="text-lg font-medium text-gray-900 mt-2">
                        NT$ {item.unitPrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center ml-6">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center bg-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id) || item.quantity >= item.availableStock}
                        className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={item.quantity >= item.availableStock ? `庫存只剩 ${item.availableStock} 件` : '增加數量'}
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="ml-6 text-right">
                      <p className="text-lg font-medium text-gray-900">
                        NT$ {item.totalPrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div className="ml-6">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-500 text-sm"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">
                  總計 ({summary.itemCount} 件商品)
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  NT$ {summary.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-md hover:bg-gray-200 text-sm sm:text-base font-medium border border-gray-300"
                  >
                    繼續購物
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-md hover:bg-gray-200 text-sm sm:text-base font-medium border border-gray-300"
                  >
                    瀏覽商品
                  </button>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-md hover:bg-blue-700 text-base sm:text-lg font-medium w-full sm:w-auto"
                >
                  前往結帳
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;