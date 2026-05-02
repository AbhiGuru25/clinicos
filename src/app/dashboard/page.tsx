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
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchPatients();
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
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchPatients() {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const statCards = [
    {
      label: "Today's Visits",
      value: patients.length,
      change: '+12%',
      positive: true,
      icon: CalendarDays,
      iconColor: 'var(--brand-primary)',
      iconBg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Total Patients',
      value: '1,284',
      change: '+5%',
      positive: true,
      icon: Users,
      iconColor: 'var(--brand-primary)',
      iconBg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Revenue Today',
      value: '₹12,450',
      change: '+18%',
      positive: true,
      icon: TrendingUp,
      iconColor: 'var(--success-text)',
      iconBg: 'var(--success-bg)',
    },
    {
      label: 'Pending Tasks',
      value: '4',
      change: '-2',
      positive: true,
      icon: Clock,
      iconColor: 'var(--text-secondary)',
      iconBg: 'rgba(100, 116, 139, 0.1)',
      href: '#recent-activity',
    },
    {
      label: 'Confirmation Rate',
      value: '94%',
      change: '↑ +3%',
      positive: true,
      icon: CheckCircle2,
      iconColor: 'var(--success-text)',
      iconBg: 'var(--success-bg)',
    },
  ];

  return (
    <div className="space-y-6 page-enter">

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--brand-primary)' }}>
            {today}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Welcome, <span className="text-brand-primary">Dr. Sharma</span>
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening at your clinic today.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              <p className="text-sm font-bold" style={{ color: '#10B981' }}>Open & Active</p>
            </div>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
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
              {[
                { dot: '#EC4899', text: "🎂 Priya Patel's birthday tomorrow — send wishes?", time: 'Action Required', action: true },
                { dot: '#6C5CE7', text: 'New booking via WhatsApp for Rahul M.', time: '2 mins ago' },
                { dot: '#10B981', text: 'Payment received from Priya P.', time: '15 mins ago' },
                { dot: '#F59E0B', text: 'AI rescheduled 3 appointments.', time: '1 hr ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: item.dot }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: item.action ? '#EC4899' : 'var(--text-muted)' }}>{item.time}</p>
                    {item.action && (
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #EC4899, #BE185D)' }}>Send WhatsApp</button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>Dismiss</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
