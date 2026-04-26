'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { formatDate, daysRemaining } from '@/lib/supabase';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import Link from 'next/link';

export default function QRCodePage() {
  const params = useParams();
  const router = useRouter();
  const { getProduct, isAuthenticated, isLoading: appLoading } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);
  const [showQR, setShowQR] = useState(false);

  const product = getProduct(params.id as string);

  if (!appLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-xl font-bold text-text dark:text-dark-text mb-2">Product not found</h2>
          <Link href="/dashboard" className="text-primary font-medium hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const days = daysRemaining(product.expiry_date);
  const qrValue = JSON.stringify({
    id: product.id,
    name: product.name,
    brand: product.brand,
    expiry: product.expiry_date,
    status: product.status,
    code: product.qr_code,
  });

  const handleSimulateScan = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsVerifying(false);
    setVerificationResult(product.status !== 'expired' ? 'success' : 'failed');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `KeepIt Warranty - ${product.name}`,
          text: `Warranty for ${product.name} (${product.brand}) - Expires: ${formatDate(product.expiry_date)}`,
          url: `${window.location.origin}/verify/${product.qr_code}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/verify/${product.qr_code}`);
        alert('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors mb-6"
        >
          ← Back to Product
        </motion.button>

        {/* QR Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-border dark:border-dark-border shadow-xl text-center"
        >
          <h1 className="text-xl font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Warranty QR Code
          </h1>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-8">
            Show this at any service centre for instant verification
          </p>

          {/* QR Code with reveal animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            onAnimationComplete={() => setShowQR(true)}
            className="relative bg-white rounded-2xl p-6 inline-block mx-auto mb-6 shadow-lg"
          >
            {showQR ? (
              <QRCode
                value={qrValue}
                size={200}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 256 256"
                fgColor="#1565C0"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
                />
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-8"
          >
            <h2 className="text-lg font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {product.brand} • {product.retailer}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-text-secondary dark:text-dark-text-secondary">
                Expires: <strong>{formatDate(product.expiry_date)}</strong>
              </span>
            </div>
            <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full badge-${product.status}`}>
              {product.status === 'active' ? `✅ Active (${days} days left)` :
               product.status === 'expiring' ? `⚠️ Expiring (${days} days left)` :
               '❌ Expired'}
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              📤 Share QR Code
            </button>

            <button
              onClick={handleSimulateScan}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 py-3 bg-surface-hover dark:bg-dark-surface-hover border border-border dark:border-dark-border text-text dark:text-dark-text rounded-xl font-semibold text-sm hover:border-primary/30 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
                />
              ) : (
                <>🔍 Simulate Service Centre Scan</>
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Verification Result */}
        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 rounded-2xl p-6 text-center border ${
                verificationResult === 'success'
                  ? 'bg-success/10 border-success/20'
                  : 'bg-danger/10 border-danger/20'
              }`}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl block mb-3"
              >
                {verificationResult === 'success' ? '✅' : '❌'}
              </motion.span>
              <h3
                className={`text-lg font-bold mb-1 ${
                  verificationResult === 'success' ? 'text-success' : 'text-danger'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {verificationResult === 'success' ? 'Warranty Verified!' : 'Warranty Expired'}
              </h3>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {verificationResult === 'success'
                  ? `This product is under warranty until ${formatDate(product.expiry_date)}.`
                  : 'This warranty has expired. The product is no longer covered.'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
