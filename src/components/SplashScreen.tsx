'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                filter: ["drop-shadow(0 0 0px rgba(21, 101, 192, 0))", "drop-shadow(0 0 20px rgba(21, 101, 192, 0.2))", "drop-shadow(0 0 0px rgba(21, 101, 192, 0))"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
            <Logo size="large" className="mx-auto" forceLight={true} />
            </motion.div>

            {/* Tagline with 'Getting Clear' animation */}
            <motion.p
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              className="text-slate-800 font-bold tracking-tight mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Receipts Fade. KeepIt Doesn&apos;t.
            </motion.p>
          </motion.div>
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
