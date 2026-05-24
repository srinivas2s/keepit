'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, daysRemaining } from '@/lib/supabase';
import Link from 'next/link';
import {
  FileText, Plus, AlertTriangle, Package, CheckCircle2,
  Clock, XCircle, Search, Inbox, Smartphone, Tv, Home,
  ChevronRight, ShieldCheck
} from 'lucide-react';

const brandIcon = (brand: string) => {
  if (['Apple', 'Samsung', 'Sony', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Motorola'].includes(brand))
    return <Smartphone size={22} />;
  if (['LG', 'TCL'].includes(brand)) return <Tv size={22} />;
  if (['Dyson'].includes(brand)) return <Home size={22} />;
  return <Package size={22} />;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, products, isAuthenticated, isLoading, getUnreadAlertCount } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'personal'>('all');

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    expiring: products.filter(p => p.status === 'expiring').length,
    expired: products.filter(p => p.status === 'expired').length,
  }), [products]);

  const filteredProducts = useMemo(() => {
    let r = products;
    if (viewMode === 'personal') {
      r = r.filter(p => !p.owner_name || p.owner_name === 'You');
    }
    if (filter !== 'all') r = r.filter(p => p.status === filter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.retailer.toLowerCase().includes(q)
      );
    }
    return r;
  }, [products, filter, search, viewMode]);

  const unreadAlerts = getUnreadAlertCount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-pulse">
          <div className="h-8 bg-surface dark:bg-dark-surface rounded-2xl w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface dark:bg-dark-surface rounded-3xl" />)}
          </div>
          <div className="h-12 bg-surface dark:bg-dark-surface rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-surface dark:bg-dark-surface rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-36">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-text dark:text-dark-text">
              Hey, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">
              {stats.total > 0 ? `${stats.total} product${stats.total > 1 ? 's' : ''} tracked` : 'Start adding products'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-2xl text-sm font-semibold text-text dark:text-dark-text hover:border-primary/30 transition-all">
              <FileText size={16} className="text-primary" /> Export
            </button>
            <Link href="/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5">
              <Plus size={18} /> Add
            </Link>
          </div>
        </motion.div>

        {/* Expiry Warning Banner */}
        {stats.expiring > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-warning/10 dark:bg-warning/10 border border-warning/25 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-warning">
                {stats.expiring} warranty{stats.expiring > 1 ? 's are' : ' is'} expiring soon
              </p>
              <p className="text-xs text-warning/70 mt-0.5">Take action before they expire</p>
            </div>
            <Link href="/alerts"
              className="flex-shrink-0 px-3 py-1.5 bg-warning/20 text-warning rounded-xl text-xs font-bold hover:bg-warning/30 transition-colors">
              View {unreadAlerts > 0 && `(${unreadAlerts})`}
            </Link>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: <ShieldCheck size={18} />, color: 'text-primary', bg: 'bg-primary/10 dark:bg-primary/15' },
            { label: 'Active', value: stats.active, icon: <CheckCircle2 size={18} />, color: 'text-success', bg: 'bg-success/10 dark:bg-success/15' },
            { label: 'Expiring', value: stats.expiring, icon: <Clock size={18} />, color: 'text-warning', bg: 'bg-warning/10 dark:bg-warning/15' },
            { label: 'Expired', value: stats.expired, icon: <XCircle size={18} />, color: 'text-danger', bg: 'bg-danger/10 dark:bg-danger/15' },
          ].map((s, i) => (
            <motion.button key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              onClick={() => setFilter(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
              className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-surface dark:bg-dark-surface border transition-all text-left ${
                (filter === 'all' && s.label === 'Total') || filter === s.label.toLowerCase()
                  ? 'border-primary/40 dark:border-primary/30 shadow-lg shadow-primary/10'
                  : 'border-border dark:border-dark-border hover:border-border/60'
              }`}>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-2`}>
                {s.icon}
              </div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider mt-0.5">{s.label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-secondary" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands, retailers..."
            className="w-full pl-11 pr-4 py-3.5 bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
          />
        </motion.div>

        {/* Filter Pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {[
            { key: 'all', label: 'All', count: stats.total, icon: null },
            { key: 'active', label: 'Active', count: stats.active, icon: <CheckCircle2 size={14} className="text-success" /> },
            { key: 'expiring', label: 'Expiring', count: stats.expiring, icon: <Clock size={14} className="text-warning" /> },
            { key: 'expired', label: 'Expired', count: stats.expired, icon: <XCircle size={14} className="text-danger" /> },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-primary/30'
              }`}>
              {f.icon && (
                <span className={filter === f.key ? 'brightness-200' : ''}>
                  {f.icon}
                </span>
              )}
              {f.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20' : 'bg-border dark:bg-dark-border'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Ownership View Toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex bg-surface-hover dark:bg-dark-surface-hover border border-border dark:border-dark-border p-1 rounded-2xl mb-5 max-w-sm">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              viewMode === 'all'
                ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                : 'text-text-secondary dark:text-dark-text-secondary hover:text-text'
            }`}
          >
            All Family Warranties
          </button>
          <button
            onClick={() => setViewMode('personal')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              viewMode === 'personal'
                ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                : 'text-text-secondary dark:text-dark-text-secondary hover:text-text'
            }`}
          >
            My Warranties Only
          </button>
        </motion.div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 px-4">
            <div className="w-20 h-20 rounded-3xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center mx-auto mb-5">
              {search ? <Search size={32} className="text-text-muted dark:text-dark-text-secondary" /> : <Inbox size={32} className="text-text-muted dark:text-dark-text-secondary" />}
            </div>
            <h3 className="text-lg font-black text-text dark:text-dark-text mb-2">
              {search ? 'No results found' : 'No products yet'}
            </h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6 max-w-xs mx-auto">
              {search ? 'Try different keywords' : 'Scan a receipt or add your first product to start tracking warranties'}
            </p>
            {!search && (
              <Link href="/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all">
                <Plus size={18} /> Add First Product
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => {
                const days = daysRemaining(product.expiry_date);
                const statusColors = {
                  active: { bar: 'bg-success', text: 'text-success', bg: 'bg-success/10' },
                  expiring: { bar: 'bg-warning', text: 'text-warning', bg: 'bg-warning/10' },
                  expired: { bar: 'bg-danger', text: 'text-danger', bg: 'bg-danger/10' },
                };
                const sc = statusColors[product.status] || statusColors.active;
                return (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}>
                    <Link href={`/product/${product.id}`}
                      className="block bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border p-4 sm:p-5 hover:shadow-xl hover:shadow-primary/8 dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
                            {brandIcon(product.brand)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-text dark:text-dark-text text-sm sm:text-base leading-tight truncate">{product.name}</p>
                            <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary mt-0.5 truncate">{product.brand} · {product.retailer}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide badge-${product.status} flex-shrink-0`}>
                          {product.status}
                        </span>
                      </div>

                      {product.owner_name && product.owner_name !== 'You' && (
                        <div className="flex items-center gap-1.5 mb-3 bg-surface-hover dark:bg-dark-surface-hover px-2 py-0.5 rounded-lg w-fit border border-border dark:border-dark-border/40">
                          <div className="w-3.5 h-3.5 rounded-full bg-primary/15 text-primary text-[8px] font-black flex items-center justify-center flex-shrink-0">
                            {product.owner_name.replace(/\s*\([^)]*\)*/g, '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                          <span className="text-[10px] font-bold text-text-secondary dark:text-dark-text-secondary truncate">
                            Shared by {product.owner_name.replace(/\s*\([^)]*\)*/g, '')}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-border/40 dark:border-dark-border/40 pt-3">
                        <div>
                          <p className="text-[9px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider">Paid</p>
                          <p className="text-xs sm:text-sm font-black text-text dark:text-dark-text">{formatCurrency(product.amount_paid)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider">
                              {product.status === 'expired' ? 'Expired' : 'Expires in'}
                            </p>
                            <p className={`text-xs sm:text-sm font-black ${sc.text}`}>
                              {product.status === 'expired' ? formatDate(product.expiry_date) : `${days}d`}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-text-muted dark:text-dark-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
