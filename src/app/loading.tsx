'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative"
      >
        {/* Cinematic Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ 
            duration: 1.5, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="mb-8"
        >
          <Logo size="large" variant="light" className="mx-auto" />
        </motion.div>

        {/* Minimal Progress Indicator */}
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mx-auto relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-[#1565C0] rounded-full"
          />
        </div>

        {/* Subtle Status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-6 font-black"
        >
          Securing Vault
        </motion.p>
      </motion.div>
      
      {/* Soft Ambient Decals */}
      <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-50/50 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
