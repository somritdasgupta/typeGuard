import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const dim = dimensions[size];

  return (
    <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1D4ED8" />
      <path d="M16 6L26 11.5V20.5L16 26L6 20.5V11.5L16 6Z" fill="#FFFFFF" />
      <path d="M16 10L21 13V19L16 22L11 19V13L16 10Z" fill="#1D4ED8" />
    </svg>
  );
};
