'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  HeartPulse, 
  Users, 
  Brain, 
  Stethoscope, 
  CalendarCheck, 
  Plus, 
  Wand2,
  Activity,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Calculate some dummy stats based on fetched data
  const criticalCount = patients.filter(p => p.priority === 'High' || p.priority?.toLowerCase() === 'critical').length;
  const routineCount = patients.filter(p => p.priority === 'Low' || p.priority?.toLowerCase() === 'routine').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Online
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-sky-600">Dr. Sharma</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Here's what's happening at your clinic today.
          </p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-sky-600/20 flex items-center gap-2">
          <Plus size={18} />
          New Admission
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={64} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Users className="text-sky-600" size={20} />
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Active Admissions</h3>
          </div>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">{patients.length}</h2>
            <div className="flex items-center text-emerald-600 text-sm font-bold pb-1 bg-emerald-50 px-2 rounded-md">
              <ArrowUpRight size={16} />
              <span>12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <HeartPulse size={64} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <HeartPulse className="text-rose-600" size={20} />
            </div>
            <h3 className="font-bold text-slate-600 text-sm">Critical Patients</h3>
          </div>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">{criticalCount}</h2>
            <span className="text-slate-400 text-sm font-medium pb-1">Needs Attention</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={64} className="text-white" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Wand2 className="text-sky-300" size={20} />
            </div>
            <h3 className="font-bold text-slate-300 text-sm">AI Health Forecast</h3>
          </div>
          <div className="mt-1">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-baseline gap-2">
              94.2% <span className="text-emerald-400 text-sm font-medium tracking-normal">Recovery</span>
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Predicted rate for Neurology Ward</p>
          </div>
        </div>
      </div>

      {/* Patient Table Area */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Stethoscope className="text-sky-600" size={20} />
            Real-time Patient Stream
          </h2>
          <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group">
            View full census 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Medical ID</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500 font-medium">Scanning database...</td></tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                        <Users className="text-slate-400" size={24} />
                      </div>
                      <p className="text-slate-600 font-bold">No active patients</p>
                      <p className="text-slate-400 text-sm mt-1">Waiting for admissions via WhatsApp.</p>
                    </div>
                  </td>
                </tr>
              ) : patients.map((p, i) => (
                <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{p.name || p.full_name || 'Unknown Patient'}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm font-medium">MED-{p.id.toString().slice(-4)}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm font-medium">{p.department || 'General'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase border ${
                      p.priority === 'High' || p.priority?.toLowerCase() === 'critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-100' 
                        : p.priority === 'Mid' || p.priority?.toLowerCase() === 'urgent'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {p.priority || 'ROUTINE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating AI Command Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 z-50 w-full max-w-2xl">
        <div className="bg-white border border-slate-200 rounded-full p-2 pl-4 flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl">
          <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
            <Wand2 className="text-sky-600" size={18} />
          </div>
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium text-sm"
            placeholder="Ask AI: 'Who needs immediate attention in Cardiology?'"
          />
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-md">
            Consult AI
          </button>
        </div>
      </div>
    </div>
  );
}
