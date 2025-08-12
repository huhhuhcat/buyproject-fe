import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import type { Product, ProductRequest } from '../types';
import ProductForm from '../components/ProductForm';
import Layout from '../components/Layout';

const ProductManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

  const isAgent = user?.userType === 'AGENT' || user?.userType === 'BOTH';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = isAgent 
        ? await productService.getMyProducts()
        : await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '載入商品失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (productData: ProductRequest) => {
    try {
      await productService.createProduct(productData);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || '創建商品失敗');
    }
  };

  const handleUpdateProduct = async (productData: ProductRequest) => {
    if (!editingProduct) return;
    
    try {
      await productService.updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || '更新商品失敗');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('確定要刪除這個商品嗎？')) return;
    
    try {
      await productService.deleteProduct(productId);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || '刪除商品失敗');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleAddToCart = async (productId: number) => {
    setAddingToCart(prev => new Set(prev).add(productId));
    try {
      await addToCart(productId, 1);
    } catch (err) {
      setError('添加到購物車失敗');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <Layout title={isAgent ? '商品管理' : '商品瀏覽'}>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAgent ? '我的商品' : '所有商品'}
            </h2>
            {isAgent && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                新增商品
              </button>
            )}
          </div>

          {showForm && (
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={handleCloseForm}
            />
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isAgent ? '您還沒有上架任何商品' : '目前沒有可用的商品'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:opacity-90"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 
                      className="text-lg font-medium text-gray-900 mb-2 cursor-pointer hover:text-indigo-600"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-indigo-600">
                        NT$ {product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        庫存: {product.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        分類: {product.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'ACTIVE' ? '上架中' : '已下架'}
                      </span>
                    </div>
                    {product.country && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.country.flag} {product.country.name}
                        </span>
                      </div>
                    )}
                    {!isAgent && (
                      <p className="text-sm text-gray-500 mb-4">
                        代購人: {product.agent.firstName} {product.agent.lastName}
                      </p>
                    )}
                    {isAgent && (user?.id === product.agent.id) ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          刪除
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingToCart.has(product.id) || product.quantity === 0 || product.status !== 'ACTIVE'}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {addingToCart.has(product.id) ? '加入中...' : '加入購物車'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ProductManagement;