'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Bell, Palette, Star, LogOut, Sun, Moon, ChevronRight, Shield, Package, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, products, logout, isDarkMode, toggleDarkMode, isAuthenticated, isLoading } = useApp();
  const [notifications, setNotifications] = useState({
    warranty_90: true, warranty_30: true, warranty_7: true, expired: true,
  });

  if (!isLoading && !isAuthenticated) { router.push('/login'); return null; }

  const handleLogout = () => { logout(); router.push('/'); };

  const totalValue = products.reduce((s, p) => s + p.amount_paid, 0);
  const activeCount = products.filter(p => p.status === 'active').length;

  const formatValue = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${Math.round(v / 1000)}K` : `₹${v}`;

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-36 space-y-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-text dark:text-dark-text mb-0.5">Profile</h1>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Manage your account</p>
        </motion.div>

        {/* User Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-8 translate-y-8" />

          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-xl font-black">{user?.name || 'User'}</p>
              <p className="text-sm text-white/70">{user?.email || user?.phone || 'No contact info'}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              { label: 'Products', value: String(products.length), icon: <Package size={14} /> },
              { label: 'Active', value: String(activeCount), icon: <Shield size={14} /> },
              { label: 'Value', value: formatValue(totalValue), icon: <TrendingUp size={14} /> },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-white/60 mb-1">{s.icon}</div>
                <p className="text-lg font-black">{s.value}</p>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notification Prefs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border dark:border-dark-border">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell size={16} className="text-primary" />
            </div>
            <p className="font-black text-text dark:text-dark-text">Notifications</p>
          </div>
          <div className="divide-y divide-border dark:divide-dark-border">
            {[
              { key: 'warranty_90', label: '90-day warning', desc: 'Alert 90 days before expiry' },
              { key: 'warranty_30', label: '30-day warning', desc: 'Alert 30 days before expiry' },
              { key: 'warranty_7', label: '7-day warning', desc: 'Alert 7 days before expiry' },
              { key: 'expired', label: 'Expired', desc: 'Alert when warranty expires' },
            ].map(pref => (
              <div key={pref.key} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-text dark:text-dark-text">{pref.label}</p>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{pref.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(p => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                  className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 ${
                    notifications[pref.key as keyof typeof notifications] ? 'bg-primary' : 'bg-border dark:bg-dark-border'
                  }`}
                  style={{ height: '26px' }}>
                  <motion.div
                    animate={{ x: notifications[pref.key as keyof typeof notifications] ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow"
                    style={{ width: '18px', height: '18px', top: '4px' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border dark:border-dark-border">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Palette size={16} className="text-primary" />
            </div>
            <p className="font-black text-text dark:text-dark-text">Appearance</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text dark:text-dark-text">Theme Mode</p>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">
                Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <button onClick={toggleDarkMode}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-dark-border'}`}>
              <motion.div
                animate={{ x: isDarkMode ? 32 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              >
                {isDarkMode ? <Moon size={13} className="text-primary" /> : <Sun size={13} className="text-amber-500" />}
              </motion.div>
            </button>
          </div>
        </motion.div>

        {/* Premium Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="fill-yellow-300 text-yellow-300" />
                <span className="text-xs font-black uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full">Pro</span>
              </div>
              <h3 className="text-base font-black mb-1">Upgrade to KeepIt Pro</h3>
              <p className="text-xs text-white/70 mb-4 max-w-xs">
                Unlimited products, cloud backup, priority support & warranty transfer
              </p>
              <button className="px-5 py-2.5 bg-white text-purple-700 rounded-2xl font-black text-sm shadow-lg hover:bg-white/90 transition-colors">
                Upgrade — ₹199/yr
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border divide-y divide-border dark:divide-dark-border">
          {[
            { label: 'Plan', value: 'Free' },
            { label: 'Member since', value: user?.created_at ? new Date(user.created_at).getFullYear().toString() : '2026' },
            { label: 'App Version', value: '1.0.0' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{item.label}</p>
              <p className="text-sm font-bold text-text dark:text-dark-text">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full py-4 bg-danger/10 dark:bg-danger/15 text-danger rounded-3xl font-black text-sm border border-danger/20 hover:bg-danger/15 dark:hover:bg-danger/20 transition-all flex items-center justify-center gap-2">
          <LogOut size={17} /> Sign Out
        </motion.button>
      </div>
    </div>
  );
}
