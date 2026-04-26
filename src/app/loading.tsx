'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none h-1 bg-transparent">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "95%" }}
        transition={{ 
          duration: 10, 
          ease: "linear" 
        }}
        className="h-full bg-[#1565C0] shadow-[0_0_10px_rgba(21,101,192,0.5)]"
      />
    </div>
  );
}
