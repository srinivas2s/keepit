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
      {/* Navbar for Landing */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Logo size="small" />
          </div>
          <Link
            href="/login"
            className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/3 to-accent/3 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Smart Warranty Management
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-text dark:text-dark-text">Receipts Fade.</span>
            <br />
            <span className="gradient-text">KeepIt Doesn&apos;t.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mb-10"
          >
            Never lose a warranty again. Scan receipts, track expiry dates, and verify warranties at service centres — all from your phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl text-lg font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Tracking Free <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-surface dark:bg-dark-surface text-text dark:text-dark-text rounded-2xl text-lg font-semibold border border-border dark:border-dark-border hover:border-primary/30 transition-all"
            >
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { value: '10K+', label: 'Users' },
              { value: '50K+', label: 'Warranties' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted dark:text-dark-text-secondary">{stat.label}</div>
              </div>
            ))}
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent-dark dark:text-accent-light text-sm font-semibold mb-4"
            >
              <Sparkles size={16} className="text-accent-dark dark:text-accent-light" /> Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-text dark:text-dark-text mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Logo size="large" className="mx-auto" />
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto"
            >
              From scanning receipts to verifying at service centres — KeepIt handles it all.
            </motion.p>
          </motion.div>

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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-dark-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
            >
              <Rocket size={16} className="text-primary" /> How It Works
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-text dark:text-dark-text mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 relative z-10">
                  {step.icon}
                </div>
                <span className="text-5xl font-extrabold text-primary/10 dark:text-primary/20 absolute -top-4 left-1/2 -translate-x-1/2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-text dark:text-dark-text mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Protect Your Purchases?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
            Join thousands of smart shoppers who never miss a warranty claim.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl text-lg font-bold hover:bg-white/90 transition-all shadow-xl hover:-translate-y-0.5 relative z-10"
          >
            Get Started — It&apos;s Free
            <ArrowRight size={24} />
          </Link>
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
