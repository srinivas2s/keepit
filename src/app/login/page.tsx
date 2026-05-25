'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { Phone, Mail, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signUp } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSignUp) {
      if (!email || !password) {
        setError('Please enter your email and password');
        return;
      }
      setIsLoading(true);
      try {
        await login(email, password);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Login failed. Please verify your email and password.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!name || !email || !phone || !password) {
      setError('Please fill in all details');
      return;
    }
    setIsLoading(true);
    try {
      // Generate random 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Verification initialization failed.');
    } finally {
      setIsLoading(false);
    }
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

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }
    if (otpValue !== generatedOtp) {
      setError('Invalid OTP code. Please enter the verification code shown below.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name, phone);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification and registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (otp.every(d => d !== '') && step === 'otp') {
      handleVerifyOtp();
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden transition-colors duration-500">
        <div className="w-full h-screen sm:h-auto sm:max-w-4xl sm:min-h-[580px] bg-surface dark:bg-dark-surface sm:rounded-[36px] border border-border dark:border-dark-border sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] dark:sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex relative animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden transition-colors duration-500">
      <div className="w-full h-screen sm:h-auto sm:max-w-4xl sm:min-h-[580px] bg-surface dark:bg-dark-surface sm:rounded-[36px] border border-border dark:border-dark-border sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] dark:sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex relative">
        
        {/* Left/Right Accent panel on Desktop */}
        <motion.div
          animate={{ x: isSignUp ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 90, damping: 22 }}
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-br from-primary to-primary-dark z-30 hidden md:flex flex-col items-center justify-center p-12 text-white text-center select-none`}
        >
          <motion.div
            key={isSignUp ? 'signup-msg' : 'signin-msg'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center max-w-xs"
          >
            <Logo size="large" variant="white" className="mb-10" />
            <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">
              {isSignUp ? 'Welcome Back!' : 'Protect Your Products'}
            </h2>
            <p className="text-sm text-white/80 mb-8 leading-relaxed">
              {isSignUp 
                ? 'Sign in to access your warranty vault and track all your receipt dates securely.' 
                : 'Upload invoices, track expirations automatically, and verification is just a scan away.'}
            </p>
            <button
              onClick={toggleMode}
              className="px-8 py-3.5 border-2 border-white/20 rounded-2xl font-bold bg-white/10 hover:bg-white hover:text-primary transition-all active:scale-95"
            >
              {isSignUp ? 'Sign In Instead' : 'Create Account'}
            </button>
          </motion.div>
        </motion.div>

        {/* Form Container */}
        <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 z-20 bg-surface dark:bg-dark-surface transition-all duration-500 ${isSignUp ? 'md:ml-0' : 'md:ml-auto'}`}>
          <div className="max-w-sm mx-auto w-full flex flex-col justify-center">
            
            {/* Mobile Header Logo */}
            <div className="md:hidden flex flex-col items-center mb-8">
              <Logo size="normal" className="mb-1" />
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 font-bold">Your Warranty Vault</p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-text dark:text-dark-text mb-2">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
              {step === 'phone' && (isSignUp ? 'Create your secure account to start.' : 'Access your warranties instantly.')}
              {step === 'otp' && 'Enter the 4-digit code sent to your phone.'}
            </p>

            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider ml-1">Full Name</label>
                      <div className="relative flex items-center group">
                        <User size={16} className="absolute left-4 text-text-muted dark:text-dark-text-secondary group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary outline-none transition-all font-semibold"
                          placeholder="John Doe"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative flex items-center group">
                      <Mail size={16} className="absolute left-4 text-text-muted dark:text-dark-text-secondary group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary outline-none transition-all font-semibold"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative flex items-center group">
                        <Phone size={16} className="absolute left-4 text-text-muted dark:text-dark-text-secondary group-focus-within:text-primary transition-colors" />
                        <span className="absolute left-11 font-black text-text dark:text-dark-text text-sm border-r border-border dark:border-dark-border pr-2.5">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-22 pr-4 py-3 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary outline-none transition-all font-semibold"
                          placeholder="98765 43210"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider ml-1">Password</label>
                    <div className="relative flex items-center group">
                      <Lock size={16} className="absolute left-4 text-text-muted dark:text-dark-text-secondary group-focus-within:text-primary transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-background dark:bg-dark-bg rounded-2xl border border-border dark:border-dark-border text-sm text-text dark:text-dark-text placeholder:text-text-muted focus:border-primary outline-none transition-all font-semibold"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-text-muted dark:text-dark-text-secondary hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isSignUp ? 'Send OTP Verification' : 'Sign In'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}
                  className="space-y-6"
                >
                  {generatedOtp && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="text-left">
                        <p className="text-[10px] font-black text-primary uppercase tracking-wider">KeepIt Verification OTP</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">Use this security code to verify:</p>
                      </div>
                      <span className="text-xl font-black tracking-widest text-primary bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-xl border border-primary/20">{generatedOtp}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full h-14 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-center text-2xl font-black text-text dark:text-dark-text focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        maxLength={1}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Verify & Sign In'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    className="w-full text-center text-xs font-bold text-text-muted hover:text-primary transition-colors"
                  >
                    Go Back & Edit details
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-3.5 bg-danger/10 rounded-2xl border border-danger/15 text-danger font-bold text-xs text-center"
              >
                {error}
              </motion.div>
            )}
            
            <button
              onClick={toggleMode}
              className="mt-8 w-full md:hidden text-primary font-black text-xs uppercase tracking-wider hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
