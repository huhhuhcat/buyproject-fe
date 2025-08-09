import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, summary, loading, error, updateQuantity, removeItem, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartId));
    try {
      await updateQuantity(cartId, newQuantity);
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
    // TODO: 實現結帳功能
    alert('結帳功能即將開放，敬請期待！');
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                >
                  ← 返回
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">購物車</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
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

          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Cart Items */}
          <div className="px-6">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-gray-500 mb-4">購物車是空的</div>
                <button
                  onClick={() => navigate('/dashboard')}
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
                        disabled={updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={() => navigate('/dashboard')}
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
    </div>
  );
};

export default Cart;