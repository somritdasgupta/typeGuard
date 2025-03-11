import React from 'react';

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm focus:outline-none ${
        active
          ? 'bg-gray-850 text-white border-b-2 border-blue-500'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
};
