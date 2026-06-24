'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Bell, BellOff, ChevronRight, Info, AlertTriangle, AlertCircle, CalendarX, CheckCheck } from 'lucide-react';

const alertConfig: Record<string, { icon: React.ReactNode; label: string; bgClass: string; dotClass: string; textClass: string }> = {
  '90day': {
    icon: <Info size={16} />,
    label: '90-Day Notice',
    bgClass: 'bg-blue-50 dark:bg-blue-900/15',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  '30day': {
    icon: <AlertTriangle size={16} />,
    label: '30-Day Warning',
    bgClass: 'bg-warning/10 dark:bg-warning/15',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
  },
  '7day': {
    icon: <AlertCircle size={16} />,
    label: 'Critical — 7 Days',
    bgClass: 'bg-danger/10 dark:bg-danger/15',
    dotClass: 'bg-danger',
    textClass: 'text-danger',
  },
  expired: {
    icon: <CalendarX size={16} />,
    label: 'Expired',
    bgClass: 'bg-danger/10 dark:bg-danger/15',
    dotClass: 'bg-danger',
    textClass: 'text-danger',
  },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function AlertsPage() {
  const router = useRouter();
  const { alerts, products, markAlertRead, markAllAlertsRead, isAuthenticated, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  const getProduct = (id: string) => products.find(p => p.id === id);
  const unreadCount = alerts.filter(a => !a.is_read).length;

  const sorted = [...alerts].sort((a, b) => {
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3 animate-pulse">
          <div className="h-8 bg-surface dark:bg-dark-surface rounded-2xl w-40" />
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-surface dark:bg-dark-surface rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-36">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-text dark:text-dark-text flex items-center gap-2">
              Alerts
              {unreadCount > 0 && (
                <span className="text-sm font-black px-2.5 py-1 rounded-full bg-danger text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAlertsRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-2xl text-sm font-bold text-text dark:text-dark-text hover:border-primary/30 transition-all">
              <CheckCheck size={15} className="text-primary" />
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Alert List */}
        {sorted.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 px-4">
            <div className="w-20 h-20 rounded-3xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center mx-auto mb-5">
              <BellOff size={32} className="text-text-muted dark:text-dark-text-secondary" />
            </div>
            <h3 className="text-lg font-black text-text dark:text-dark-text mb-2">No alerts yet</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary max-w-xs mx-auto">
              We&apos;ll notify you 90, 30, and 7 days before a warranty expires.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all">
              <Bell size={16} /> Go to Dashboard
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map((alert, i) => {
              const product = getProduct(alert.product_id);
              const cfg = alertConfig[alert.alert_type] || alertConfig['90day'];
              return (
                <motion.div key={alert.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={async () => {
                    await markAlertRead(alert.id);
                    if (product) router.push(`/product/${product.id}`);
                  }}
                  className={`relative flex items-center gap-4 p-4 rounded-3xl border cursor-pointer group transition-all ${
                    alert.is_read
                      ? 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border opacity-60'
                      : `${cfg.bgClass} border-transparent shadow-sm hover:shadow-md`
                  }`}>
                  {/* Status dot */}
                  {!alert.is_read && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    alert.is_read ? 'bg-border/50 dark:bg-dark-border text-text-muted dark:text-dark-text-secondary' : `${cfg.bgClass} ${cfg.textClass}`
                  }`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-xs font-black uppercase tracking-wider ${alert.is_read ? 'text-text-muted dark:text-dark-text-secondary' : cfg.textClass}`}>
                        {cfg.label}
                      </p>
                      <span className="text-xs text-text-muted dark:text-dark-text-secondary">·</span>
                      <span className="text-xs text-text-muted dark:text-dark-text-secondary">{timeAgo(alert.created_at)}</span>
                    </div>
                    <p className={`text-sm font-semibold truncate ${alert.is_read ? 'text-text-secondary dark:text-dark-text-secondary' : 'text-text dark:text-dark-text'}`}>
                      {product ? (
                        <><strong>{product.name}</strong> ({product.brand})
                          {alert.alert_type === 'expired' ? ' has expired' : ` expires in ${alert.alert_type.replace('day', ' days')}`}</>
                      ) : 'Product warranty notification'}
                    </p>
                  </div>

                  <ChevronRight size={16} className="text-text-muted dark:text-dark-text-secondary flex-shrink-0 group-hover:text-primary transition-colors" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
