'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Accept any OTP for demo
    setStep('name');
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    login('+91' + phone, name.trim());
    router.push('/dashboard');
  };

  // Auto-verify when all OTP digits are entered
  useEffect(() => {
    if (otp.every(d => d !== '') && step === 'otp') {
      handleVerifyOtp(new Event('submit') as unknown as React.FormEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>K</span>
            </div>
            <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              KeepIt
            </span>
          </Link>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            {step === 'phone' && 'Enter your mobile number to get started'}
            {step === 'otp' && `We sent a code to +91 ${phone}`}
            {step === 'name' && 'Almost there! What should we call you?'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface dark:bg-dark-surface rounded-3xl p-8 shadow-xl border border-border dark:border-dark-border"
        >
          <AnimatePresence mode="wait">
            {/* Phone Step */}
            {step === 'phone' && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-2">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-3 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-text dark:text-dark-text text-lg font-medium tracking-wider placeholder:text-text-muted"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-danger text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>Send OTP</>
                  )}
                </button>
              </motion.form>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-4">
                    Enter Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {otp.map((digit, i) => (
                      <motion.input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-14 h-14 text-center text-2xl font-bold bg-background dark:bg-dark-bg rounded-xl border-2 border-border dark:border-dark-border text-text dark:text-dark-text focus:border-primary transition-colors"
                        maxLength={1}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-danger text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    'Verify'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    ← Change Number
                  </button>
                </div>
              </motion.form>
            )}

            {/* Name Step */}
            {step === 'name' && (
              <motion.form
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNameSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-text dark:text-dark-text mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border text-text dark:text-dark-text text-lg placeholder:text-text-muted"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-danger text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>Let&apos;s Go 🚀</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {['phone', 'otp', 'name'].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-primary' : 'w-2 bg-border dark:bg-dark-border'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Demo hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-text-muted dark:text-dark-text-secondary mt-6"
        >
          💡 Demo mode: Any phone number and OTP will work
        </motion.p>
      </div>
    </div>
  );
}
