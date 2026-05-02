'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
        router.push('/dashboard');
        setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0F0F1A' }}>

      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6C5CE7, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #00B4D8, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #6C5CE7, transparent)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,92,231,1) 1px, transparent 1px), linear-gradient(to right, rgba(108,92,231,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[2rem] p-8 md:p-10 border"
          style={{ background: 'rgba(26,26,46,0.8)', backdropFilter: 'blur(24px)', borderColor: 'rgba(108,92,231,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,92,231,0.1)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #4F46E5)', boxShadow: '0 8px 32px rgba(108,92,231,0.5)' }}>
              <span className="text-white font-black text-3xl relative z-10" style={{ fontFamily: 'Outfit, sans-serif' }}>Z</span>
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(circle at 70% 30%, white, transparent)' }} />
            </motion.div>

            <h1 className="font-black text-3xl text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Clinic<span style={{ color: '#A29BFE' }}>OS</span>
            </h1>
            <span className="zynteq-badge mt-2">by Zynteq</span>
            <p className="text-sm font-medium mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Doctor Portal — Secure Sign In
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@clinicos.in"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-medium text-white placeholder:font-normal outline-none transition-all touch-target"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(108,92,231,0.6)'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
                  <button type="button" className="text-[10px] font-bold hover:underline" style={{ color: '#A29BFE' }}>Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-medium text-white placeholder:font-normal outline-none transition-all touch-target"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(108,92,231,0.6)'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-xl flex items-center gap-3 text-xs font-semibold"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}
                >
                  <AlertCircle size={15} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-base text-white flex items-center justify-center gap-2 group disabled:opacity-50 transition-all touch-target"
                style={{ background: 'linear-gradient(135deg, #6C5CE7, #4F46E5)', boxShadow: '0 4px 20px rgba(108,92,231,0.4)' }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(108,92,231,0.55)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(108,92,231,0.4)')}
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
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle2 size={32} style={{ color: '#10B981' }} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Welcome back!</h2>
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Entering the dashboard...</p>
              </div>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}
              >
                <Sparkles size={18} />
                Enter Dashboard
              </button>
            </motion.div>
          )}

          <div className="mt-7 text-center">
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
              New to ClinicOS?{' '}
              <a
                href="https://wa.me/916352449698?text=Hi!%20I'd%20like%20to%20request%20an%20invite%20for%20ClinicOS%20by%20Zynteq."
                className="font-bold hover:underline"
                style={{ color: '#A29BFE' }}
              >
                Request an Invite
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
          ClinicOS is a Zynteq product. © 2026 All rights reserved.
        </p>
      </motion.div>
    </main>
  );
}
