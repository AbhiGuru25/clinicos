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
  Plus,
  MessageSquare,
  Phone,
  CheckCircle2,
  ReceiptIndianRupee,
  Bot,
  UserPlus,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Vikash');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData();

    // Safety timeout: force loading to false after 2.5s
    const safetyTimeout = setTimeout(() => setLoading(false), 2500);

    // Live clock
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    tick();
    const interval = setInterval(tick, 60000);

    // Realtime changes for live combined updates
    const channel = supabase
      .channel('dashboard-realtime-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_messages' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      clearTimeout(safetyTimeout);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        if (data.doctorName) setDoctorName(data.doctorName);
        setPatients(new Array(data.totalPatients || 0).fill(0));
        setAppointments(data.allAppointments || []);
        setTotalRevenue(data.totalRevenue || 0);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages() {
    try {
      const { data } = await supabase
        .from('whatsapp_messages')
        .select('*, patients(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);

  return (
    <div className="space-y-6 page-enter max-w-7xl mx-auto">
      {/* ─── Executive Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="uppercase tracking-widest">{todayDateFormatted}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Welcome, <span className="text-blue-600">{doctorName}</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            KK Neuro Vision Therapy Institute • Daily Practice Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live AI Pulse Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <Bot size={16} className="text-emerald-600" />
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500 leading-none">WhatsApp AI</p>
              <p className="text-xs font-extrabold leading-none mt-0.5">Active & Syncing</p>
            </div>
          </div>

          <Link href="/dashboard/appointments" className="btn-primary text-xs flex items-center gap-2 shadow-md shadow-blue-500/20">
            <UserPlus size={16} />
            <span>+ Walk-In</span>
          </Link>
        </div>
      </div>

      {/* ─── Minimal Metric Cards (4 Columns) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Today's Queue */}
        <div className="clinic-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Today's Visits</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{todayAppointments.length}</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Scheduled Queue</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
            <CalendarDays size={20} />
          </div>
        </div>

        {/* Total Patients */}
        <div className="clinic-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{patients.length}</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Medical Records</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* Revenue */}
        <div className="clinic-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">GST Billed</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <ReceiptIndianRupee size={20} />
          </div>
        </div>

        {/* AI Bot Health */}
        <div className="clinic-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">AI Receptionist</p>
            <h3 className="text-2xl font-extrabold text-purple-600 mt-1">Online</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Automated Reminders</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
            <Activity size={20} />
          </div>
        </div>
      </div>

      {/* ─── Minimal Executive Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3): Today's Schedule Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="clinic-card p-6 min-h-[420px]">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Today's OPD Appointments
                </h2>
                <p className="text-xs font-semibold text-slate-400">Live patient consultation queue</p>
              </div>
              <Link 
                href="/dashboard/appointments" 
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100 transition-all flex items-center gap-1"
              >
                <span>Full Queue</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 font-bold">
                <div className="w-7 h-7 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-2" />
                Loading schedule...
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <CalendarDays size={32} className="text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">No Visits Scheduled Today</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                  Add walk-in patients or share your WhatsApp AI booking line with patients.
                </p>
                <Link href="/dashboard/appointments" className="btn-primary text-xs inline-flex items-center gap-2">
                  <Plus size={16} /> Book Walk-In Patient
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((a, idx) => {
                  const pName = a.patients?.name || a.patient_name || 'Patient';
                  const pPhone = a.patients?.phone || a.phone_number || 'N/A';
                  const isCompleted = a.status?.toLowerCase() === 'completed';

                  return (
                    <div 
                      key={a.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-blue-700 text-xs shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{pName}</h4>
                          <p className="text-xs font-semibold text-slate-500">{pPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-slate-900">{a.appointment_time || '10:00 AM'}</p>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isCompleted ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {a.status || 'Confirmed'}
                          </span>
                        </div>

                        {pPhone !== 'N/A' && (
                          <a 
                            href={`https://wa.me/${pPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all text-xs font-bold"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Quick Action Hub & WhatsApp Activity */}
        <div className="space-y-6">
          {/* Quick Action Hub */}
          <div className="clinic-card p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
              Quick Action Hub
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link 
                href="/dashboard/appointments" 
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/70 hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <UserPlus size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-900">Add Walk-In</span>
              </Link>

              <Link 
                href="/dashboard/patients" 
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/70 hover:border-indigo-200 transition-all flex flex-col items-center justify-center text-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-900">Patient File</span>
              </Link>

              <Link 
                href="/dashboard/billing" 
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/70 hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <ReceiptIndianRupee size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-900">Create Bill</span>
              </Link>

              <Link 
                href="/dashboard/settings" 
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-purple-50/70 hover:border-purple-200 transition-all flex flex-col items-center justify-center text-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <Bot size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-900">AI Bot Config</span>
              </Link>
            </div>
          </div>

          {/* WhatsApp Activity Stream */}
          <div className="clinic-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Recent WhatsApp Activity
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No recent WhatsApp messages. Incoming messages will log here live.
                </p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{msg.patients?.name || msg.sender_number}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium">"{msg.content}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
