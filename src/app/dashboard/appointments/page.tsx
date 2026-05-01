'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Filter, Plus, X, Search, Clock, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(name, phone)')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) console.error(error);
    else setAppointments(data || []);
    setLoading(false);
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !appointmentDate || !appointmentTime) return;

    const { error } = await supabase.from('appointments').insert([
      {
        patient_id: selectedPatient.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: 'confirmed',
        notes: notes,
      }
    ]);

    if (error) alert('Error booking appointment: ' + error.message);
    else {
      setIsModalOpen(false);
      fetchAppointments();
      // Reset form
      setSelectedPatient(null);
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Appointments</h1>
          <p className="text-slate-500 font-medium">Manage your clinic schedule and visit statuses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 scale-100 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[500px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">
            <Calendar size={18} />
            List View
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 cursor-pointer">
            <Filter size={18} />
            Filter
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 font-bold">Loading schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-400 font-medium max-w-sm">
              Your calendar is empty. Click "Add Appointment" to book your first patient manually.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-6 rounded-2xl border border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-sky-600">
                    {a.patients?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{a.patients?.name}</h4>
                    <p className="text-xs font-bold text-slate-400">{a.patients?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="font-bold text-slate-700">{a.appointment_time}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{a.appointment_date}</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase">
                    {a.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Appointment</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleBook} className="p-8 space-y-6">
                {/* Patient Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Patient</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search patient name..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                      onChange={(e) => {
                        setPatientSearch(e.target.value);
                        // Mock lookup for now - in production, we'd query Supabase here
                        if(e.target.value.length > 2) {
                           setSelectedPatient({ id: 'dummy', name: e.target.value, phone: 'Searching...' });
                        }
                      }}
                    />
                  </div>
                  {selectedPatient && (
                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                          {selectedPatient.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sky-900">{selectedPatient.name}</span>
                      </div>
                      <button type="button" onClick={() => setSelectedPatient(null)} className="text-sky-600 hover:text-sky-800">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" 
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="time" 
                        required
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Visit Notes (Optional)</label>
                  <textarea 
                    placeholder="E.g. Fever, Consultation, Follow-up"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none min-h-[100px]" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-100 mt-4"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
