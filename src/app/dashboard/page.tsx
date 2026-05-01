'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(name, phone)')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) console.error('Error fetching appointments:', error);
      else setAppointments(data || []);
      setLoading(false);
    }

    fetchAppointments();

    const channel = supabase
      .channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = [
    { label: "Today's Visits", value: appointments.length, icon: Calendar, color: "text-sky-600", bg: "bg-sky-50", trend: "+12%" },
    { label: "Total Patients", value: "1,284", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%" },
    { label: "Revenue Today", value: "₹12,450", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50", trend: "+18%" },
    { label: "Pending Tasks", value: "4", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "-2" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome, Dr. Sharma</h1>
          <p className="text-slate-500 font-medium">Here's what's happening at your clinic today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Clinic Status</p>
            <p className="text-sm font-bold text-emerald-600">Open & Accepting Patients</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-200 border-4 border-white shadow-sm" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Appointment Table */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Today's Appointments</h2>
            <button className="text-sm font-bold text-sky-600 hover:text-sky-700">View All</button>
          </div>
          
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold">Syncing with WhatsApp Engine...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400 font-bold">No appointments for today yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-lg">
                        {a.patients?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{a.patients?.name}</h4>
                        <p className="text-xs font-bold text-slate-400">{a.patients?.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{a.appointment_time}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmed</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                          <CheckCircle2 size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                          <XCircle size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Quick Insights */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-sky-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl shadow-sky-100">
            <h3 className="text-lg font-black mb-4 tracking-tight">Clinic Growth</h3>
            <p className="text-sky-100 text-sm font-medium leading-relaxed mb-6">
              You have booked 24 more appointments this week compared to last week. Your AI is saving you ~14 hours of admin work.
            </p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl font-bold text-sm backdrop-blur-md border border-white/10">
              View Analytics Report
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700 leading-snug">New booking via WhatsApp for Rahul M.</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">2 mins ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
