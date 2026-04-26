'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, daysRemaining } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Smartphone, Tv, Home, Package, Clock, XCircle, CreditCard, ShieldCheck, Calendar, LayoutDashboard, Store, QrCode, Trash2, ArrowRightLeft } from 'lucide-react';
import Skeleton from '@/components/Skeleton';

function CountdownDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg shadow-primary/20"
      >
        <span className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-2 font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProduct, deleteProduct, isAuthenticated, isLoading: appLoading } = useApp();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const product = getProduct(params.id as string);

  useEffect(() => {
    if (!product) return;

    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(product.expiry_date);
      const diff = Math.max(0, expiry.getTime() - now.getTime());

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [product]);

  if (appLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Skeleton variant="text" className="w-20 h-4 mb-6" />
          <div className="bg-surface dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-border dark:border-dark-border mb-6">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton variant="rect" className="w-16 h-16 rounded-2xl" />
              <div className="flex-1">
                <Skeleton variant="text" className="w-1/2 h-6 mb-2" />
                <Skeleton variant="text" className="w-1/3" />
              </div>
            </div>
            <Skeleton variant="rect" className="w-full h-32 rounded-2xl mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="rect" className="h-20 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search className="mx-auto mb-4 text-text-muted" size={48} />
          <h2 className="text-xl font-bold text-text dark:text-dark-text mb-2">Product not found</h2>
          <Link href="/dashboard" className="text-primary font-medium hover:underline">
            <ChevronLeft className="inline mr-1" size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const days = daysRemaining(product.expiry_date);
  const warrantyProgress = product.warranty_months > 0
    ? Math.min(100, Math.max(0, ((product.warranty_months * 30 - days) / (product.warranty_months * 30)) * 100))
    : 100;

  const handleDelete = () => {
    deleteProduct(product.id);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Back
        </motion.button>

        {/* Product Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-border dark:border-dark-border mb-6 shadow-lg"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary">
                  {product.brand === 'Apple' ? <Smartphone size={32} /> :
                   product.brand === 'Samsung' ? <Smartphone size={32} /> :
                   product.brand === 'Sony' ? <Smartphone size={32} /> :
                   product.brand === 'LG' ? <Tv size={32} /> :
                   product.brand === 'Dyson' ? <Home size={32} /> : <Package size={32} />}
                </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  {product.name}
                </h1>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  {product.brand} • {product.retailer}
                </p>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full badge-${product.status}`}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </div>

          {/* Countdown Timer */}
          {product.status !== 'expired' ? (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-4 text-center uppercase tracking-wider">
                Warranty Expires In
              </h3>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <CountdownDigit value={countdown.days} label="Days" />
                <span className="text-2xl font-bold text-primary mt-[-20px]">:</span>
                <CountdownDigit value={countdown.hours} label="Hours" />
                <span className="text-2xl font-bold text-primary mt-[-20px]">:</span>
                <CountdownDigit value={countdown.minutes} label="Min" />
                <span className="text-2xl font-bold text-primary mt-[-20px]">:</span>
                <CountdownDigit value={countdown.seconds} label="Sec" />
              </div>
            </div>
          ) : (
            <div className="mb-8 text-center p-6 bg-danger/5 rounded-2xl">
              <XCircle className="mx-auto mb-2 text-danger" size={48} />
              <p className="font-bold text-danger text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                Warranty Expired
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                Expired on {formatDate(product.expiry_date)}
              </p>
            </div>
          )}

          {/* Warranty Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-text-secondary dark:text-dark-text-secondary mb-2">
              <span>Purchased {formatDate(product.purchase_date)}</span>
              <span>Expires {formatDate(product.expiry_date)}</span>
            </div>
            <div className="h-2 bg-background dark:bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${warrantyProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  product.status === 'active' ? 'bg-success' :
                  product.status === 'expiring' ? 'bg-warning' : 'bg-danger'
                }`}
              />
            </div>
            <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-1 text-center">
              {warrantyProgress.toFixed(0)}% elapsed • {product.warranty_months} months warranty
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Amount Paid', value: formatCurrency(product.amount_paid), icon: <CreditCard size={14} /> },
              { label: 'Warranty', value: `${product.warranty_months} Months`, icon: <ShieldCheck size={14} /> },
              { label: 'Purchase Date', value: formatDate(product.purchase_date), icon: <Calendar size={14} /> },
              { label: 'Expiry Date', value: formatDate(product.expiry_date), icon: <Clock size={14} /> },
              { label: 'Days Remaining', value: `${days} days`, icon: <LayoutDashboard size={14} /> },
              { label: 'Retailer', value: product.retailer, icon: <Store size={14} /> },
            ].map((detail, i) => (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-background dark:bg-dark-bg rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary">{detail.icon}</span>
                  <span className="text-xs text-text-muted dark:text-dark-text-secondary">{detail.label}</span>
                </div>
                <p className="text-sm font-bold text-text dark:text-dark-text truncate">{detail.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Link
            href={`/product/${product.id}/qr`}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <QrCode size={18} /> Generate QR Code
          </Link>

          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-text dark:text-dark-text rounded-xl font-semibold text-sm opacity-60 cursor-not-allowed"
          >
            <ArrowRightLeft size={18} /> Transfer Warranty (Phase 2)
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-danger/10 text-danger rounded-xl font-semibold text-sm hover:bg-danger/20 transition-colors"
          >
            <Trash2 size={18} /> Remove Product
          </button>
        </motion.div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-surface dark:bg-dark-surface rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Remove Product?
              </h3>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
                This will permanently remove &quot;{product.name}&quot; and its warranty data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 bg-background dark:bg-dark-bg rounded-xl font-medium text-sm text-text dark:text-dark-text"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-danger text-white rounded-xl font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
