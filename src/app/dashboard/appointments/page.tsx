'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Filter, Plus, X, Search, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Search State
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // New Patient Form (if search fails)
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Appointment Form
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Real-time search logic
  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      const { data } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${patientSearch}%`)
        .limit(5);
      setSearchResults(data || []);
    };
    const timer = setTimeout(searchPatients, 300);
    return () => clearTimeout(timer);
  }, [patientSearch]);

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
    setBooking(true);

    let patientId = selectedPatient?.id;

    // Create new patient if needed
    if (isNewPatient) {
      const { data: newP, error: pErr } = await supabase
        .from('patients')
        .insert([{ name: newPatientName, phone: newPatientPhone }])
        .select()
        .single();
      
      if (pErr) {
        alert("Error creating patient: " + pErr.message);
        setBooking(false);
        return;
      }
      patientId = newP.id;
    }

    if (!patientId) {
      alert("Please select or create a patient.");
      setBooking(false);
      return;
    }

    const { error } = await supabase.from('appointments').insert([
      {
        patient_id: patientId,
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
      // Reset
      setSelectedPatient(null);
      setIsNewPatient(false);
      setNewPatientName('');
      setNewPatientPhone('');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    }
    setBooking(false);
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
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100"
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[500px]">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 font-bold">Loading schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-400 font-medium max-w-sm">Click "Add Appointment" to start.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-6 rounded-2xl border border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-sky-600 shadow-sm">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book Visit</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleBook} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Search Patient */}
                {!isNewPatient && !selectedPatient && (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Search Existing Patient</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" placeholder="Start typing name..." value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" />
                    </div>
                    {searchResults.length > 0 && (
                      <div className="mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">
                        {searchResults.map(p => (
                          <button key={p.id} type="button" onClick={() => setSelectedPatient(p)} className="w-full p-4 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 leading-none mb-1">{p.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{p.phone}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => setIsNewPatient(true)} className="text-xs font-bold text-sky-600 hover:underline">+ Create New Patient Profile</button>
                  </div>
                )}

                {/* Selected Patient Display */}
                {selectedPatient && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-600" size={20} />
                      <div>
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Selected Patient</p>
                        <p className="font-bold text-emerald-900">{selectedPatient.name}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedPatient(null)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs uppercase">Change</button>
                  </div>
                )}

                {/* New Patient Form */}
                {isNewPatient && (
                  <div className="p-6 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black text-sky-900 uppercase tracking-widest">New Patient Details</h4>
                      <button type="button" onClick={() => setIsNewPatient(false)} className="text-xs font-bold text-sky-600">Cancel</button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Full Name</label>
                      <input type="text" required value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} className="w-full p-3 bg-white border border-sky-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
                      <input type="text" required value={newPatientPhone} onChange={(e) => setNewPatientPhone(e.target.value)} placeholder="+91..." className="w-full p-3 bg-white border border-sky-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <input type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time</label>
                    <input type="time" required value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Visit Notes</label>
                  <textarea placeholder="Reason for visit..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none min-h-[80px]" />
                </div>

                <button type="submit" disabled={booking} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-100 disabled:opacity-50">
                  {booking ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
