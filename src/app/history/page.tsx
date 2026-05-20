'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, PlusCircle, ArrowRightLeft, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { formatDate } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');
  const { products, alerts } = useApp();

  const historyItems = useMemo(() => {
    const items = [];

    // Map products to "addition" history
    for (const prod of products) {
      items.push({
        id: `prod-${prod.id}`,
        type: 'addition',
        title: `${prod.name} Added`,
        description: `Product added to vault with ${prod.warranty_months} months of warranty coverage from ${prod.retailer}.`,
        date: new Date(prod.created_at || new Date()),
        icon: <PlusCircle size={20} className="text-blue-500" />,
      });
    }

    // Map alerts to "alert" history
    for (const alert of alerts) {
      const prod = products.find(p => p.id === alert.product_id);
      items.push({
        id: `alert-${alert.id}`,
        type: 'alert',
        title: `${prod?.name || 'Product'} Alert`,
        description: `Warranty reminder: ${prod?.name || 'Product'} is ${alert.alert_type === 'expired' ? 'now expired' : `expires in ${alert.alert_type.replace('day', ' days')}`}.`,
        date: new Date(alert.created_at || new Date()),
        icon: <AlertCircle size={20} className="text-amber-500" />,
      });
    }

    // Sort by date descending
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [products, alerts]);

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
          {['all', 'addition', 'alert'].map((f) => (
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
          
          <AnimatePresence mode="popLayout">
            {historyItems.filter(i => filter === 'all' || i.type === filter).map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  delay: i * 0.05,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
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
                      {formatDate(item.date.toISOString())}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {historyItems.filter(i => filter === 'all' || i.type === filter).length === 0 && (
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
