'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Camera, PenTool, Package, CreditCard, ChevronLeft, CheckCircle2, Upload, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

type InputMethod = 'select' | 'scan' | 'manual' | 'amazon' | 'razorpay';

function parseReceiptText(text: string) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  let name = 'New Product';
  let brand = 'Other';
  let retailer = 'Unknown';
  let amount = 0;
  let date = new Date().toISOString().split('T')[0];

  const brandList = ['Apple', 'Samsung', 'Sony', 'LG', 'Dyson', 'HP', 'Dell', 'Logitech', 'Bose', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Motorola'];
  const retailerList = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Apple Store', 'Vijay Sales', 'Poorvika', 'Sangeetha', 'Walmart'];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const amountMatch = line.match(/(?:₹|Rs\.?|INR|\$)\s*([\d,]+\.?\d*)/i);
    if (amountMatch) {
      const parsed = parseFloat(amountMatch[1].replace(/,/g, ''));
      if (!isNaN(parsed) && parsed > amount) amount = parsed;
    }
    const dateMatch = line.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (dateMatch) {
      const [, d, m, y] = dateMatch;
      const year = y.length === 2 ? `20${y}` : y;
      date = parseInt(d) > 12
        ? `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
        : `${year}-${d.padStart(2, '0')}-${m.padStart(2, '0')}`;
    }
    brandList.forEach(b => { if (lower.includes(b.toLowerCase())) brand = b; });
    retailerList.forEach(r => { if (lower.includes(r.toLowerCase())) retailer = r; });
  }

  const nameCandidate = lines.find(l =>
    l.length > 5 && l.length < 60 &&
    !l.toLowerCase().includes('total') &&
    !l.toLowerCase().includes('tax') &&
    !l.match(/^[\d₹$]/)
  );
  if (nameCandidate) name = nameCandidate.trim();

  return { name, brand, retailer, purchase_date: date, warranty_months: 12, amount_paid: amount };
}

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, isAuthenticated, isLoading: appLoading } = useApp();
  const [method, setMethod] = useState<InputMethod>('select');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    brand: 'Other',
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

  // CLIENT-SIDE ONLY: Tesseract runs in the browser via dynamic import
  const handleScan = async (file: File) => {
    setIsScanning(true);
    setScanComplete(false);
    setError('');
    setScanProgress(0);

    try {
      // Dynamic import ensures this ONLY runs in the browser, never on the server
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const lowerText = text.toLowerCase();
      const receiptKeywords = ['receipt', 'invoice', 'bill', 'total', 'amount', 'payment', 'tax', 'date', 'gst', 'vat', 'rs.', 'inr', 'price', 'cash', 'card'];
      const matchedKeywords = receiptKeywords.filter(k => lowerText.includes(k));

      if (text.trim().length < 30 || matchedKeywords.length < 2) {
        setError("This doesn't look like a receipt. Please upload a clear photo of a purchase receipt or invoice.");
        setIsScanning(false);
        return;
      }

      const extracted = parseReceiptText(text);
      if (extracted.amount_paid === 0 && extracted.name === 'New Product') {
        setError('Could not read receipt details clearly. Try a better-quality photo or use manual entry.');
        setIsScanning(false);
        return;
      }

      setForm({
        name: extracted.name,
        brand: extracted.brand,
        retailer: extracted.retailer,
        purchase_date: extracted.purchase_date,
        warranty_months: extracted.warranty_months,
        amount_paid: extracted.amount_paid ? String(extracted.amount_paid) : '',
        receipt_url: '',
      });
      setScanComplete(true);
      setScanProgress(100);
      await new Promise(r => setTimeout(r, 700));
      setMethod('manual');
    } catch (err) {
      console.error('OCR error:', err);
      setError('Scanning failed. Please try again or use manual entry.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleScan(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleScan(file);
  }, []);

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

    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#1565C0', '#F59E0B', '#10B981'] });
    } catch {}

    await new Promise(r => setTimeout(r, 1200));
    router.push('/dashboard');
  };

  const brands = ['Other', 'Apple', 'Samsung', 'Sony', 'LG', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Motorola', 'Dyson', 'HP', 'Dell', 'Logitech'];

  const methods = [
    { id: 'scan' as const, icon: <Camera size={28} />, title: 'Scan Receipt', desc: 'AI reads your bill automatically', color: 'from-blue-500 to-blue-600' },
    { id: 'manual' as const, icon: <PenTool size={28} />, title: 'Manual Entry', desc: 'Type in your product details', color: 'from-emerald-500 to-emerald-600' },
    { id: 'amazon' as const, icon: <Package size={28} />, title: 'Amazon Import', desc: 'Sync from order history', color: 'from-orange-500 to-orange-600', soon: true },
    { id: 'razorpay' as const, icon: <CreditCard size={28} />, title: 'Razorpay Sync', desc: 'Import from payment history', color: 'from-purple-500 to-purple-600', soon: true },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg pb-32">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => method === 'select' ? router.back() : setMethod('select')}
            className="p-2.5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-text dark:text-dark-text hover:bg-primary/5 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-text dark:text-dark-text">
              {method === 'select' ? 'Add Product' : method === 'scan' ? 'Scan Receipt' : 'Product Details'}
            </h1>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">
              {method === 'select' ? 'How do you want to add?' : method === 'scan' ? 'Upload a receipt image' : 'Review and save'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Method Selection */}
          {method === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {methods.map((m, i) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setMethod(m.id)}
                    className="relative text-left p-5 rounded-3xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color} opacity-5 rounded-full translate-x-8 -translate-y-8`} />
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      {m.icon}
                    </div>
                    <p className="font-black text-text dark:text-dark-text text-base mb-1">{m.title}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{m.desc}</p>
                    {m.soon && (
                      <span className="absolute top-4 right-4 text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">Soon</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Scan Receipt */}
          {method === 'scan' && (
            <motion.div key="scan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border overflow-hidden">
                {!isScanning ? (
                  <div className="p-6">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all p-10 ${
                        isDragging
                          ? 'border-primary bg-primary/5 scale-[1.01]'
                          : 'border-border dark:border-dark-border hover:border-primary/50 hover:bg-primary/3'
                      }`}
                    >
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                          <Camera size={36} className="text-primary" />
                        </div>
                      </motion.div>
                      <p className="font-black text-text dark:text-dark-text text-lg mb-1">Upload Receipt</p>
                      <p className="text-sm text-text-secondary dark:text-dark-text-secondary text-center">
                        Drag & drop or tap to select<br />
                        <span className="text-xs opacity-60">JPG, PNG up to 10MB</span>
                      </p>
                      <div className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25">
                        <Upload size={16} />
                        Choose File
                      </div>
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                    {error && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-danger/8 dark:bg-danger/15 rounded-2xl border border-danger/20 flex items-start gap-3">
                        <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-danger font-bold text-sm">{error}</p>
                          <button onClick={() => { setError(''); fileInputRef.current?.click(); }} className="text-xs text-primary font-semibold mt-1 flex items-center gap-1 hover:underline">
                            <RefreshCw size={12} /> Try again
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-4 p-3 bg-primary/5 rounded-2xl flex items-center gap-3">
                      <Sparkles size={16} className="text-primary flex-shrink-0" />
                      <p className="text-xs text-primary font-medium">AI will extract product name, brand, retailer, date & amount automatically</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="relative w-40 h-52 mx-auto mb-6 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border overflow-hidden">
                      <div className="scan-line" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Camera size={48} className="text-primary" />
                      </div>
                    </div>
                    <p className="font-black text-text dark:text-dark-text text-lg mb-1">
                      {scanComplete ? '✅ Scan Complete!' : 'Reading Receipt...'}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-5">
                      {scanComplete ? 'Extracted your details' : 'AI is analyzing the image'}
                    </p>
                    <div className="w-full bg-border dark:bg-dark-border rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                        initial={{ width: '5%' }}
                        animate={{ width: `${Math.max(5, scanProgress)}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-2">{scanProgress}%</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Manual Form */}
          {(method === 'manual' || method === 'amazon' || method === 'razorpay') && (
            <motion.form
              key="manual"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {scanComplete && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-success/10 rounded-2xl border border-success/20 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <div>
                    <p className="font-bold text-success text-sm">Receipt Scanned!</p>
                    <p className="text-xs text-success/70">Review details below and save</p>
                  </div>
                </motion.div>
              )}

              {(method === 'amazon' || method === 'razorpay') && (
                <div className="p-4 bg-primary/8 rounded-2xl border border-primary/20 flex items-center gap-3">
                  <Sparkles size={18} className="text-primary" />
                  <p className="text-sm text-primary font-medium">
                    {method === 'amazon' ? 'Amazon import coming soon — enter details manually for now.' : 'Razorpay sync coming soon — enter details manually for now.'}
                  </p>
                </div>
              )}

              <div className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border p-5 space-y-4">
                <h2 className="font-black text-text dark:text-dark-text text-sm uppercase tracking-wider">Product Info</h2>

                <div>
                  <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="e.g. iPhone 15, Samsung TV"
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Brand *</label>
                    <select
                      value={form.brand}
                      onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Retailer *</label>
                    <input
                      type="text"
                      value={form.retailer}
                      onChange={e => setForm(p => ({ ...p, retailer: e.target.value }))}
                      required
                      placeholder="Amazon, Croma..."
                      className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border p-5 space-y-4">
                <h2 className="font-black text-text dark:text-dark-text text-sm uppercase tracking-wider">Warranty Details</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Purchase Date *</label>
                    <input
                      type="date"
                      value={form.purchase_date}
                      onChange={e => setForm(p => ({ ...p, purchase_date: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Warranty</label>
                    <select
                      value={form.warranty_months}
                      onChange={e => setForm(p => ({ ...p, warranty_months: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      {[3, 6, 12, 18, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} months</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={form.amount_paid}
                    onChange={e => setForm(p => ({ ...p, amount_paid: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Save Product 🎉
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
