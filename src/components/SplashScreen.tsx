'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
          className="fixed inset-0 z-[9999] bg-background dark:bg-dark-bg flex flex-col items-center justify-center p-6"
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
              <Image 
                src="/logo.png" 
                alt="KeepIt" 
                width={180} 
                height={48} 
                className="h-12 w-auto object-contain mx-auto mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-200"
                priority
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-text-secondary dark:text-dark-text-secondary font-medium tracking-wide mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Receipts Fade. KeepIt Doesn&apos;t.
            </motion.p>

            {/* Loading Progress Bar */}
            <div className="w-48 h-1 bg-surface dark:bg-dark-surface rounded-full overflow-hidden mx-auto relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: "easeInOut" 
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-primary rounded-full"
              />
            </div>

            {/* Subtle Status Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
              className="text-[10px] text-text-muted dark:text-dark-text-secondary uppercase tracking-[0.2em] mt-4"
            >
              Securing your warranties
            </motion.p>
          </motion.div>
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
