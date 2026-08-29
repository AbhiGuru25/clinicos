'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Filter, 
  Plus, 
  X, 
  Search, 
  Clock, 
  Phone, 
  CheckCircle2, 
  MessageSquare,
  User,
  Activity,
  AlertCircle,
  FileText,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [clinicId, setClinicId] = useState<string | null>(null);
  
  // Billing State
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [consultationFee, setConsultationFee] = useState('800');
  const [gstRate, setGstRate] = useState('18');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  // Appointment Form
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState('Today');
  const [statusFilter, setStatusFilter] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(a => {
    // 1. Search Filter
    const pName = (a.patients?.name || a.patient_name || '').toLowerCase();
    const pPhone = (a.patients?.phone || a.phone_number || '').toLowerCase();
    const sTerm = searchTerm.toLowerCase();
    const matchesSearch = pName.includes(sTerm) || pPhone.includes(sTerm);

    // 2. Date Filter
    let dateMatch = true;
    if (dateFilter === 'Today') dateMatch = a.appointment_date === todayStr;
    if (dateFilter === 'Tomorrow') dateMatch = a.appointment_date === tomorrowStr;

    // 3. Status Filter
    let statusMatch = true;
    if (statusFilter !== 'All') statusMatch = a.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && dateMatch && statusMatch;
  });

  // Calculate Quick Doctor Stats
  const todayVisits = appointments.filter(a => a.appointment_date === todayStr);
  const confirmedCount = todayVisits.filter(a => a.status?.toLowerCase() === 'confirmed').length;
  const completedCount = todayVisits.filter(a => a.status?.toLowerCase() === 'completed').length;
  const pendingCount = todayVisits.filter(a => a.status?.toLowerCase() === 'pending').length;

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      const [hour, min] = timeStr.split(':');
      const d = new Date();
      d.setHours(parseInt(hour, 10));
      d.setMinutes(parseInt(min, 10));
      return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      if (dateStr === todayStr) return 'Today';
      if (dateStr === tomorrowStr) return 'Tomorrow';
      const d = new Date(`${dateStr}T12:00:00`); 
      return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
        if (clinic) setClinicId(clinic.id);
        fetchAppointments();
      } catch (err) {
        console.error('Init error:', err);
        setLoading(false);
      }
    };
    init();

    // Default walk-in appointment date/time
    const now = new Date();
    setAppointmentDate(todayStr);
    setAppointmentTime(`${String(now.getHours()).padStart(2, '0')}:00`);

    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

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
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(name, phone)')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    let patientId = selectedPatient?.id;
    if (isNewPatient) {
      const { data: newP, error: pErr } = await supabase.from('patients').insert([{ clinic_id: clinicId, name: newPatientName, phone: newPatientPhone }]).select().single();
      if (pErr) { alert(pErr.message); setBooking(false); return; }
      patientId = newP.id;
    }
    const { error } = await supabase.from('appointments').insert([{ clinic_id: clinicId, patient_id: patientId, appointment_date: appointmentDate, appointment_time: appointmentTime, status: 'confirmed', notes: notes }]);
    if (error) alert(error.message);
    else { 
      setIsModalOpen(false); 
      setNewPatientName('');
      setNewPatientPhone('');
      setSelectedPatient(null);
      setPatientSearch('');
      fetchAppointments(); 
    }
    setBooking(false);
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCompleteAndBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    const fee = Number(consultationFee);
    const gst = (fee * Number(gstRate)) / 100;
    const total = fee + gst;

    // 1. Update Appointment Status
    const { error: aErr } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', selectedAppointment.id);

    if (aErr) { alert(aErr.message); setBooking(false); return; }

    // 2. Generate Invoice Record
    const { error: iErr } = await supabase.from('invoices').insert([
      {
        clinic_id: clinicId,
        appointment_id: selectedAppointment.id,
        amount: fee,
        gst_amount: gst,
        total: total,
      }
    ]);

    if (iErr) alert(iErr.message);
    else {
      setIsBillingModalOpen(false);
      fetchAppointments();
      alert("✅ Visit Completed & Invoice Generated!");
    }
    setBooking(false);
  };

  const handleSendReminder = async (appointment: any) => {
    const rawPhone = appointment.patients?.phone || appointment.phone_number;
    if (!rawPhone) {
      alert("No phone number found for this patient.");
      return;
    }
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const patientName = appointment.patients?.name || 'Patient';
    const msg = `Hi ${patientName}! 🙏\n\nThis is a reminder for your appointment at *KK Neuro Vision Therapy Institute*.\n\n📅 Date: ${formatDate(appointment.appointment_date)}\n⏰ Time: ${formatTime(appointment.appointment_time)}\n📍 Location: KK Neuro Vision Therapy Institute, Ahmedabad.\n\nSee you soon!`;

    try {
      const res = await fetch('http://localhost:8081/message/sendText/ClinicBot1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'yaot6e7yab8rlcxl95uw'
        },
        body: JSON.stringify({
          number: formattedPhone,
          text: msg,
          textMessage: { text: msg }
        })
      });
      if (res.ok) {
        alert(`✅ WhatsApp reminder sent to ${patientName} (${formattedPhone})!`);
      } else {
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    } catch {
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6 page-enter">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Appointments Queue
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Doctor OPD Consultation Schedule & Patient Queue
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary flex items-center justify-center gap-2 touch-target shadow-lg shadow-blue-500/20"
        >
          <UserPlus size={18} />
          <span>+ Add Walk-In Patient</span>
        </button>
      </div>

      {/* ─── Doctor Quick Stat Metric Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Today's Visits</p>
            <p className="text-xl font-extrabold text-slate-900">{todayVisits.length}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Confirmed</p>
            <p className="text-xl font-extrabold text-emerald-600">{confirmedCount}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending</p>
            <p className="text-xl font-extrabold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Completed</p>
            <p className="text-xl font-extrabold text-purple-600">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* ─── Doctor Search & Filters Bar ─── */}
      <div className="clinic-card p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Live Patient Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Date Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            {['Today', 'Tomorrow', 'This Week', 'All'].map(tab => (
              <button 
                key={tab}
                onClick={() => setDateFilter(tab)}
                className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all touch-target ${dateFilter === tab ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar w-full md:w-auto">
            {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(st => (
              <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === st 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Doctor Patient Queue List ─── */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-bold">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 bg-slate-50/50">
            <Calendar size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              {searchTerm ? 'No patient matches your search filter.' : 'No visits scheduled for this filter.'}
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs inline-flex items-center gap-2">
              <Plus size={16} /> Book Walk-In Patient
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((a, idx) => {
              const pName = a.patients?.name || a.patient_name || 'Patient';
              const pPhone = a.patients?.phone || a.phone_number || 'N/A';
              const isCompleted = a.status?.toLowerCase() === 'completed';
              const isConfirmed = a.status?.toLowerCase() === 'confirmed';

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 md:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted ? 'bg-slate-50/60 border-slate-200 opacity-80' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {/* Left: Queue Token & Patient Info */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Token Number Badge */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-black uppercase text-blue-400 leading-none">Token</span>
                      <span className="text-sm font-extrabold text-blue-700 leading-none mt-0.5">#{idx + 1}</span>
                    </div>

                    {/* Patient Name & Contact */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900">{pName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isCompleted ? 'bg-purple-100 text-purple-700' : isConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {a.status || 'Confirmed'}
                        </span>
                      </div>
                      
                      {/* Phone & Direct Actions */}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-semibold text-slate-500">{pPhone}</span>
                        {pPhone !== 'N/A' && (
                          <div className="flex items-center gap-2">
                            <a 
                              href={`tel:${pPhone}`} 
                              className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                              title="Call Patient"
                            >
                              <Phone size={12} /> Call
                            </a>
                            <a 
                              href={`https://wa.me/${pPhone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                              title="WhatsApp Patient"
                            >
                              <MessageSquare size={12} /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Date Time & Doctor Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Time & Date Display */}
                    <div className="text-left md:text-right mr-2">
                      <p className="font-extrabold text-sm text-slate-900">{formatTime(a.appointment_time)}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{formatDate(a.appointment_date)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* WhatsApp Reminder Button */}
                      <button
                        onClick={() => handleSendReminder(a)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-1.5 touch-target"
                        title="Send Instant WhatsApp Reminder"
                      >
                        <MessageSquare size={14} />
                        <span>Reminder</span>
                      </button>

                      {/* Complete & Bill OR Status Changer */}
                      {isConfirmed ? (
                        <button
                          onClick={() => { setSelectedAppointment(a); setIsBillingModalOpen(true); }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 touch-target"
                        >
                          <CheckCircle2 size={15} />
                          <span>Complete & Bill</span>
                        </button>
                      ) : (
                        <select
                          value={a.status || 'confirmed'}
                          onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Walk-In Appointment Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg clinic-card overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Add Walk-In / New Visit</h2>
                  <p className="text-xs text-slate-500">Book patient consultation for KK Neuro Vision Therapy Institute</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleBook} className="p-6 space-y-5">
                {/* Patient Selector Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Information</label>
                    <button type="button" onClick={() => setIsNewPatient(!isNewPatient)} className="text-xs font-bold text-blue-600 hover:underline">
                      {isNewPatient ? 'Search Existing Patient Database' : '+ Register New Walk-In Patient'}
                    </button>
                  </div>

                  {isNewPatient ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input required type="text" placeholder="Patient Full Name" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold outline-none text-sm bg-slate-50" />
                      <input required type="tel" placeholder="Mobile Number" value={newPatientPhone} onChange={e => setNewPatientPhone(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold outline-none text-sm bg-slate-50" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search existing patient name..." 
                        value={selectedPatient ? selectedPatient.name : patientSearch} 
                        onChange={e => { setSelectedPatient(null); setPatientSearch(e.target.value); }} 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl font-bold outline-none text-sm bg-slate-50" 
                      />
                      {searchResults.length > 0 && !selectedPatient && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                          {searchResults.map(p => (
                            <div key={p.id} onClick={() => { setSelectedPatient(p); setSearchResults([]); }} className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-xs font-bold border-b border-slate-100 last:border-none">
                              <span className="text-slate-900">{p.name}</span>
                              <span className="text-slate-400">{p.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Visit Date</label>
                    <input required type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Time Slot</label>
                    <input required type="time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50" />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Consultation / Vision Therapy Notes</label>
                  <input type="text" placeholder="e.g. Amblyopia Evaluation, Strabismus Check" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50" />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                  <button type="submit" disabled={booking} className="w-1/2 btn-primary text-xs py-2.5">{booking ? 'Saving...' : 'Confirm Booking'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Complete & Billing Modal ─── */}
      <AnimatePresence>
        {isBillingModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBillingModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md clinic-card overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Complete & Bill Visit</h2>
                  <p className="text-xs text-slate-500">Patient: {selectedAppointment.patients?.name || 'Valued Patient'}</p>
                </div>
                <button onClick={() => setIsBillingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20} /></button>
              </div>

              <form onSubmit={handleCompleteAndBill} className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Consultation Fee (₹)</label>
                  <input type="number" required value={consultationFee} onChange={e => setConsultationFee(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black text-lg text-slate-900 bg-slate-50" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">GST Tax Rate (%)</label>
                  <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50">
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST (Standard)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Consultation:</span>
                    <span>₹{consultationFee}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>GST ({gstRate}%):</span>
                    <span>₹{((Number(consultationFee) * Number(gstRate)) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-blue-700 pt-2 border-t border-blue-100">
                    <span>Total Amount:</span>
                    <span>₹{(Number(consultationFee) + (Number(consultationFee) * Number(gstRate)) / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button type="button" onClick={() => setIsBillingModalOpen(false)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                  <button type="submit" disabled={booking} className="w-1/2 btn-primary text-xs py-3">{booking ? 'Processing...' : 'Complete & Generate Bill'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
