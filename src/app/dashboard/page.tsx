'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  HeartPulse, 
  Users, 
  Brain, 
  Stethoscope, 
  CalendarCheck, 
  ClipboardList, 
  Settings, 
  Plus, 
  Wand2,
  AlertCircle,
  Activity
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-hidden flex">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2D9E7A] rounded-full blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#4A90D9] rounded-full blur-[100px] opacity-10 animate-pulse delay-700"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-[280px] bg-slate-900/50 backdrop-blur-xl border-r border-teal-500/10 p-10 flex flex-col gap-10 z-10">
        <div className="flex items-center gap-3 text-2xl font-bold text-[#2D9E7A] font-serif">
          <Activity size={24} />
          <span>Clinic<span className="text-white/50">OS</span></span>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { icon: Users, label: 'Patient Census', active: true },
            { icon: Brain, label: 'AI Diagnostics' },
            { icon: CalendarCheck, label: 'Scheduler' },
            { icon: ClipboardList, label: 'Archives' },
          ].map((item, i) => (
            <div 
              key={i}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl cursor-pointer transition-all ${
                item.active ? 'bg-[#2D9E7A] text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
          <div className="mt-auto flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800 cursor-pointer">
            <Settings size={18} />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto z-10 relative">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold">Welcome, <span className="text-[#2D9E7A]">Dr. Sharma</span></h1>
            <p className="text-slate-400 mt-1">Medical OS v2.0 is running with 99.9% AI accuracy.</p>
          </div>
          <button className="bg-[#2D9E7A] hover:scale-105 active:scale-95 transition-all text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-teal-500/30 flex items-center gap-2">
            <Plus size={18} />
            New Admission
          </button>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* KPI Card */}
          <div className="col-span-8 bg-white/5 border border-teal-500/10 backdrop-blur-md rounded-[32px] p-8 flex items-center gap-16">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users size={12} /> Active Admissions
              </p>
              <h2 className="text-6xl font-bold tracking-tighter">{patients.length}</h2>
              <p className="text-[#2D9E7A] text-[11px] font-bold mt-2 uppercase">Normal Load Operation</p>
            </div>
            <div className="w-px h-20 bg-teal-500/10"></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HeartPulse size={12} /> Clinic Status
              </p>
              <h2 className="text-6xl font-bold tracking-tighter text-[#10B981]">STABLE</h2>
              <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest">Real-time Vitals Sync</p>
            </div>
          </div>

          {/* AI Predictor */}
          <div className="col-span-4 bg-white/5 border border-blue-500/20 backdrop-blur-md rounded-[32px] p-8">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Brain size={12} /> AI Health Forecast
            </p>
            <p className="text-xs text-slate-400 mb-4">Predicted recovery rate for Neurology Ward</p>
            <div className="bg-black/20 rounded-2xl p-6 border border-blue-500/10">
              <h3 className="text-4xl font-bold text-[#4A90D9]">94.2%</h3>
              <p className="text-[#10B981] text-[10px] font-bold flex items-center gap-1 mt-1">
                <Wand2 size={10} /> HIGH CONFIDENCE
              </p>
            </div>
          </div>

          {/* Patient Table */}
          <div className="col-span-12 bg-white/5 border border-teal-500/10 backdrop-blur-md rounded-[32px] p-8 mt-4">
            <div className="flex justify-between items-center mb-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Stethoscope size={12} /> Real-time Patient Stream
              </p>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-slate-500 uppercase tracking-widest border-b border-teal-500/5">
                  <th className="pb-4 px-4">Patient Name</th>
                  <th className="pb-4 px-4">ID</th>
                  <th className="pb-4 px-4">Department</th>
                  <th className="pb-4 px-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-500">Scanning neural database...</td></tr>
                ) : patients.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-500">No active patients in census.</td></tr>
                ) : patients.map((p, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-all">
                    <td className="py-5 px-4 font-bold">{p.name || p.full_name || 'Unknown Patient'}</td>
                    <td className="py-5 px-4 text-slate-400 text-sm">MED-{p.id.toString().slice(-4)}</td>
                    <td className="py-5 px-4 text-slate-400 text-sm">{p.department || 'General'}</td>
                    <td className="py-5 px-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                        p.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-teal-500/10 text-teal-400'
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

        {/* Command Bar */}
        <div className="fixed bottom-10 left-[320px] right-10 max-w-4xl mx-auto z-50">
          <div className="bg-slate-800/80 backdrop-blur-2xl border border-teal-500/20 rounded-full p-2 pl-4 flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 bg-[#2D9E7A] rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/40">
              <Wand2 size={20} />
            </div>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400 font-medium"
              placeholder="Ask AI: 'Who needs immediate attention in Cardiology?'"
            />
            <button className="bg-[#2D9E7A] text-white px-6 py-3 rounded-full font-bold text-sm">
              Consult AI
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
