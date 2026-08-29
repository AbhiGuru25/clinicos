'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Building, User, Phone, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  
  // 5 fields
  const [clinicName, setClinicName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Sign up the user with metadata for the DB Trigger
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            doctor_name: doctorName,
            clinic_name: clinicName,
            whatsapp_number: phone,
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Note: The 'clinics' table record is now created automatically 
      // by a Supabase Database Trigger on auth.users using the metadata above.

      // 3. Optional: Trigger Welcome Email via API route (stubbed)
      fetch('/api/emails/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, doctorName, clinicName }),
      }).catch(err => console.error('Email trigger failed:', err));

      setSuccess(true);
      setLoading(false);
      
      // 4. Redirect to dashboard if session exists (email confirmation disabled)
      if (authData.session) {
        router.refresh();
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#F8FAFC' }}>
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="rounded-[2rem] p-8 md:p-10 border bg-white shadow-xl shadow-blue-900/5" style={{ borderColor: 'var(--border)' }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white font-black text-3xl shadow-sm" style={{ background: 'var(--brand-primary)', fontFamily: 'Inter, sans-serif' }}>
              Z
            </div>
            <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              Clinic<span className="text-brand-primary">OS</span>
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">by Zynteq</span>
            <p className="text-sm font-medium mt-3 text-slate-500">
              Start your free trial today. No credit card required.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Clinic Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" required value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="KK Neuro Vision Therapy Institute" className="w-full pl-11 pr-4 py-3 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target" style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Doctor Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" required value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. Rahul Sharma" className="w-full pl-11 pr-4 py-3 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target" style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target" style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@clinicos.in" className="w-full pl-11 pr-4 py-3 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target" style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 rounded-xl font-bold text-slate-900 placeholder:font-medium outline-none transition-all border touch-target" style={{ background: 'var(--bg-app)', borderColor: 'var(--border)' }} />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3.5 rounded-xl flex items-center gap-3 text-xs font-bold" style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}>
                  <AlertCircle size={15} />
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50 touch-target">
                {loading ? <Loader2 className="animate-spin" size={22} /> : <>Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-100 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Account Created!</h2>
                <p className="text-sm font-medium text-slate-500">
                  Please check your email to verify your account, or wait while we redirect you...
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-7 text-center border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-brand-primary hover:underline">Sign In</a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
