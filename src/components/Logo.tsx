'use client';

import { useApp } from '@/context/AppContext';

export default function Logo({ className = "", size = "normal", forceLight = false }: { className?: string, size?: "small" | "normal" | "large", forceLight?: boolean }) {
  const { isDarkMode: appDarkMode } = useApp();
  const isDarkMode = forceLight ? false : appDarkMode;

  const sizeConfig = {
    small: { w: 120, h: 32, iconSize: 24 },
    normal: { w: 160, h: 48, iconSize: 36 },
    large: { w: 240, h: 64, iconSize: 52 }
  };

  const dimensions = sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.normal;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Shield Shape */}
        <path
          d="M50 5L15 20V50C15 72.5 50 95 50 95C50 95 85 72.5 85 50V20L50 5Z"
          fill="#1565C0"
        />
        {/* Checkmark */}
        <path
          d="M35 50L45 60L65 40"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span 
        className="font-black tracking-tight" 
        style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: size === 'small' ? '1.3rem' : size === 'normal' ? '1.8rem' : '2.8rem',
          color: isDarkMode ? '#FFFFFF' : '#0F172A',
          letterSpacing: '-0.02em'
        }}
      >
        KeepIt
      </span>
    </div>
  );
}
