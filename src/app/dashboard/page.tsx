'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ChevronRight,
  Phone,
  CheckCircle2,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Vikash');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData();
    const safetyTimeout = setTimeout(() => setLoading(false), 2500);

    const channel = supabase
      .channel('dashboard-realtime-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_messages' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      clearTimeout(safetyTimeout);
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

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);
  const activeQueue = todayAppointments.filter(a => !['completed', 'cancelled'].includes((a.status || '').toLowerCase()));
  const completedToday = todayAppointments.filter(a => (a.status || '').toLowerCase() === 'completed');
  const nowServing = activeQueue[0];
  const upNext = activeQueue.slice(1, 5);

  const nowServingName = nowServing ? (nowServing.patients?.name || nowServing.patient_name || '—') : null;
  const nowServingPhone = nowServing ? (nowServing.patients?.phone || nowServing.phone_number || '') : '';
  const isPending = (s?: string) => (s || '').toLowerCase() === 'pending';

  return (
    <div className="space-y-5 page-enter max-w-[1200px] mx-auto">
      {/* ─── Masthead: one line of context, one action ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0E7C6B] font-semibold">
            {todayDateFormatted}
          </p>
          <h1 className="font-display text-[30px] md:text-[36px] leading-[1.05] tracking-tight text-[#1A2B3C] mt-1">
            Today&apos;s OPD, {doctorName.split(' ').slice(-1)}.
          </h1>
        </div>
        <Link href="/dashboard/appointments" className="btn-primary text-[13px] flex items-center gap-2 self-start sm:self-auto">
          <UserPlus size={16} />
          Register walk-in
        </Link>
      </div>

      {/* ─── Three numbers that matter ─── */}
      <div className="clinic-card overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-dashed divide-[#E3DDCF]">
          {[
            { label: 'Waiting', value: String(Math.max(activeQueue.length - (nowServing ? 1 : 0), 0)) },
            { label: 'Seen', value: String(completedToday.length) },
            { label: 'Billed', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#93A0AE]">{s.label}</p>
              <p className="token-num text-[24px] leading-none mt-1.5 text-[#1A2B3C]">
                {loading ? '··' : s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ─── Queue ─── */}
        <div className="lg:col-span-2">
          <div className="clinic-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B7B]">
                Now serving
              </h2>
              <Link href="/dashboard/appointments" className="text-[12px] font-bold text-[#0E7C6B] hover:underline flex items-center gap-1">
                Full queue <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-10 text-center text-[13px] font-semibold text-[#93A0AE]">
                <div className="w-7 h-7 rounded-full border-2 border-[#0E7C6B] border-t-transparent animate-spin mx-auto mb-2" />
                Loading…
              </div>
            ) : !nowServing ? (
              <div className="p-10 text-center rounded-xl bg-[#FAF7F0] border border-dashed border-[#E3DDCF]">
                <p className="font-display text-[22px] text-[#1A2B3C]">Counter is clear.</p>
                <Link href="/dashboard/appointments" className="btn-primary text-[13px] inline-flex items-center gap-2 mt-4">
                  <UserPlus size={15} /> Register walk-in
                </Link>
              </div>
            ) : (
              <div className="token-ticket p-5 flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-[76px] h-[76px] rounded-xl bg-[#0B3530] text-[#F4F1EA] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-60">Token</span>
                    <span className="token-num text-[30px] leading-none mt-0.5">
                      {String(todayAppointments.indexOf(nowServing) + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-[22px] leading-tight text-[#1A2B3C]">{nowServingName}</p>
                    <p className="text-[13px] font-mono text-[#5B6B7B] mt-0.5">{nowServing.appointment_time || ''}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 md:ml-auto">
                  {nowServingPhone && (
                    <a href={`tel:${nowServingPhone}`} aria-label="Call patient" className="btn-ghost text-[13px] flex items-center justify-center gap-2">
                      <Phone size={15} />
                    </a>
                  )}
                  <Link href="/dashboard/appointments" className="btn-primary text-[13px] flex items-center justify-center gap-2">
                    <CheckCircle2 size={15} /> Complete & bill
                  </Link>
                </div>
              </div>
            )}

            {upNext.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#93A0AE] mb-1 px-1">
                  Up next
                </p>
                <div>
                  {upNext.map((a) => {
                    const pName = a.patients?.name || a.patient_name || 'Patient';
                    const pPhone = a.patients?.phone || a.phone_number || '';
                    const tokenNo = String(todayAppointments.indexOf(a) + 1).padStart(2, '0');
                    return (
                      <div key={a.id} className="ledger-row py-3 flex items-center gap-3.5">
                        <span className="token-num text-[15px] text-[#5B6B7B] w-9">#{tokenNo}</span>
                        <p className="text-[14px] font-bold text-[#1A2B3C] truncate flex-1">{pName}</p>
                        {isPending(a.status) && (
                          <span className="pill pill-pending"><span className="dot" />Pending</span>
                        )}
                        <span className="text-[12px] font-mono text-[#93A0AE]">{a.appointment_time || ''}</span>
                        {pPhone && (
                          <a
                            href={`https://wa.me/${pPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank" rel="noreferrer"
                            aria-label={`WhatsApp ${pName}`}
                            className="p-2 rounded-lg border border-[#E3DDCF] bg-white text-[#1FA855] hover:border-[#1FA855] transition-all"
                          >
                            <MessageSquare size={15} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── WhatsApp bookings ─── */}
        <div>
          <div className="clinic-card overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B7B]">
                WhatsApp bookings
              </h3>
            </div>
            <div className="wa-thread mx-4 mb-4 p-3 space-y-2.5 max-h-[380px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-[12.5px] font-medium text-[#5B6B7B] text-center py-6">
                  New bookings appear here.
                </p>
              ) : (
                messages.slice(0, 4).map((msg, i) => (
                  <div key={msg.id || i} className={i % 2 === 0 ? 'wa-in p-2.5 max-w-[92%]' : 'wa-out p-2.5 max-w-[92%] ml-auto'}>
                    <p className="text-[11px] font-bold text-[#0E7C6B]">{msg.patients?.name || msg.sender_number || 'Patient'}</p>
                    <p className="text-[12.5px] font-medium text-[#1A2B3C] leading-snug mt-0.5 line-clamp-3">&ldquo;{msg.content}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <p className="text-[11px] font-mono text-[#93A0AE] mt-3 px-1">
            {patients.length} files on record • details live in Patients
          </p>
        </div>
      </div>
    </div>
  );
}
