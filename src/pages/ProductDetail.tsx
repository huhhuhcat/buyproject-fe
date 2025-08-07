import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { Product } from '../types';
import CartIcon from '../components/CartIcon';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '商品不存在或載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      // 可以顯示成功消息或導航到購物車
      navigate('/cart');
    } catch (err) {
      setError('添加到購物車失敗');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  const canAddToCart = product && 
    product.status === 'ACTIVE' && 
    product.quantity > 0 && 
    user?.id !== product.agent.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                  代購平台
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                  代購平台
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <CartIcon />
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  登出
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                代購平台
              </Link>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-700 hover:text-gray-900"
              >
                返回
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <CartIcon />
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover object-center"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">無圖片</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-indigo-600">
                    NT$ {product.price.toLocaleString()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    product.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'ACTIVE' ? '上架中' : '已下架'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">商品描述</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">分類</span>
                    <p className="text-gray-900">{product.category || '未分類'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">品牌</span>
                    <p className="text-gray-900">{product.brand || '未指定'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">庫存</span>
                    <p className="text-gray-900">{product.quantity} 件</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">代購人</span>
                    <p className="text-gray-900">
                      {product.agent.firstName} {product.agent.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              {canAddToCart && (
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm font-medium text-gray-900">數量：</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center bg-white text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                        className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md text-lg font-medium"
                  >
                    {addingToCart ? '加入中...' : '加入購物車'}
                  </button>
                </div>
              )}

              {!canAddToCart && product.quantity === 0 && (
                <div className="border-t pt-6">
                  <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md">
                    此商品目前缺貨
                  </div>
                </div>
              )}

              {!canAddToCart && user?.id === product.agent.id && (
                <div className="border-t pt-6">
                  <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded-md">
                    這是您的商品，無法加入購物車
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;