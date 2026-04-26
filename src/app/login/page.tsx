'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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

  useEffect(() => {
    if (otp.every(d => d !== '') && step === 'otp') {
      handleVerifyOtp(new Event('submit') as unknown as React.FormEvent);
    }
  }, [otp, step]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '']);
    setName('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50 flex items-center justify-center p-0 sm:p-4 lg:p-8 overflow-hidden font-sans">
      <div className="w-full h-full sm:h-auto lg:max-w-5xl lg:h-[650px] bg-white sm:rounded-[40px] shadow-none sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex relative border-none lg:border lg:border-white">
        
        {/* Desktop Sliding Overlay (Hidden on Mobile) */}
        <motion.div
          animate={{ x: isSignUp ? '0%' : '100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 22 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-primary z-30 hidden lg:flex flex-col items-center justify-center p-12 text-white text-center"
        >
          <motion.div
            key={isSignUp ? 'signup-msg' : 'signin-msg'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Logo size="large" forceLight className="mb-12" />
            <h2 className="text-4xl font-black mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {isSignUp ? 'Welcome Back!' : 'Join the Revolution'}
            </h2>
            <p className="text-blue-100 mb-10 max-w-xs text-lg opacity-80 leading-relaxed">
              {isSignUp 
                ? 'Sign in to keep your warranties secured and never miss an expiry again.' 
                : 'Start protecting your products today. KeepIt makes warranty management simple.'}
            </p>
            <button
              onClick={toggleMode}
              className="px-10 py-4 border-2 border-white/30 rounded-2xl font-bold hover:bg-white hover:text-primary transition-all active:scale-95 bg-white/10 backdrop-blur-sm"
            >
              {isSignUp ? 'Login Instead' : 'Create Account'}
            </button>
          </motion.div>
        </motion.div>

        {/* Form Panel (Full screen on mobile, Half screen on desktop) */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 z-20">
          <div className="max-w-sm mx-auto w-full">
            {/* Mobile Logo Section */}
            <div className="lg:hidden mb-10 flex flex-col items-center">
              <Logo size="normal" className="mb-2" />
              <div className="h-1 w-12 bg-primary/10 rounded-full mt-4" />
            </div>
            
            <motion.div
               key={isSignUp ? 'signup-head' : 'signin-head'}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </h1>
              <p className="text-slate-500 mb-8 text-base lg:text-lg">
                {step === 'phone' && (isSignUp ? 'Create your secure account.' : 'Access your warranty vault.')}
                {step === 'otp' && 'Check your messages for a code.'}
                {step === 'name' && 'Finalizing your profile...'}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Full Name</label>
                      <div className="relative flex items-center group">
                        <div className="absolute left-5 flex items-center gap-3 pointer-events-none">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <User size={18} />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-14 pr-6 py-3 !bg-white rounded-xl border-2 border-slate-100 focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all font-bold text-base !text-black placeholder:text-slate-400 shadow-sm"
                          placeholder="Your Name"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Email Address</label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-5 flex items-center gap-3 pointer-events-none">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          <Mail size={18} />
                        </div>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-3 !bg-white rounded-xl border-2 border-slate-100 focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all font-bold text-base !text-black placeholder:text-slate-400 shadow-sm"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Phone Number</label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 flex items-center gap-3 pointer-events-none z-10">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          <Phone size={16} />
                        </div>
                        <span className="font-black text-slate-900 text-lg border-r-2 border-slate-100 pr-3 leading-none">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full pl-28 pr-6 py-3 !bg-white rounded-xl border-2 border-slate-100 focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all font-bold text-lg !text-black placeholder:text-slate-400 shadow-sm"
                        placeholder="000 000 0000"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={isLoading || phone.length < 10}
                    className="w-full py-4 bg-[#1565C0] text-white rounded-xl font-black text-lg shadow-lg shadow-blue-900/10 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
                  >
                    {isLoading ? (
                      <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      isSignUp ? 'Create Account' : 'Login'
                    )}
                  </button>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-8"
                >
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full h-16 !bg-white border-2 border-slate-100 rounded-2xl text-center text-3xl font-black !text-black focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all"
                        maxLength={1}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  <button
                    disabled={isLoading}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all"
                  >
                    Verify & Continue
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    className="w-full text-center text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    Back to edit phone number
                  </button>
                </motion.form>
              )}

              {step === 'name' && (
                <motion.form
                  key="name"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleNameSubmit}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-xl text-slate-800"
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                  <button
                    disabled={isLoading || !name.trim()}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all"
                  >
                    {isLoading ? 'Wait a moment...' : 'Get My Dashboard 🚀'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 font-bold text-sm text-center"
              >
                {error}
              </motion.div>
            )}
            
            <button
              onClick={toggleMode}
              className="mt-10 w-full lg:hidden text-[#1565C0] font-black text-sm uppercase tracking-widest"
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Create one'}
            </button>
          </div>
        </div>

        {/* Empty Spacer Panel (Hidden by Sliding Overlay on desktop) */}
        <div className="hidden lg:block w-1/2 bg-slate-50/30"></div>
      </div>
      
      {/* Background Subtle Decal */}
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -z-10" />
      <div className="fixed -top-20 -right-20 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -z-10" />
    </div>
  );
}
