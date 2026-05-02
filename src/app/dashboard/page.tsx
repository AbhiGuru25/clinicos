'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CalendarDays, 
  Users, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
    
    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
        console.log('Change received!', payload);
        fetchPatients();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPatients(data);
    setLoading(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Welcome, <span className="text-sky-600">Dr. Sharma</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Here's what's happening at your clinic today.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Clinic Status</p>
            <p className="text-emerald-600 font-bold text-sm">Open & Accepting Patients</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Activity className="text-emerald-500" size={20} />
          </div>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <CalendarDays className="text-sky-600" size={20} />
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ↗ +12%
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Today's Visits</p>
            <h2 className="text-2xl font-display font-bold text-slate-900">{patients.length}</h2>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="text-emerald-600" size={20} />
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ↗ +5%
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Total Patients</p>
            <h2 className="text-2xl font-display font-bold text-slate-900">1,284</h2>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ↗ +18%
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Revenue Today</p>
            <h2 className="text-2xl font-display font-bold text-slate-900">₹12,450</h2>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ↗ -2
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Pending Tasks</p>
            <h2 className="text-2xl font-display font-bold text-slate-900">4</h2>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900">Today's Appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm font-bold text-sky-600 hover:text-sky-700">
                View All
              </Link>
            </div>

            {loading ? (
               <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                 <p className="text-slate-400 font-medium text-sm">Syncing with database...</p>
               </div>
            ) : patients.length === 0 ? (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-slate-400 font-medium text-sm">No appointments for today yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-sky-100 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                        {(p.name || p.full_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{p.name || p.full_name || 'Unknown Patient'}</h4>
                        <p className="text-xs font-medium text-slate-500">{p.department || 'General Consultation'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                        p.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {p.priority || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Clinic Growth Card */}
          <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg shadow-sky-600/20">
            <h3 className="text-lg font-display font-bold mb-4">Clinic Growth</h3>
            <p className="text-sky-100 text-sm leading-relaxed mb-6">
              You have booked 24 more appointments this week compared to last week. Your AI is saving you ~14 hours of admin work.
            </p>
            <button className="bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-bold py-2.5 px-4 rounded-xl w-full">
              View Analytics Report
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New booking via WhatsApp for Rahul M.</p>
                  <p className="text-xs text-slate-500 mt-1">2 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Payment received from Priya P.</p>
                  <p className="text-xs text-slate-500 mt-1">15 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">AI rescheduled 3 appointments.</p>
                  <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
