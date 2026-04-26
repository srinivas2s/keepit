'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Bell, BellOff, ChevronRight, Info, AlertTriangle, AlertCircle, CalendarX } from 'lucide-react';
import { AlertItemSkeleton } from '@/components/Skeleton';
import Skeleton from '@/components/Skeleton';

const alertConfig: Record<string, { icon: React.ReactNode; color: string; label: string; dotColor: string }> = {
  '90day': { icon: <Info size={16} />, color: 'text-success', label: '90-Day Warning', dotColor: 'bg-success' },
  '30day': { icon: <AlertTriangle size={16} />, color: 'text-warning', label: '30-Day Warning', dotColor: 'bg-warning' },
  '7day': { icon: <AlertCircle size={16} />, color: 'text-danger', label: '7-Day Warning', dotColor: 'bg-danger' },
  'expired': { icon: <CalendarX size={16} />, color: 'text-danger', label: 'Expired', dotColor: 'bg-danger' },
};

export default function AlertsPage() {
  const router = useRouter();
  const { alerts, products, markAlertRead, markAllAlertsRead, isAuthenticated, isLoading: appLoading } = useApp();

  if (!appLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const getProduct = (productId: string) => products.find(p => p.id === productId);
  if (appLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton variant="text" className="w-32 h-8 mb-2" />
              <Skeleton variant="text" className="w-48" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <AlertItemSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Unread first, then by date
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
              Alerts <Bell className="inline ml-1" size={24} />
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Alerts List */}
        {sortedAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BellOff className="mx-auto mb-4 text-text-muted" size={48} />
            <h3 className="text-xl font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No alerts yet
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              We&apos;ll notify you when your warranties need attention.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert, i) => {
              const product = getProduct(alert.product_id);
              const config = alertConfig[alert.alert_type] || alertConfig['90day'];
              const timeAgo = getTimeAgo(alert.created_at);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-surface dark:bg-dark-surface rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer group ${
                    alert.is_read
                      ? 'border-border dark:border-dark-border opacity-70'
                      : 'border-border dark:border-dark-border shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => {
                    markAlertRead(alert.id);
                    if (product) router.push(`/product/${product.id}`);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Dot */}
                    <div className="relative flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${config.dotColor}`} />
                      {!alert.is_read && (
                        <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.dotColor} animate-ping opacity-75`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-semibold text-sm ${alert.is_read ? 'text-text-secondary dark:text-dark-text-secondary' : 'text-text dark:text-dark-text'}`}>
                            {config.label}
                          </p>
                          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">
                            {product ? (
                              <>
                                <strong>{product.name}</strong> ({product.brand}) warranty
                                {alert.alert_type === 'expired'
                                  ? ' has expired'
                                  : ` expires in ${alert.alert_type.replace('day', ' days')}`
                                }
                              </>
                            ) : (
                              'Product warranty notification'
                            )}
                          </p>
                        </div>
                        <span className="text-xs text-text-muted dark:text-dark-text-secondary whitespace-nowrap flex-shrink-0">
                          {timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
