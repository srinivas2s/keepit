'use client';

import { motion } from 'framer-motion';
import { History, PlusCircle, ArrowRightLeft, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/supabase';

const mockHistory = [
  {
    id: 1,
    type: 'addition',
    title: 'MacBook Pro 14" Added',
    description: 'Product added to vault with 2 years of AppleCare+ coverage.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: <PlusCircle size={20} className="text-blue-500" />,
  },
  {
    id: 2,
    type: 'transfer',
    title: 'Warranty Transferred',
    description: 'iPad Air M2 ownership transferred to srinivas@example.com.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: <ArrowRightLeft size={20} className="text-purple-500" />,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Expiry Reminder',
    description: 'Galaxy S24 Ultra warranty will expire in 30 days.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    icon: <AlertCircle size={20} className="text-amber-500" />,
  },
  {
    id: 4,
    type: 'success',
    title: 'Verification Success',
    description: 'Sony WH-1000XM5 warranty verified at Sony Center, Mumbai.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    icon: <CheckCircle2 size={20} className="text-emerald-500" />,
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[#1565C0]">
              <History size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-text dark:text-dark-text tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Activity History
              </h1>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Track every update and action in your vault
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'addition', 'transfer', 'alert', 'success'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${
                filter === f
                  ? 'bg-[#1565C0] text-white border-[#1565C0] shadow-lg shadow-blue-900/10'
                  : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary border-border dark:border-dark-border hover:border-[#1565C0]/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100 dark:bg-white/5 -z-10" />
          
          {mockHistory.filter(i => filter === 'all' || i.type === filter).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-black border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              
              <div className="flex-1 bg-surface dark:bg-dark-surface p-6 rounded-3xl border border-border dark:border-dark-border hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-text dark:text-dark-text">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-dark-text-secondary">
                    {formatDate(item.date)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}

          {mockHistory.filter(i => filter === 'all' || i.type === filter).length === 0 && (
            <div className="text-center py-20 bg-surface dark:bg-dark-surface rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
              <History size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-text-secondary dark:text-dark-text-secondary font-medium">No activities found for this filter</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
