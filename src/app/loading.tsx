'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 w-48 rounded-2xl shimmer" />
            <div className="h-5 w-64 rounded-lg shimmer opacity-60" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 rounded-2xl shimmer" />
            <div className="h-12 w-40 rounded-2xl shimmer" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-[32px] bg-surface dark:bg-dark-surface border border-border dark:border-dark-border p-6 space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-2xl shimmer" />
                <div className="w-8 h-8 rounded-full shimmer" />
              </div>
              <div className="h-4 w-16 rounded-md shimmer opacity-40" />
            </div>
          ))}
        </div>

        {/* Search/Filter Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-14 rounded-[28px] shimmer" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-24 rounded-2xl shimmer" />
            ))}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-[40px] bg-surface dark:bg-dark-surface border border-border dark:border-dark-border p-6 space-y-6">
              <div className="flex justify-between">
                <div className="w-14 h-14 rounded-2xl shimmer" />
                <div className="w-20 h-6 rounded-full shimmer" />
              </div>
              <div className="space-y-3">
                <div className="h-7 w-3/4 rounded-xl shimmer" />
                <div className="h-4 w-1/2 rounded-lg shimmer opacity-60" />
              </div>
              <div className="pt-4 flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-12 rounded shimmer opacity-40" />
                  <div className="h-5 w-20 rounded shimmer" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-3 w-12 rounded shimmer opacity-40 ml-auto" />
                  <div className="h-5 w-24 rounded shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
