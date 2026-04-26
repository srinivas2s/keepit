'use client';

import { useApp } from '@/context/AppContext';

export default function Logo({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" | "large" }) {
  const { isDarkMode } = useApp();

  const dimensions = {
    small: { w: 100, h: 28, iconSize: 20 },
    normal: { w: 140, h: 40, iconSize: 28 },
    large: { w: 200, h: 56, iconSize: 40 }
  }[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {/* Light Theme: Pure White to Light Blue */}
            {/* Dark Theme: Pure Black to Dark Blue */}
            <stop offset="0%" stopColor={isDarkMode ? "#000000" : "#FFFFFF"} />
            <stop offset="100%" stopColor={isDarkMode ? "#0D47A1" : "#64B5F6"} />
          </linearGradient>
        </defs>
        <path
          d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22C16.59 21.05 20 16.19 20 11V5L12 2Z"
          fill="url(#logoGradient)"
          stroke={isDarkMode ? "#1E88E5" : "#2196F3"}
          strokeWidth="1.5"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke={isDarkMode ? "#FFFFFF" : "#1565C0"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span 
        className="font-bold tracking-tight" 
        style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: size === 'small' ? '1.1rem' : size === 'normal' ? '1.5rem' : '2.2rem',
          background: isDarkMode 
            ? 'linear-gradient(to right, #FFFFFF, #90CAF9)' 
            : 'linear-gradient(to right, #1565C0, #1E88E5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        KeepIt
      </span>
    </div>
  );
}
