'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = "", variant = 'rect' }: SkeletonProps) {
  const baseClass = "relative overflow-hidden bg-surface-hover dark:bg-dark-surface-hover";
  
  const variantClass = {
    text: "h-4 w-full rounded",
    rect: "rounded-xl",
    circle: "rounded-full"
  }[variant];

  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      <motion.div
        initial={{ left: "-100%" }}
        animate={{ left: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
      />
    </div>
  );
}

// Pre-built Skeletons for common UI patterns
export function ProductCardSkeleton() {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="rect" className="w-10 h-10 rounded-lg" />
        <Skeleton variant="rect" className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton variant="text" className="w-3/4 mb-2 h-5" />
      <Skeleton variant="text" className="w-1/2 mb-4" />
      <div className="flex items-center justify-between pt-4 border-t border-border dark:border-dark-border">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-12" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface dark:bg-dark-surface p-4 sm:p-5 rounded-2xl border border-border dark:border-dark-border">
      <Skeleton variant="text" className="w-20 mb-2 h-3" />
      <Skeleton variant="text" className="w-12 h-6" />
    </div>
  );
}

export function AlertItemSkeleton() {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl p-4 sm:p-5 border border-border dark:border-dark-border flex items-start gap-4">
      <Skeleton variant="circle" className="w-3 h-3 mt-1 flex-shrink-0" />
      <div className="flex-1">
        <Skeleton variant="text" className="w-1/4 mb-2" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
      <Skeleton variant="rect" className="w-4 h-4" />
    </div>
  );
}
