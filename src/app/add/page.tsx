'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Camera, PenTool, Package, CreditCard, ChevronLeft, CheckCircle2, Rocket, Receipt, PartyPopper } from 'lucide-react';

type InputMethod = 'select' | 'scan' | 'manual' | 'amazon' | 'razorpay';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, isAuthenticated, isLoading: appLoading } = useApp();
  const [method, setMethod] = useState<InputMethod>('select');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    retailer: '',
    purchase_date: '',
    warranty_months: 12,
    amount_paid: '',
    receipt_url: '',
  });

  if (!appLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const methods = [
    { id: 'scan' as const, icon: <Camera size={24} />, title: 'Scan Receipt', desc: 'Upload receipt image for AI extraction' },
    { id: 'manual' as const, icon: <PenTool size={24} />, title: 'Manual Entry', desc: 'Fill in product details yourself' },
    { id: 'amazon' as const, icon: <Package size={24} />, title: 'Amazon Import', desc: 'Import from Amazon order history' },
    { id: 'razorpay' as const, icon: <CreditCard size={24} />, title: 'Razorpay Sync', desc: 'Sync from payment receipts' },
  ];

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
    setScanComplete(true);
    // Auto-fill with simulated OCR data
    setForm({
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      retailer: 'Apple Store',
      purchase_date: '2025-03-15',
      warranty_months: 12,
      amount_paid: '159900',
      receipt_url: '',
    });
    setMethod('manual');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const purchaseDate = new Date(form.purchase_date);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + form.warranty_months);

    addProduct({
      name: form.name,
      brand: form.brand,
      retailer: form.retailer,
      purchase_date: form.purchase_date,
      warranty_months: form.warranty_months,
      expiry_date: expiryDate.toISOString().split('T')[0],
      amount_paid: Number(form.amount_paid),
      receipt_url: form.receipt_url,
    });

    setShowConfetti(true);
    // Trigger confetti
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1565C0', '#F59E0B', '#10B981'],
      });
    } catch {
      // confetti not available
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/dashboard');
  };

  const updateForm = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => method === 'select' ? router.back() : setMethod('select')}
            className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft size={16} /> {method === 'select' ? 'Back' : 'Choose Method'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-text dark:text-dark-text" style={{ fontFamily: 'var(--font-heading)' }}>
            {method === 'select' ? 'Add New Product' : method === 'scan' ? 'Scan Receipt' : 'Product Details'}
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
            {method === 'select'
              ? 'Choose how you want to add your product'
              : method === 'scan'
              ? 'Upload a receipt image for automatic extraction'
              : 'Fill in your product and warranty details'
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Method Selection */}
          {method === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {methods.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMethod(m.id)}
                  className="bg-surface dark:bg-dark-surface rounded-2xl p-6 border border-border dark:border-dark-border text-left card-hover group"
                >
                  <div className="text-primary mb-3 group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <h3 className="font-bold text-text dark:text-dark-text mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {m.title}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {m.desc}
                  </p>
                  {(m.id === 'amazon' || m.id === 'razorpay') && (
                    <span className="inline-block mt-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent-dark dark:text-accent-light">
                      Coming Soon
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Scan Receipt */}
          {method === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface dark:bg-dark-surface rounded-2xl p-8 border border-border dark:border-dark-border"
            >
              {!isScanning && !scanComplete ? (
                <div className="text-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-border dark:border-dark-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="mb-4 text-primary"
                    >
                      <Camera size={48} />
                    </motion.div>
                    <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary group-hover:text-primary transition-colors">
                      Click to upload receipt image
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-1">
                      JPG, PNG, or PDF up to 10MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleScan}
                  />
                  <button
                    onClick={handleScan}
                    className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    Use Demo Receipt Instead
                  </button>
                </div>
              ) : isScanning ? (
                <div className="text-center py-8">
                  {/* Scanning animation */}
                  <div className="relative w-48 h-64 mx-auto mb-6 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border overflow-hidden">
                    <div className="scan-line" />
                    <div className="absolute inset-0 flex items-center justify-center text-primary/40">
                      <Receipt size={64} />
                    </div>
                  </div>
                  <motion.p
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-sm font-medium text-primary"
                  >
                    Scanning receipt with AI...
                  </motion.p>
                  <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-2">
                    Extracting product details using Open Source OCR (Tesseract)
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-success" />
                  <p className="font-bold text-text dark:text-dark-text mb-2">Scan Complete!</p>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    We extracted the details. Review and save below.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Manual Form / Amazon / Razorpay */}
          {(method === 'manual' || method === 'amazon' || method === 'razorpay') && (
            <motion.form
              key={method}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="bg-surface dark:bg-dark-surface rounded-2xl p-6 sm:p-8 border border-border dark:border-dark-border space-y-5"
            >
              {method === 'amazon' && !scanComplete && (
                <div className="p-4 bg-primary/10 rounded-xl text-sm text-primary flex flex-col gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Package size={18} />
                    <span className="font-semibold">Amazon Sync (Simulated)</span>
                  </div>
                  <p className="text-xs">Connecting to your Amazon account to fetch recent orders...</p>
                  <button 
                    type="button"
                    onClick={handleScan} // Reuse handleScan for sync simulation
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold"
                  >
                    Login to Amazon
                  </button>
                </div>
              )}

              {method === 'razorpay' && !scanComplete && (
                <div className="p-4 bg-primary/10 rounded-xl text-sm text-primary flex flex-col gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} />
                    <span className="font-semibold">Razorpay Sync (Simulated)</span>
                  </div>
                  <p className="text-xs">Fetching receipts from your Razorpay payment history...</p>
                  <button 
                    type="button"
                    onClick={handleScan} // Reuse handleScan for sync simulation
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold"
                  >
                    Verify via OTP
                  </button>
                </div>
              )}

              {scanComplete && (
                <div className="p-4 bg-success/10 rounded-xl text-sm text-success flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} />
                  <span>Auto-filled from scanned receipt. Review and edit if needed.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g. MacBook Pro 14 inch"
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => updateForm('brand', e.target.value)}
                    placeholder="e.g. Apple"
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                  Retailer *
                </label>
                <input
                  type="text"
                  value={form.retailer}
                  onChange={(e) => updateForm('retailer', e.target.value)}
                  placeholder="e.g. Amazon, Flipkart, Apple Store"
                  className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    value={form.purchase_date}
                    onChange={(e) => updateForm('purchase_date', e.target.value)}
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                    Warranty Period *
                  </label>
                  <select
                    value={form.warranty_months}
                    onChange={(e) => updateForm('warranty_months', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>1 Year</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>2 Years</option>
                    <option value={36}>3 Years</option>
                    <option value={48}>4 Years</option>
                    <option value={60}>5 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text dark:text-dark-text mb-1.5">
                  Amount Paid (₹) *
                </label>
                <input
                  type="number"
                  value={form.amount_paid}
                  onChange={(e) => updateForm('amount_paid', e.target.value)}
                  placeholder="e.g. 49999"
                  className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted"
                  required
                />
              </div>

              {/* Success animation */}
              <AnimatePresence>
                {showConfetti && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="bg-surface dark:bg-dark-surface rounded-3xl p-10 text-center shadow-2xl"
                    >
                      <PartyPopper size={64} className="mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Warranty Saved!
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        Redirecting to dashboard...
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!form.name || !form.brand || !form.purchase_date || !form.amount_paid}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Product <Rocket size={18} className="inline ml-1" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
