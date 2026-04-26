'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/supabase';
import { useState } from 'react';
import { Bell, Palette, Star, Info, LogOut, Shield, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, products, logout, isDarkMode, toggleDarkMode, isAuthenticated, isLoading: appLoading } = useApp();
  const [notifications, setNotifications] = useState({
    warranty_90: true,
    warranty_30: true,
    warranty_7: true,
    expired: true,
  });

  if (!appLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const totalValue = products.reduce((sum, p) => sum + p.amount_paid, 0);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Profile
          </h1>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-border dark:border-dark-border mb-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {user?.phone || '+91 XXXXXXXXXX'}
              </p>
              {user?.email && (
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background dark:bg-dark-bg rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                {products.length}
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-secondary">Products</p>
            </div>
            <div className="bg-background dark:bg-dark-bg rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-success" style={{ fontFamily: 'var(--font-heading)' }}>
                {products.filter(p => p.status === 'active').length}
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-secondary">Active</p>
            </div>
            <div className="bg-background dark:bg-dark-bg rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-accent" style={{ fontFamily: 'var(--font-heading)' }}>
                ₹{Math.round(totalValue / 1000)}K
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-secondary">Total Value</p>
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl p-6 border border-border dark:border-dark-border mb-6"
        >
          <h3 className="text-base font-bold text-text dark:text-dark-text mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Bell size={18} className="text-primary" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              { key: 'warranty_90', label: '90-day warning', desc: 'Alert 90 days before expiry' },
              { key: 'warranty_30', label: '30-day warning', desc: 'Alert 30 days before expiry' },
              { key: 'warranty_7', label: '7-day warning', desc: 'Alert 7 days before expiry' },
              { key: 'expired', label: 'Expired notification', desc: 'Alert when warranty expires' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-text dark:text-dark-text">{pref.label}</p>
                  <p className="text-xs text-text-muted dark:text-dark-text-secondary">{pref.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications(prev => ({
                      ...prev,
                      [pref.key]: !prev[pref.key as keyof typeof prev],
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifications[pref.key as keyof typeof notifications]
                      ? 'bg-primary'
                      : 'bg-border dark:bg-dark-border'
                  }`}
                >
                  <motion.div
                    animate={{
                      x: notifications[pref.key as keyof typeof notifications] ? 20 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl p-6 border border-border dark:border-dark-border mb-6"
        >
          <h3 className="text-base font-bold text-text dark:text-dark-text mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Palette size={18} className="text-primary" /> Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-text dark:text-dark-text uppercase tracking-widest">Theme Mode</p>
              <p className="text-xs font-bold text-text-muted dark:text-dark-text-secondary mt-1">
                {isDarkMode ? 'Pure Black' : 'Pure White'}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative w-20 h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center p-1 group overflow-hidden"
            >
              <motion.div
                animate={{ 
                  x: isDarkMode ? 40 : 0,
                  rotate: isDarkMode ? 360 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-8 h-8 rounded-xl bg-white dark:bg-[#1565C0] shadow-md flex items-center justify-center relative z-10"
              >
                {isDarkMode ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    <Moon size={18} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    <Sun size={18} className="text-blue-600" />
                  </motion.div>
                )}
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-20 dark:opacity-40">
                <Sun size={14} className="text-blue-400" />
                <Moon size={14} className="text-slate-400" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} className="fill-white/20" />
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Premium
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Upgrade to KeepIt Pro
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Unlimited products, PDF export, priority support, and warranty transfer.
            </p>
            <button className="px-6 py-2.5 bg-white text-primary rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg">
              Upgrade — ₹199/year
            </button>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl p-6 border border-border dark:border-dark-border mb-6"
        >
          <h3 className="text-base font-bold text-text dark:text-dark-text mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Info size={18} className="text-primary" /> Account
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-dark-text-secondary">Member since</span>
              <span className="font-medium text-text dark:text-dark-text">
                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-dark-text-secondary">Plan</span>
              <span className="font-medium text-text dark:text-dark-text">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-dark-text-secondary">Version</span>
              <span className="font-medium text-text dark:text-dark-text">1.0.0</span>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full py-3.5 bg-danger/10 text-danger rounded-xl font-semibold text-sm hover:bg-danger/20 transition-colors"
        >
          <LogOut size={18} className="inline mr-2" /> Logout
        </motion.button>
      </div>
    </div>
  );
}
