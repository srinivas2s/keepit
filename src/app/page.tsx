'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Camera, Bell, QrCode, Lock, LayoutDashboard, ArrowRightLeft, CheckCircle2, ClipboardList, Sparkles, Rocket, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: <Camera size={24} />,
    title: 'Scan & Store',
    description: 'Upload a receipt and our AI extracts all warranty details automatically.',
  },
  {
    icon: <Bell size={24} />,
    title: 'Smart Alerts',
    description: 'Get notified 90, 30, and 7 days before any warranty expires.',
  },
  {
    icon: <QrCode size={24} />,
    title: 'QR Verification',
    description: 'Generate QR codes to verify warranty at any service centre instantly.',
  },
  {
    icon: <Lock size={24} />,
    title: 'Secure Storage',
    description: 'All your receipts and warranty data encrypted and stored safely.',
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Dashboard',
    description: 'See all your warranties at a glance with status tracking and insights.',
  },
  {
    icon: <ArrowRightLeft size={24} />,
    title: 'Transfer Warranty',
    description: 'Easily transfer warranty ownership when you sell or gift a product.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Scan Your Receipt',
    description: 'Take a photo of your receipt or enter details manually. Our OCR does the rest.',
    icon: <Camera size={28} />,
  },
  {
    number: '02',
    title: 'Track Warranties',
    description: 'All your products appear on your dashboard with live countdown timers.',
    icon: <ClipboardList size={28} />,
  },
  {
    number: '03',
    title: 'Stay Protected',
    description: 'Get smart alerts before expiry. Show QR code at service centres for instant verification.',
    icon: <CheckCircle2 size={28} />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg overflow-hidden">
      
      {/* Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="normal" />
        <Link 
          href="/login" 
          className="px-6 py-2.5 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl font-black text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">


        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="gradient-text">
              Receipts Fade.<br />
              KeepIt Doesn&apos;t.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Never lose a warranty again. Scan receipts, track expiry dates, and verify coverage — all from your phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/login"
              className="px-10 py-5 bg-[#1565C0] text-white rounded-2xl font-black text-xl hover:bg-[#0D47A1] transition-all shadow-xl shadow-blue-900/10 hover:-translate-y-1 active:scale-95 text-center min-w-[240px]"
            >
              Start Tracking Free
            </Link>

            <Link
              href="#features"
              className="px-10 py-5 bg-[#1565C0] text-white rounded-2xl font-black text-xl hover:bg-[#0D47A1] transition-all shadow-xl shadow-blue-900/10 hover:-translate-y-1 active:scale-95 text-center min-w-[240px]"
            >
              Learn More
            </Link>
          </motion.div>

        </div>

        {/* Floating Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto mt-16 relative"
        >
          <div className="bg-surface dark:bg-dark-surface rounded-3xl shadow-2xl border border-border dark:border-dark-border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="ml-4 text-sm text-text-muted dark:text-dark-text-secondary">KeepIt Dashboard</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'MacBook Pro', brand: 'Apple', status: 'active', days: '415 days left', color: 'bg-success' },
                { name: 'Galaxy S24 Ultra', brand: 'Samsung', status: 'expiring', days: '23 days left', color: 'bg-warning' },
                { name: 'Sony WH-1000XM5', brand: 'Sony', status: 'expired', days: 'Expired', color: 'bg-danger' },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.15 }}
                  className="bg-background dark:bg-dark-bg rounded-2xl p-4 border border-border dark:border-dark-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full badge-${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-text dark:text-dark-text">{item.name}</h4>
                  <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-1">{item.brand}</p>
                  <p className="text-xs font-medium text-primary mt-2">{item.days}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group bg-surface dark:bg-dark-surface rounded-2xl p-6 border border-border dark:border-dark-border card-hover cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-200 dark:bg-white/10" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center group relative"
              >
                {/* Step Icon with Glow */}
                <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="relative w-full h-full bg-slate-50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl flex items-center justify-center text-[#1565C0] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#1565C0]/30">
                    {step.icon}
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>
                    {step.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden"
        >

          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 relative z-10 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Protect Your Purchases?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
            Join thousands of smart shoppers who never miss a warranty claim. Get started with your first scan in seconds.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/login"
              className="px-12 py-5 bg-white text-blue-600 rounded-2xl text-xl font-black hover:bg-white/90 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-background dark:bg-black py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-white/10 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo size="normal" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Receipts Fade.<br />
                KeepIt Doesn&apos;t.
              </p>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                The world&apos;s most reliable way to manage warranties and protect your purchases. Never lose a receipt again.
              </p>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="/login" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} KeepIt Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.2225 0z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
