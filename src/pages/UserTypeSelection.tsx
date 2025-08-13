import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const UserTypeSelection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'BUYER' | 'AGENT' | 'BOTH' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsLoading(true);
    setError('');

    try {
      await userService.updateUserType(selectedType);
      
      if (user) {
        login({
          ...user,
          userType: selectedType
        });
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '更新失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: 'BUYER',
      title: '委託代購',
      description: '我想要委託別人幫我代購商品',
      icon: '🛍️'
    },
    {
      value: 'AGENT',
      title: '代購人',
      description: '我想要提供代購服務給其他人',
      icon: '🚀'
    },
    {
      value: 'BOTH',
      title: '兩者皆是',
      description: '我既想要委託代購，也想要提供代購服務',
      icon: '⚡'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          選擇您的用戶類型
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          請選擇最適合您需求的用戶類型
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {userTypeOptions.map((option) => (
                <div key={option.value} className="relative">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value={option.value}
                      checked={selectedType === option.value}
                      onChange={(e) => setSelectedType(e.target.value as 'BUYER' | 'AGENT' | 'BOTH')}
                      className="sr-only"
                    />
                    <div className={`p-6 rounded-lg border-2 transition-all ${
                      selectedType === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="flex items-start">
                        <div className="text-3xl mr-4">{option.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {option.title}
                          </h3>
                          <p className="text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        {selectedType === option.value && (
                          <div className="ml-4">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={!selectedType || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '更新中...' : '確認選擇'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                返回主頁
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;