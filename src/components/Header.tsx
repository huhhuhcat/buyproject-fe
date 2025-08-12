import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';
import UserDropdown from './UserDropdown';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showBackButton, onBack }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              BondBuy
            </Link>
            {title && (
              <>
                <span className="text-gray-500">|</span>
                <div className="flex items-center space-x-2">
                  {showBackButton && (
                    <button
                      onClick={onBack}
                      className="text-gray-700 hover:text-gray-900 mr-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h1 className="text-lg text-gray-700">
                    {title}
                  </h1>
                </div>
              </>
            )}
            {subtitle && (
              <>
                <span className="text-gray-500">|</span>
                <span className="text-sm text-gray-600">{subtitle}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && <CartIcon />}
            {user ? (
              <UserDropdown />
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 px-3 py-2 text-sm font-medium"
                >
                  登入
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  註冊
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;