'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Bell, User, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: History, label: 'History', href: '/history' },
  { icon: Plus, label: 'Add', href: '/add', isCenter: true },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show BottomNav on landing page or login page
  if (pathname === '/' || pathname === '/login') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-8 pt-2 pointer-events-none flex justify-center">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="mx-auto max-w-3xl w-full bg-white dark:bg-black/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex items-center justify-between p-2 pointer-events-auto"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link key={item.href} href={item.href} className="relative -mt-12 group">
                <div className="bg-[#1565C0] text-white p-5 rounded-full shadow-[0_15px_30px_-5px_rgba(21,101,192,0.5)] active:scale-90 transition-all border-4 border-white dark:border-black">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-[#1565C0] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all relative ${
                isActive ? 'text-[#1565C0]' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
