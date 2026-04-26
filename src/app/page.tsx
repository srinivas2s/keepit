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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Massive Logo Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <Logo size="large" className="w-full h-full grayscale opacity-50" />
          </motion.div>
        </div>

        {/* Dynamic Mesh Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-amber-500/5 dark:bg-amber-400/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="gradient-text drop-shadow-2xl">
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
              className="px-10 py-5 bg-white/5 backdrop-blur-xl text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all border border-white/10 text-center min-w-[240px]"
            >
              Start Tracking Free
            </Link>

            <Link
              href="#features"
              className="px-10 py-5 bg-white/5 backdrop-blur-xl text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all border border-white/10 text-center min-w-[240px]"
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
      {/* How It Works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
        
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
              className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Luminous Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent shadow-[0_0_20px_rgba(56,189,248,0.5)]" />

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
                  <div className="absolute inset-0 bg-sky-400/20 blur-2xl rounded-3xl scale-75 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center text-sky-400 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-sky-400/30 group-hover:shadow-sky-500/20">
                    {step.icon}
                  </div>
                </div>

                <div className="relative">
                  <span className="text-8xl font-black text-white/5 absolute -top-16 left-1/2 -translate-x-1/2 select-none" style={{ fontFamily: 'var(--font-heading)' }}>
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-4 relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>
                    {step.title}
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
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
        {/* CTA Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(14,165,233,0.3)]"
        >
          {/* Luminous accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

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
      <footer className="py-8 px-4 border-t border-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="small" className="grayscale opacity-60" />
            <span className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary ml-2">
              © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-sm text-text-muted dark:text-dark-text-secondary">
            Receipts Fade. KeepIt Doesn&apos;t.
          </p>
        </div>
      </footer>
    </div>
  );
}
