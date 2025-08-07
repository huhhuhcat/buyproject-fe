import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartIcon from '../components/CartIcon';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">代購平台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <CartIcon />
              <Link
                to="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                {user?.firstName} {user?.lastName}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                歡迎來到代購平台
              </h2>
              
              {!user?.userType ? (
                <div className="mb-8">
                  <p className="text-gray-600 mb-4">
                    請選擇您的用戶類型以開始使用平台功能
                  </p>
                  <Link
                    to="/user-type"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium inline-block"
                  >
                    選擇用戶類型
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      商品管理
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user.userType === 'BUYER' ? '瀏覽所有商品' : '管理您的商品'}
                    </p>
                    <Link
                      to="/products"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block"
                    >
                      {user.userType === 'BUYER' ? '瀏覽商品' : '管理商品'}
                    </Link>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      購物車
                    </h3>
                    <p className="text-gray-600 mb-4">
                      查看和管理您的購物車商品
                    </p>
                    <Link
                      to="/cart"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block"
                    >
                      查看購物車
                    </Link>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      個人資料
                    </h3>
                    <p className="text-gray-600 mb-4">
                      查看和編輯個人資料與設定
                    </p>
                    <Link
                      to="/profile"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block"
                    >
                      個人資料
                    </Link>
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

export default Dashboard;