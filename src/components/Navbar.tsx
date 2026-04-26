'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LayoutDashboard, PlusCircle, Bell, User, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isDarkMode, toggleDarkMode, getUnreadAlertCount, user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show navbar on landing or login pages
  if (pathname === '/' || pathname === '/login') return null;

  const unreadCount = getUnreadAlertCount();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/add', label: 'Add Product', icon: <PlusCircle size={20} /> },
    { href: '/alerts', label: 'Alerts', icon: <Bell size={20} />, badge: unreadCount },
    { href: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-border dark:border-dark-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Desktop Links (Left) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 2).map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-text-secondary hover:bg-surface-hover dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <Logo size="small" />
              </Link>
            </div>

            {/* Right Side Links & Actions */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.slice(2).map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-text-secondary hover:bg-surface-hover dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="w-5 h-5 bg-danger text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              
              <div className="w-px h-6 bg-border dark:bg-dark-border mx-2" />
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* User Avatar */}
              {user && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 ml-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-hover dark:hover:bg-dark-surface-hover"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-text dark:bg-dark-text rounded-full origin-left"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-text dark:bg-dark-text rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-text dark:bg-dark-text rounded-full origin-left"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-border dark:border-dark-border overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-surface-hover dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="ml-auto w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border dark:border-dark-border">
                <button
                  onClick={() => { toggleDarkMode(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover w-full"
                >
                  <span className="text-lg flex-shrink-0">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border dark:border-dark-border">
        <div className="flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-text-muted dark:text-dark-text-secondary'
                }`}
              >
                <span className="text-xl flex-shrink-0">{link.icon}</span>
                <span className="text-[10px] font-medium">{link.label.split(' ')[0]}</span>
                {link.badge ? (
                  <span className="absolute -top-0.5 right-0 w-4 h-4 bg-danger text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                ) : null}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-6 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
