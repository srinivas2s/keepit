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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);



  const handleAuth = async (e: React.FormEvent) => {
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
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        setError(error.message || 'Login failed. Please verify your email and password.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!name || !email || !password) {
      setError('Please fill in Name, Email, and Password');
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password, name, phone || `phone-${Math.floor(100000 + Math.random() * 900000)}`);
      router.push('/dashboard');
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setError(error.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setPhone('');
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
              {isSignUp ? 'Create your secure account to start.' : 'Access your warranties instantly.'}
            </p>

            <AnimatePresence mode="wait">
              <motion.form
                key="auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleAuth}
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
                      type="text"
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
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.form>
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

