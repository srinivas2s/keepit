'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const params = useParams();
  const code = params.code as string;
  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'invalid'>('loading');
  const [productData, setProductData] = useState<{
    name: string;
    brand: string;
    expiry: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    // Simulate verification
    const verify = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check localStorage for matching product
      try {
        const savedProducts = localStorage.getItem('keepit_products');
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          const match = products.find((p: { qr_code: string }) => p.qr_code === code);
          if (match) {
            setProductData({
              name: match.name,
              brand: match.brand,
              expiry: match.expiry_date,
              status: match.status,
            });
            setStatus(match.status === 'expired' ? 'expired' : 'valid');
            return;
          }
        }
      } catch {
        // Ignore parse errors
      }

      // Check if code matches demo pattern
      if (code.startsWith('keepit-prod-')) {
        setProductData({
          name: 'Demo Product',
          brand: 'Demo Brand',
          expiry: '2026-12-31',
          status: 'active',
        });
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    };

    verify();
  }, [code]);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Service Centre Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>K</span>
            </div>
            <span className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              KeepIt Verify
            </span>
          </div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Service Centre Verification Portal
          </p>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl p-8 border border-border dark:border-dark-border shadow-xl text-center"
        >
          {status === 'loading' && (
            <div className="py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
              />
              <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                Verifying warranty...
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-1">
                Code: {code}
              </p>
            </div>
          )}

          {status === 'valid' && productData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-4xl">✅</span>
              </motion.div>
              <h2 className="text-xl font-bold text-success mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Warranty Valid
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
                This product is covered under warranty.
              </p>

              <div className="bg-background dark:bg-dark-bg rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Product</span>
                  <span className="font-medium text-text dark:text-dark-text">{productData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Brand</span>
                  <span className="font-medium text-text dark:text-dark-text">{productData.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Expires</span>
                  <span className="font-medium text-success">{productData.expiry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Status</span>
                  <span className="font-semibold text-success">✅ Active</span>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'expired' && productData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-4xl">❌</span>
              </motion.div>
              <h2 className="text-xl font-bold text-danger mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Warranty Expired
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
                This product&apos;s warranty has expired.
              </p>

              <div className="bg-background dark:bg-dark-bg rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Product</span>
                  <span className="font-medium text-text dark:text-dark-text">{productData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Brand</span>
                  <span className="font-medium text-text dark:text-dark-text">{productData.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-dark-text-secondary">Expired On</span>
                  <span className="font-medium text-danger">{productData.expiry}</span>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'invalid' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-border dark:bg-dark-border flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-4xl">🔍</span>
              </motion.div>
              <h2 className="text-xl font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Not Found
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                No warranty record found for this QR code. The code may be invalid or expired.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-sm text-primary font-medium hover:underline"
          >
            Powered by KeepIt →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
