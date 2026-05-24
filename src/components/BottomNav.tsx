'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Bell, User, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: History, label: 'History', href: '/history' },
  { icon: Plus, label: 'Add', href: '/add', isCenter: true },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { getUnreadAlertCount } = useApp();

  if (pathname === '/' || pathname === '/login') return null;

  const unread = getUnreadAlertCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 sm:bottom-5 sm:px-4">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-border dark:border-dark-border rounded-[28px] px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-1"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          const showBadge = item.href === '/alerts' && unread > 0;

          if (item.isCenter) {
            return (
              <Link key={item.href} href={item.href}
                className="relative flex-shrink-0 -mt-6">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(21,101,192,0.45)] border-4 border-white dark:border-zinc-900">
                  <Plus size={26} strokeWidth={2.5} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 py-2.5 rounded-2xl transition-all group">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-2xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}

              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-colors ${isActive ? 'text-primary' : 'text-text-muted dark:text-dark-text-secondary group-hover:text-primary'}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-danger text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bold transition-colors ${isActive ? 'text-primary' : 'text-text-muted dark:text-dark-text-secondary group-hover:text-primary'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
