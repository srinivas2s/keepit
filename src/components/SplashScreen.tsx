'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Slightly longer for the premium animation to breathe

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background Accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[120px]"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[100px]"
            />
          </div>

          {/* Centered Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-md w-full">
            {/* Logo with Floating & Shadow Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-10"
            >
              {/* Decorative Ripples */}
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 border border-blue-100 rounded-full -m-4"
              />
              <motion.div 
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 border border-blue-50 rounded-full -m-8"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Logo size="large" forceLight={true} />
              </motion.div>
            </motion.div>

            {/* Tagline with 'Getting Clear' Cinematic Animation */}
            <div className="overflow-hidden text-center">
              <motion.p
                initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 1.5, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="text-slate-800 font-bold text-lg sm:text-xl tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Receipts Fade. KeepIt Doesn&apos;t.
              </motion.p>
              
              {/* Animated Underline Decal */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "40px", opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="h-1 bg-primary/20 rounded-full mx-auto mt-4"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
