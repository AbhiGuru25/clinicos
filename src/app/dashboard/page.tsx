'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CalendarDays,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Activity,
  ArrowUpRight,
  Sparkles,
  Bell,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" }
  })
};

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('Doctor');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchDoctorName();
    fetchStats();
    fetchMessages();

    // Safety timeout: force loading to false after 3 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Live clock
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    tick();
    const interval = setInterval(tick, 60000);

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchPatients();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'whatsapp_messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      clearTimeout(safetyTimeout);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*, patients(name)')
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }

  async function fetchStats() {
    const { data: invoices } = await supabase.from('invoices').select('amount');
    if (invoices) {
      const total = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
      setTotalRevenue(total);
    }
  }

  async function fetchDoctorName() {
    try {
      // 1. Try fetching from clinics table
      const { data: clinic } = await supabase
        .from('clinics')
        .select('doctor_name')
        .limit(1)
        .single();
      
      if (clinic?.doctor_name) {
        setDoctorName(clinic.doctor_name);
        return;
      }

      // 2. Fallback to Auth User metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setDoctorName(user.user_metadata.full_name);
      } else if (user?.email) {
        const nameFromEmail = user.email.split('@')[0];
        setDoctorName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
    } catch (err) {
      console.error('Error fetching doctor name:', err);
    }
  }

  async function fetchPatients() {
    try {
      const { data, error: dbError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dbError) throw dbError;
      if (data) setPatients(data);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to connect to database');
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const statCards = [
    {
      label: "Today's Visits",
      value: patients.length,
      change: '+0%',
      positive: true,
      icon: CalendarDays,
      iconColor: 'var(--brand-primary)',
      iconBg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Total Patients',
      value: patients.length,
      change: '+0%',
      positive: true,
      icon: Users,
      iconColor: 'var(--brand-primary)',
      iconBg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Revenue Today',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+0%',
      positive: true,
      icon: TrendingUp,
      iconColor: 'var(--success-text)',
      iconBg: 'var(--success-bg)',
    },
    {
      label: 'Pending Tasks',
      value: '0',
      change: '0',
      positive: true,
      icon: Clock,
      iconColor: 'var(--text-secondary)',
      iconBg: 'rgba(100, 116, 139, 0.1)',
      href: '#recent-activity',
    },
    {
      label: 'Confirmation Rate',
      value: '100%',
      change: '↑ 0%',
      positive: true,
      icon: CheckCircle2,
      iconColor: 'var(--success-text)',
      iconBg: 'var(--success-bg)',
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border"
          style={{ background: 'var(--error-bg)', color: 'var(--error-text)', borderColor: 'rgba(239, 44, 44, 0.2)' }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">⚠️</div>
          <div className="flex-1">
            <p>Database Connection Error</p>
            <p className="text-[10px] opacity-80 font-medium leading-tight">Verify your Supabase URL/Key in Vercel settings. Error: {error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-xs"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--brand-primary)' }}>
            {today}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Welcome, <span className="text-brand-primary">{doctorName}</span>
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening at your clinic today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live AI Pulse */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50/50">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">AI Receptionist Active</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2.5 rounded-xl border transition-all hover:scale-105 touch-target"
            style={{ background: 'white', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(108,92,231,0.08)' }}>
            <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white"
              style={{ background: '#EF4444' }}>3</span>
          </button>

          {/* Clinic Status */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl border"
            style={{ background: 'white', borderColor: 'var(--border)' }}>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Clinic Status</p>
              <p className="text-sm font-bold" style={{ color: '#10B981' }}>Live & Syncing</p>
            </div>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center pulse-purple" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <Activity size={18} style={{ color: '#10B981' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            {card.href ? (
              <a href={card.href} className="block h-full">
                <StatCard card={card} />
              </a>
            ) : (
              <StatCard card={card} />
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Appointments Card (2/3) */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="rounded-2xl border p-5 md:p-6 min-h-[360px]"
            style={{ background: 'white', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Today's Appointments
                </h2>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Live synced</p>
              </div>
              <Link href="/dashboard/appointments"
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                style={{ color: '#6C5CE7', background: 'rgba(108,92,231,0.08)' }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: '#F5F7FF' }} />
                ))}
              </div>
            ) : patients.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl"
                style={{ borderColor: 'rgba(108,92,231,0.15)', background: 'rgba(108,92,231,0.02)' }}>
                <Sparkles size={28} style={{ color: '#A29BFE' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No appointments yet today</p>
                <Link href="/dashboard/appointments"
                  className="text-xs font-bold px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(108,92,231,0.1)', color: '#6C5CE7' }}>
                  Book First Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {patients.slice(0, 5).map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl border transition-all hover:shadow-sm group"
                    style={{ borderColor: 'var(--border)', background: 'white' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,92,231,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(108,92,231,0.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'white'; }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all"
                        style={{ background: 'rgba(108,92,231,0.1)', color: '#6C5CE7' }}>
                        {(p.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name || 'Unknown'}</h4>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{p.department || 'General Consultation'}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      p.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {p.priority || 'Confirmed'}
                    </span>
                  </motion.div>
                ))}

                {patients.length <= 1 && (
                  <div className="mt-4 p-4 text-center border-2 border-dashed rounded-xl" style={{ borderColor: 'rgba(108,92,231,0.15)', background: 'rgba(108,92,231,0.02)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>No more appointments — AI is booking tomorrow's slots</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {[
                  { label: '+ Add Patient', href: '/dashboard/patients' },
                  { label: '📅 Tomorrow', href: '/dashboard/appointments' },
                  { label: '💰 Invoice', href: '/dashboard/billing' },
                  { label: '📊 Report', href: '/dashboard/billing' },
                ].map(action => (
                  <Link key={action.label} href={action.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all hover:shadow-sm"
                    style={{ background: 'white', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(108,92,231,0.3)'; el.style.color = '#6C5CE7'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column (1/3) */}
        <div className="space-y-4">
          {/* Clinic Growth */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="clinic-card p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight size={18} style={{ color: 'var(--success-text)' }} />
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>Clinic Growth</h3>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
              24 more bookings this week vs last week. Your AI is saving ~14 hrs of admin work.
            </p>
            <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all border"
              style={{ background: 'white', color: 'var(--brand-primary)', borderColor: 'var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-app)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; }}>
              View Analytics
            </button>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            id="recent-activity"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="rounded-2xl border p-5 scroll-mt-8"
            style={{ background: 'white', borderColor: 'var(--border)' }}
          >
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>No recent activity</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={msg.id} className="flex gap-4 p-3 rounded-xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                      msg.type === 'incoming' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {msg.type === 'incoming' ? <Users size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {msg.patients?.name || msg.sender_number}
                        </p>
                        <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: 'var(--brand-primary)' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        "{msg.content}"
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${msg.type === 'incoming' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          {msg.type === 'incoming' ? 'Incoming WhatsApp' : 'AI Response Sent'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ card }: { card: any }) {
  return (
    <div
      className="clinic-card relative p-4 md:p-5 cursor-default h-full"
      style={{ minHeight: '110px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
          <card.icon size={16} style={{ color: card.iconColor }} />
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
          style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
          {card.change}
        </span>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>{card.label}</p>
      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
        {card.value}
      </h2>
    </div>
  );
}
