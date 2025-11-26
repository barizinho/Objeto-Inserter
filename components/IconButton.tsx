
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  text: string;
  icon: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, text, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors ${className}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default IconButton;
