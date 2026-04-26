'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, daysRemaining } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, products, isAuthenticated, isLoading, getUnreadAlertCount } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filter !== 'all') {
      result = result.filter(p => p.status === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.retailer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, filter, search]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    expiring: products.filter(p => p.status === 'expiring').length,
    expired: products.filter(p => p.status === 'expired').length,
  }), [products]);

  const unreadAlerts = getUnreadAlertCount();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
              Hey, {user?.name || 'there'} 👋
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
              Here&apos;s your warranty overview
            </p>
          </div>
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
          >
            <span className="text-lg">+</span>
            Add Product
          </Link>
        </motion.div>

        {/* Warning Banner */}
        {stats.expiring > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl flex items-center gap-3"
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                {stats.expiring} {stats.expiring === 1 ? 'warranty is' : 'warranties are'} expiring soon!
              </p>
              <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
                Check your alerts to take action before they expire.
              </p>
            </div>
            <Link
              href="/alerts"
              className="ml-auto px-4 py-2 bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors whitespace-nowrap"
            >
              View Alerts {unreadAlerts > 0 && `(${unreadAlerts})`}
            </Link>
          </motion.div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, icon: '📦', color: 'from-blue-500 to-blue-600' },
            { label: 'Active', value: stats.active, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Expiring', value: stats.expiring, icon: '⏰', color: 'from-amber-500 to-amber-600' },
            { label: 'Expired', value: stats.expired, icon: '❌', color: 'from-red-500 to-red-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-surface dark:bg-dark-surface rounded-2xl p-4 sm:p-5 border border-border dark:border-dark-border card-hover cursor-default"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">{stat.value}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'active', label: 'Active', count: stats.active },
              { key: 'expiring', label: 'Expiring', count: stats.expiring },
              { key: 'expired', label: 'Expired', count: stats.expired },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.key
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-primary/30'
                }`}
              >
                {f.label}
                <span className={`text-xs ${filter === f.key ? 'text-white/70' : 'text-text-muted'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-4">📭</span>
            <h3 className="text-xl font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {search ? 'No results found' : 'No products yet'}
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
              {search ? 'Try a different search term' : 'Add your first product to start tracking warranties'}
            </p>
            {!search && (
              <Link
                href="/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all"
              >
                + Add Your First Product
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProducts.map((product, i) => {
              const days = daysRemaining(product.expiry_date);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="block bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border hover:shadow-xl hover:shadow-primary/5 transition-all group"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {product.brand === 'Apple' ? '🍎' :
                         product.brand === 'Samsung' ? '📱' :
                         product.brand === 'Sony' ? '🎧' :
                         product.brand === 'LG' ? '📺' :
                         product.brand === 'Dyson' ? '🏠' : '📦'}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full badge-${product.status}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-bold text-text dark:text-dark-text text-base mb-1 group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {product.brand} • {product.retailer}
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border dark:border-dark-border">
                      <div>
                        <p className="text-xs text-text-muted dark:text-dark-text-secondary">Paid</p>
                        <p className="text-sm font-bold text-text dark:text-dark-text">
                          {formatCurrency(product.amount_paid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-muted dark:text-dark-text-secondary">
                          {product.status === 'expired' ? 'Expired' : 'Expires'}
                        </p>
                        <p className={`text-sm font-bold ${
                          product.status === 'active' ? 'text-success' :
                          product.status === 'expiring' ? 'text-warning' : 'text-danger'
                        }`}>
                          {product.status === 'expired'
                            ? formatDate(product.expiry_date)
                            : `${days} days left`
                          }
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
