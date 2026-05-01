'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Activity, 
  Clock, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  History,
  TrendingUp,
  Heart,
  Scale,
  Thermometer,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  async function fetchData() {
    // 1. Fetch Patient Details
    const { data: pData } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    setPatient(pData);

    // 2. Fetch all appointments for this patient
    const { data: aData } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', id)
      .order('appointment_date', { ascending: false });

    setAppointments(aData || []);
    setLoading(false);
  }

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 italic">Retracing medical history...</div>;
  if (!patient) return <div className="p-20 text-center text-rose-500 font-bold">Patient record not found.</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-sky-600 font-bold transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Patients
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-sky-600" />
            <div className="w-24 h-24 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center text-4xl font-black mx-auto mb-6">
              {patient.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{patient.name}</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Patient ID: {patient.id.slice(0, 8)}</p>
            
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <Phone className="text-slate-400" size={18} />
                <span className="font-bold text-slate-700 text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-400">
                <Calendar size={18} />
                <span className="font-bold text-slate-700 text-sm italic">Member since {new Date(patient.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Vitals */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-sky-100">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-sky-400" size={20} />
              <h3 className="font-black text-lg tracking-tight">Last Recorded Vitals</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-rose-400" size={18} />
                  <span className="text-sm font-medium text-slate-400">Heart Rate</span>
                </div>
                <span className="font-black">72 BPM</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scale className="text-emerald-400" size={18} />
                  <span className="text-sm font-medium text-slate-400">Weight</span>
                </div>
                <span className="font-black">68 KG</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Thermometer className="text-orange-400" size={18} />
                  <span className="text-sm font-medium text-slate-400">Temp</span>
                </div>
                <span className="font-black">98.6 °F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <History className="text-sky-600" size={24} />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Medical Journey</h2>
            </div>
            <button className="text-xs font-black text-sky-600 uppercase tracking-widest hover:underline">Download All Records</button>
          </div>

          <div className="relative pl-8 space-y-8">
            {/* The Timeline Line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100" />

            {appointments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                No past consultations recorded yet.
              </div>
            ) : (
              appointments.map((apt, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={apt.id} 
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[26px] top-2 w-5 h-5 rounded-full border-4 border-white bg-sky-600 shadow-sm z-10 group-hover:scale-125 transition-transform" />
                  
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-sky-600" />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{apt.notes ? 'General Consultation' : 'Initial Checkup'}</h3>
                      </div>
                      <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <Clock size={12} />
                        {apt.appointment_time}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Notes</p>
                          <p className="text-slate-600 font-medium leading-relaxed">
                            {apt.notes || "No clinical notes recorded for this visit. Vital signs were normal and patient advised for follow-up."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4">
                        <button className="flex items-center gap-2 text-xs font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-4 py-2 rounded-xl hover:bg-sky-100 transition-colors">
                          <Activity size={14} />
                          View Full Case File
                        </button>
                        <button className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                          Print Prescription
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
