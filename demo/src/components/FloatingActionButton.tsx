import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  children,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed right-4 bottom-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      aria-label={label}
    >
      {children}
    </button>
  );
};
