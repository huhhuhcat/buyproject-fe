import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const Profile: React.FC = () => {
  const { user, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [selectedUserType, setSelectedUserType] = useState<'BUYER' | 'AGENT' | 'BOTH'>(
    user?.userType || 'BUYER'
  );

  const handleUserTypeUpdate = async () => {
    if (!user || selectedUserType === user.userType) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateUserType(selectedUserType);
      
      // 更新本地用戶狀態
      login({
        ...user,
        userType: selectedUserType
      });
      
      setSuccess('用戶類型更新成功！');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || '更新失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: 'BUYER' as const,
      title: '委託代購',
      description: '我想要委託別人幫我代購商品',
      icon: '🛍️'
    },
    {
      value: 'AGENT' as const,
      title: '代購人',
      description: '我想要提供代購服務給其他人',
      icon: '🚀'
    },
    {
      value: 'BOTH' as const,
      title: '兩者皆是',
      description: '我既想要委託代購，也想要提供代購服務',
      icon: '⚡'
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                代購平台
              </Link>
              <span className="text-gray-500">|</span>
              <h1 className="text-lg text-gray-700">個人資料</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user.firstName} {user.lastName}
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

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">個人資料</h2>
          </div>

          {error && (
            <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">姓名</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">電子郵件</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  {user.email}
                  {user.emailVerified && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      已驗證
                    </span>
                  )}
                  {!user.emailVerified && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      未驗證
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">電話號碼</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.phone || '未設定'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">帳戶類型</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.role === 'ADMIN' ? '管理員' : '一般用戶'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">註冊方式</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.provider === 'LOCAL' ? '本地註冊' : 'Google 登入'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">註冊時間</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                </dd>
              </div>
            </dl>
          </div>

          {/* 用戶類型設定 */}
          <div className="border-t border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">用戶類型</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    編輯
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 pb-6">
              {!isEditing ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {userTypeOptions.find(option => option.value === user.userType)?.icon}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {userTypeOptions.find(option => option.value === user.userType)?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {userTypeOptions.find(option => option.value === user.userType)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {userTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`relative flex cursor-pointer rounded-lg p-4 shadow-sm focus:outline-none ${
                          selectedUserType === option.value
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={option.value}
                          className="sr-only"
                          checked={selectedUserType === option.value}
                          onChange={(e) => setSelectedUserType(e.target.value as typeof selectedUserType)}
                        />
                        <span className="text-2xl mr-3">{option.icon}</span>
                        <div className="flex flex-col flex-1">
                          <span className="block text-sm font-medium text-gray-900">
                            {option.title}
                          </span>
                          <span className="mt-1 block text-sm text-gray-600">
                            {option.description}
                          </span>
                        </div>
                        {selectedUserType === option.value && (
                          <div className="absolute -inset-px rounded-lg border-2 border-blue-500 pointer-events-none" />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleUserTypeUpdate}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {isLoading ? '更新中...' : '確認更新'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedUserType(user.userType);
                        setError('');
                      }}
                      disabled={isLoading}
                      className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 快速導航 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/products"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">商品管理</h3>
                <p className="text-sm text-gray-600">
                  {user.userType === 'BUYER' ? '瀏覽所有商品' : '管理我的商品'}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/cart"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">🛒</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">購物車</h3>
                <p className="text-sm text-gray-600">查看購物車中的商品</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Profile;