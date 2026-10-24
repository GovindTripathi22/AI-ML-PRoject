import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="TripShield Logo"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6FFFA" />
        </linearGradient>
      </defs>
      {/* Rounded Squircle Container */}
      <rect width="40" height="40" rx="10" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1" />
      {/* Guardian Shield */}
      <path
        d="M20 6.5L31 11V19.8C31 26.5 26.3 32.7 20 34.5C13.7 32.7 9 26.5 9 19.8V11L20 6.5Z"
        fill="url(#shieldGrad)"
      />
      {/* Internal Geometry Shimmer */}
      <path
        d="M20 12L22 17L28 18L23.5 21.5L24.5 27L20 24L15.5 27L16.5 21.5L12 18L18 17L20 12Z"
        fill="#FFFFFF"
        fillOpacity="0.14"
      />
      {/* Sleek Supersonic Aircraft */}
      <path
        d="M20 13L21.8 17.5L27 20.2L21.8 21.1L22.2 25.2L20 24L17.8 25.2L18.2 21.1L13 20.2L18.2 17.5L20 13Z"
        fill="url(#planeGrad)"
      />
      {/* Radar Wave Ring */}
      <circle cx="20" cy="20.5" r="9" stroke="#FFFFFF" strokeOpacity="0.25" strokeDasharray="2 3" strokeWidth="1" />
      {/* Live Protection Pulse Dot */}
      <circle cx="29" cy="11" r="3.2" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
};
