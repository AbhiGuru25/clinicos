'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
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
  UserPlus,
  ExternalLink,
  LayoutList,
  CalendarDays,
  SlidersHorizontal,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import ScheduleManager from '@/components/ScheduleManager';

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM'
];

export default function AppointmentsPage() {
  const [mounted, setMounted] = useState(false);
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
  const [slotHour, setSlotHour] = useState('10');
  const [slotMinute, setSlotMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const [notes, setNotes] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState('Today');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calendar & Schedule Manager State
  const [pageViewMode, setPageViewMode] = useState<'queue' | 'calendar'>('calendar');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [doctorSchedule, setDoctorSchedule] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);

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
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
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
    setMounted(true);
    const init = async () => {
      try {
        const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
        if (clinic) setClinicId(clinic.id);
        fetchAppointments();
        fetchSchedule();
      } catch (err) {
        console.error('Init error:', err);
        setLoading(false);
      }
    };
    init();

    // Default walk-in appointment date/time
    const now = new Date();
    setAppointmentDate(todayStr);
    const hrs = now.getHours();
    const formattedHrs = hrs % 12 || 12;
    setSlotHour(String(formattedHrs).padStart(2, '0'));
    setSlotMinute('00');
    setAmpm(hrs >= 12 ? 'PM' : 'AM');

    // Realtime channel for zero-refresh live updates
    const channel = supabase
      .channel('realtime-appointments-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchAppointments())
      .subscribe();

    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => {
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        if (data.success && data.patients) {
          const filtered = data.patients.filter((p: any) => 
            (p.name || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
            (p.phone || '').includes(patientSearch)
          ).slice(0, 5);
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };
    const timer = setTimeout(searchPatients, 300);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSchedule() {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success && data.schedule) {
        setDoctorSchedule(data.schedule);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
    }
    try {
      const saved = localStorage.getItem('clinicos_blocked_dates');
      if (saved) {
        setBlockedDates(JSON.parse(saved));
      }
    } catch {}
  }

  const handleCalendarSlotClick = (dateStr: string, timeStr: string) => {
    setAppointmentDate(dateStr);
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      setSlotHour(match[1].padStart(2, '0'));
      setSlotMinute(match[2]);
      setAmpm(match[3].toUpperCase());
    }
    setIsModalOpen(true);
  };

  const getBlockedDateReason = (dateStr: string) => {
    if (!dateStr) return null;
    const blocked = blockedDates.find(b => b.date === dateStr);
    if (blocked) return blocked.reason;
    try {
      const d = new Date(`${dateStr}T12:00:00`);
      const dayOfWeek = d.getDay();
      const sched = doctorSchedule.find(s => s.day_of_week === dayOfWeek);
      if (sched && !sched.is_working) return `${sched.day_name} Clinic Closed`;
      if (dayOfWeek === 0 && (!sched || !sched.is_working)) return 'Sunday Closed';
    } catch {}
    return null;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    const finalAppointmentTime = `${String(slotHour).padStart(2, '0')}:${slotMinute} ${ampm}`;

    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinicId,
          patient_id: selectedPatient?.id,
          is_new_patient: isNewPatient,
          patient_name: newPatientName,
          patient_phone: newPatientPhone,
          appointment_date: appointmentDate,
          appointment_time: finalAppointmentTime,
          notes: notes
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to book appointment.');
      } else {
        setIsModalOpen(false);
        setNewPatientName('');
        setNewPatientPhone('');
        setSelectedPatient(null);
        setPatientSearch('');
        setNotes('');
        setSlotHour('10');
        setSlotMinute('00');
        setAmpm('AM');
        fetchAppointments();
      }
    } catch (err: any) {
      alert(`Booking Error: ${err.message}`);
    } finally {
      setBooking(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointmentId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleReschedule = async (
    appointmentId: string,
    newDate: string,
    newTime: string,
    notifyWhatsapp: boolean = true
  ) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appointmentId,
          appointment_date: newDate,
          appointment_time: newTime,
          status: 'confirmed'
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to reschedule appointment');
        return;
      }

      fetchAppointments();

      if (notifyWhatsapp) {
        const appointment = data.appointment || appointments.find(a => a.id === appointmentId);
        const rawPhone = appointment?.patients?.phone || appointment?.phone_number;
        const patientName = (appointment?.patients?.name || appointment?.patient_name || 'Patient').trim();

        if (rawPhone) {
          const msg = `Hi *${patientName}*!\n\nYour appointment at *KK Neuro Vision Therapy Institute* has been rescheduled.\n\n• *New Date:* ${formatDate(newDate)}\n• *New Time:* ${formatTime(newTime)}\n• *Location:* KK Neuro Vision Therapy Institute, Ahmedabad.\n\nSee you soon!`;
          await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: rawPhone,
              message: msg,
              patient_id: appointment?.patient_id || appointment?.patients?.id,
              clinic_id: clinicId
            })
          }).catch(console.error);
        }
      }

      alert('✅ Appointment Rescheduled Successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule appointment');
    }
  };

  const handleCompleteAndBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    const fee = Number(consultationFee);
    const gst = (fee * Number(gstRate)) / 100;
    const total = fee + gst;

    try {
      // 1. Update Appointment Status to completed via server API (bypasses RLS)
      await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedAppointment.id, status: 'completed' })
      });

      // 2. Generate Invoice Record via server API (bypasses RLS)
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinicId,
          appointment_id: selectedAppointment.id,
          amount: fee,
          gst_amount: gst,
          total_amount: total
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(`Billing Error: ${data.error}`);
      } else {
        setIsBillingModalOpen(false);
        fetchAppointments();
        alert("✅ Visit Completed & Invoice Generated!");
      }
    } catch (err: any) {
      alert(`Billing Error: ${err.message}`);
    } finally {
      setBooking(false);
    }
  };

  const handleSendReminder = async (appointment: any) => {
    const rawPhone = appointment.patients?.phone || appointment.phone_number;
    if (!rawPhone) {
      alert("No phone number found for this patient.");
      return;
    }
    const patientName = (appointment.patients?.name || appointment.patient_name || 'Valued Patient').trim();
    const formattedDate = formatDate(appointment.appointment_date);
    const formattedTime = formatTime(appointment.appointment_time);

    const msg = `Hi *${patientName}*!\n\nThis is a reminder for your appointment at *KK Neuro Vision Therapy Institute*.\n\n• *Date:* ${formattedDate}\n• *Time:* ${formattedTime}\n• *Location:* KK Neuro Vision Therapy Institute, Ahmedabad.\n\nSee you soon!`;

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: rawPhone,
          message: msg,
          patient_id: appointment.patient_id || appointment.patients?.id,
          clinic_id: clinicId
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.deliveredViaApi) {
          alert(`✅ WhatsApp Reminder Sent Live via ClinicBot1 to ${patientName}!`);
        } else {
          // Open WhatsApp Web with pre-filled text
          window.open(data.waWebUrl, '_blank');
        }
      } else {
        alert(data.error || 'Failed to send WhatsApp message.');
      }
    } catch (err: any) {
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };


  return (
    <div className="space-y-6 page-enter">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
            Appointments & Calendar
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Visual OPD Schedule, Doctor Calendar & Patient Queue
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* View Mode Switcher: Calendar vs Queue List */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setPageViewMode('calendar')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                pageViewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays size={14} />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setPageViewMode('queue')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                pageViewMode === 'queue'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList size={14} />
              <span>Queue</span>
            </button>
          </div>

          {/* Doctor Schedule Button */}
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-extrabold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs touch-target"
            title="Configure OPD Consultation Hours & Leave Dates"
          >
            <Clock size={14} className="text-blue-600" />
            <span className="hidden xs:inline">Doctor</span> Schedule
          </button>

          {/* Add Walk-In Patient */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-extrabold shadow-md shadow-blue-500/20 touch-target"
          >
            <UserPlus size={15} />
            <span>+ Walk-In</span>
          </button>
        </div>
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

      {/* ─── Main Content: Calendar View OR Queue List View ─── */}
      {pageViewMode === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          schedule={doctorSchedule}
          blockedDates={blockedDates}
          onSlotClick={handleCalendarSlotClick}
          onUpdateStatus={handleUpdateStatus}
          onSendReminder={handleSendReminder}
          onCompleteAndBill={(a) => {
            setSelectedAppointment(a);
            setIsBillingModalOpen(true);
          }}
          onReschedule={handleReschedule}
        />
      ) : (
        /* ─── Doctor Search & Filters Bar & Queue List ─── */
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
                        {a.patient_id || a.patients?.id ? (
                          <Link 
                            href={`/dashboard/patients/${a.patient_id || a.patients?.id}`}
                            className="font-extrabold text-base text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 group"
                            title="View Patient Medical File"
                          >
                            <span>{pName}</span>
                            <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                          </Link>
                        ) : (
                          <h3 className="font-extrabold text-base text-slate-900">{pName}</h3>
                        )}
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
      )}

      {/* ─── Walk-In Appointment Modal ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Full Screen Viewport Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)} 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 15 }} 
                className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/30 overflow-hidden z-10"
              >
                {/* Card Header */}
                <div className="p-6 md:p-7 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-white flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                      <UserPlus size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Add Walk-In / New Visit</h2>
                      <p className="text-xs font-semibold text-slate-500">KK Neuro Vision Therapy Institute</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all border border-transparent hover:border-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleBook} className="p-6 md:p-7 space-y-5">
                  {/* Patient Information Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Information</label>
                      <button type="button" onClick={() => setIsNewPatient(!isNewPatient)} className="text-xs font-bold text-blue-600 hover:underline">
                        {isNewPatient ? 'Search Existing Patient Database' : '+ Register New Walk-In Patient'}
                      </button>
                    </div>

                    {isNewPatient ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Patient Full Name</label>
                          <input required type="text" placeholder="e.g. Rahul Sharma" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Mobile Phone Number</label>
                          <input required type="tel" placeholder="e.g. 9825012345" value={newPatientPhone} onChange={e => setNewPatientPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search existing patient name or phone..." 
                          value={selectedPatient ? selectedPatient.name : patientSearch} 
                          onChange={e => { setSelectedPatient(null); setPatientSearch(e.target.value); }} 
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" 
                        />
                        {searchResults.length > 0 && !selectedPatient && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                            {searchResults.map(p => (
                              <div key={p.id} onClick={() => { setSelectedPatient(p); setSearchResults([]); }} className="p-3.5 hover:bg-blue-50/80 cursor-pointer flex justify-between items-center text-xs font-bold border-b border-slate-100 last:border-none transition-all">
                                <span className="text-slate-900">{p.name}</span>
                                <span className="text-slate-500">{p.phone}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Visit Date & Time (Hour : Min : AM/PM) */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Visit Date</label>
                      <input required type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                      {getBlockedDateReason(appointmentDate) && (
                        <div className="mt-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-amber-600 shrink-0" />
                          <span>Clinic routine notice: {getBlockedDateReason(appointmentDate)}.</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Time Slot (Hour : Minute : AM/PM)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Hour 1 to 12 */}
                        <div>
                          <select 
                            required 
                            value={slotHour} 
                            onChange={e => setSlotHour(e.target.value)} 
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-extrabold text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 cursor-pointer"
                          >
                            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                              <option key={h} value={h}>{h} Hr</option>
                            ))}
                          </select>
                        </div>

                        {/* Minute 00 to 45 */}
                        <div>
                          <select 
                            required 
                            value={slotMinute} 
                            onChange={e => setSlotMinute(e.target.value)} 
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-extrabold text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 cursor-pointer"
                          >
                            {['00', '15', '30', '45'].map(m => (
                              <option key={m} value={m}>{m} Min</option>
                            ))}
                          </select>
                        </div>

                        {/* AM / PM Box */}
                        <div>
                          <select 
                            required 
                            value={ampm} 
                            onChange={e => setAmpm(e.target.value)} 
                            className="w-full px-3 py-2.5 border border-blue-200 rounded-xl font-black text-sm bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-blue-700 cursor-pointer shadow-sm"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Consultation / Vision Therapy Notes</label>
                    <input type="text" placeholder="e.g. Amblyopia Evaluation, Strabismus Check" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex items-center gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" disabled={booking} className="w-1/2 btn-primary text-xs py-3 font-extrabold shadow-lg shadow-blue-500/25">{booking ? 'Saving Visit...' : 'Confirm Booking'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── Complete & Billing Modal ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isBillingModalOpen && selectedAppointment && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Full Screen Viewport Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsBillingModalOpen(false)} 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 15 }} 
                className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/30 overflow-hidden z-10"
              >
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/30">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Complete & Bill Visit</h2>
                      <p className="text-xs font-semibold text-slate-500">Patient: {selectedAppointment.patients?.name || selectedAppointment.patient_name || 'Valued Patient'}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBillingModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all"><X size={20} /></button>
                </div>

                <form onSubmit={handleCompleteAndBill} className="p-6 space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Consultation Fee (₹)</label>
                    <input type="number" required value={consultationFee} onChange={e => setConsultationFee(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black text-lg text-slate-900 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">GST Tax Rate (%)</label>
                    <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900">
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST (Standard)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Consultation Fee:</span>
                      <span>₹{consultationFee}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>GST ({gstRate}%):</span>
                      <span>₹{((Number(consultationFee) * Number(gstRate)) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-emerald-700 pt-2 border-t border-emerald-200/60">
                      <span>Total Billable Amount:</span>
                      <span>₹{(Number(consultationFee) + (Number(consultationFee) * Number(gstRate)) / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button type="button" onClick={() => setIsBillingModalOpen(false)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" disabled={booking} className="w-1/2 py-3 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all">{booking ? 'Processing...' : 'Complete & Generate Bill'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── Doctor Schedule Manager Modal ─── */}
      <ScheduleManager
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onScheduleUpdated={() => {
          fetchSchedule();
          fetchAppointments();
        }}
        clinicId={clinicId}
      />
    </div>
  );
}
