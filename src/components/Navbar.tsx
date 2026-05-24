'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode, user } = useApp();

  if (pathname === '/' || pathname === '/login') return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-border dark:border-dark-border"
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="small" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-surface hover:text-primary transition-all"
            aria-label="Toggle theme"
          >
            {isDarkMode
              ? <Sun size={18} className="text-amber-400" />
              : <Moon size={18} />}
          </button>

          {user && (
            <Link href="/profile"
              className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/25 hover:bg-primary-dark transition-all">
              {user.name.charAt(0).toUpperCase()}
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
