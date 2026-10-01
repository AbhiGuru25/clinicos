'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ZynteqBolt } from '@/components/Brand';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        console.log('Login successful:', data);
        setSuccess(true);
        setLoading(false);
        router.refresh();
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#F8FAFC' }}>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[2rem] p-8 md:p-10 border bg-white shadow-xl shadow-blue-900/5"
          style={{ borderColor: 'var(--border)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-4"
            >
              <ZynteqBolt size={30} tile tileSize={64} />
            </motion.div>

            <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              Clinic<span className="text-brand-primary">OS</span>
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">by Zynteq<span style={{ color: '#F5C518' }}>.</span></span>
            <p className="text-sm font-medium mt-3 text-slate-500">
              Doctor Portal — Secure Sign In
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@clinicos.in"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target"
                    style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                  <button type="button" className="text-[10px] font-bold text-brand-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target"
                    style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-xl flex items-center gap-3 text-xs font-bold"
                  style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}
                >
                  <AlertCircle size={15} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 mt-2 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 touch-target"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    Sign In to Console
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-100 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back!</h2>
                <p className="text-sm font-medium text-slate-500">Entering the dashboard...</p>
              </div>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid rgba(22, 163, 74, 0.2)' }}
              >
                <Sparkles size={18} />
                Enter Dashboard
              </button>
            </motion.div>
          )}

          <div className="mt-7 text-center border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold text-slate-500">
              New to ClinicOS?{' '}
              <a
                href="/signup"
                className="text-brand-primary hover:underline"
              >
                Start your Free Trial
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-5 text-xs font-medium text-slate-400">
          ClinicOS is a Zynteq product. © 2026 All rights reserved.
        </p>
      </motion.div>
    </main>
  );
}
