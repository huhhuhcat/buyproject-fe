import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton, 
  onBack,
  className = "min-h-screen bg-gray-50"
}) => {
  return (
    <div className={className}>
      <Header 
        title={title} 
        subtitle={subtitle} 
        showBackButton={showBackButton} 
        onBack={onBack} 
      />
      {children}
    </div>
  );
};

export default Layout;