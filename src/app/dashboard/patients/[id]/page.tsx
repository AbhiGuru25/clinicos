'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Activity,
  CreditCard,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Patient Details
      const { data: pData } = await supabase.from('patients').select('*').eq('id', id).single();
      setPatient(pData);

      // 2. Fetch Appointment History
      const { data: aData } = await supabase.from('appointments').select('*').eq('patient_id', id).order('appointment_date', { ascending: false });
      setHistory(aData || []);

      // 3. Fetch Billing History
      const { data: iData } = await supabase.from('invoices').select('*').eq('appointment_id', aData?.[0]?.id || '').order('created_at', { ascending: false });
      setInvoices(iData || []);

      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Opening medical vault...</div>;
  if (!patient) return <div className="p-20 text-center text-slate-400 font-bold">Patient not found.</div>;

  const totalSpend = invoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Navigation & Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{patient.name}</h1>
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest">Active Patient</span>
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            Patient ID: <span className="text-slate-600">{patient.id.slice(0, 8)}</span>
          </p>
        </div>
      </div>

      {/* Quick Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Visits', value: history.length, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Total Spend', value: `₹${totalSpend}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Last Visit', value: history[0]?.appointment_date || 'N/A', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Status', value: 'Healthy', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Medical History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Visit Timeline</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-sky-600">
                <Plus size={16} />
                Add Record
              </button>
            </div>

            <div className="p-8">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold italic">No visit history found.</div>
              ) : (
                <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {history.map((visit, i) => (
                    <motion.div 
                      key={visit.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-16"
                    >
                      <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border-4 border-sky-600 z-10" />
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                              {visit.appointment_date} · {visit.appointment_time}
                            </p>
                            <h4 className="text-lg font-black text-slate-900 capitalize">{visit.notes || 'Routine Consultation'}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                            {visit.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          Visit completed with Dr. Sharma. Follow-up recommended in 7 days.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                  <p className="font-bold text-slate-700">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Invoice</p>
                  <p className="font-bold text-slate-700">#INV-9284 (₹500)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-black mb-4 tracking-tight">Clinic Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl font-bold text-sm backdrop-blur-md border border-white/10 flex items-center justify-center gap-2">
                <Calendar size={18} />
                Book Next Visit
              </button>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl font-bold text-sm backdrop-blur-md border border-white/10 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Mark as VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
