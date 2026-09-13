'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Filter,
  Eye,
  CalendarDays,
  RotateCcw,
  CalendarClock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Appointment {
  id: string;
  patient_id?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  patient_name?: string;
  phone_number?: string;
  patients?: {
    id: string;
    name: string;
    phone: string;
  };
}

interface ScheduleDay {
  day_of_week: number;
  day_name: string;
  is_working: boolean;
  morning_start: string;
  morning_end: string;
  evening_start: string;
  evening_end: string;
  slot_duration_minutes: number;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  schedule?: ScheduleDay[];
  blockedDates?: BlockedDate[];
  onSlotClick: (dateStr: string, timeStr: string) => void;
  onUpdateStatus: (appointmentId: string, newStatus: string) => void;
  onSendReminder: (appointment: Appointment) => void;
  onCompleteAndBill: (appointment: Appointment) => void;
  onReschedule?: (appointmentId: string, newDate: string, newTime: string, notifyWhatsapp: boolean) => Promise<void>;
}

const DEFAULT_TIME_SLOTS = [
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
  '08:00 PM'
];

export default function AppointmentCalendar({
  appointments,
  schedule = [],
  blockedDates = [],
  onSlotClick,
  onUpdateStatus,
  onSendReminder,
  onCompleteAndBill,
  onReschedule
}: AppointmentCalendarProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Reschedule State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM');
  const [notifyPatientWhatsapp, setNotifyPatientWhatsapp] = useState(true);
  const [reschedulingLoading, setReschedulingLoading] = useState(false);

  // Filter inside calendar
  const [statusFilter, setStatusFilter] = useState('All');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Detect mobile on client mount to default to 'day' view on small screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setViewMode('day');
    }
  }, []);

  // Compute 7 days of the current week (Monday to Sunday)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay(); // 0 is Sunday
    const diff = (day === 0 ? -6 : 1) - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const days: { date: Date; dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        isToday: dateStr === todayStr
      });
    }
    return days;
  }, [currentDate, todayStr]);

  // Compute month days for Month View
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 = Mon
    const totalDays = lastDay.getDate();

    const days = [];
    // Prev month padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, 1 - (startingDayOfWeek - i));
      days.push({
        date: prevDate,
        dateStr: prevDate.toISOString().split('T')[0],
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: prevDate.toISOString().split('T')[0] === todayStr
      });
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const curr = new Date(year, month, i);
      const dateStr = curr.toISOString().split('T')[0];
      days.push({
        date: curr,
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr
      });
    }
    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        dateStr: nextDate.toISOString().split('T')[0],
        dayNumber: nextDate.getDate(),
        isCurrentMonth: false,
        isToday: nextDate.toISOString().split('T')[0] === todayStr
      });
    }
    return days;
  }, [currentDate, todayStr]);

  // Normalize appointment time string to standard format
  const normalizeTimeSlot = (timeStr: string) => {
    if (!timeStr) return '';
    const upper = timeStr.toUpperCase().trim();
    if (upper.includes('AM') || upper.includes('PM')) {
      const parts = upper.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
      if (parts) {
        const hour = parts[1].padStart(2, '0');
        const ampm = parts[3];
        return `${hour}:00 ${ampm}`;
      }
    }
    try {
      const [h] = timeStr.split(':');
      let hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${String(formattedHour).padStart(2, '0')}:00 ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const formatDisplayTime = (timeStr: string) => {
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

  // Group appointments by date and normalized slot
  const appointmentsByDateAndSlot = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      if (statusFilter !== 'All' && a.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        continue;
      }
      const dateKey = a.appointment_date;
      const slotKey = normalizeTimeSlot(a.appointment_time);
      const combinedKey = `${dateKey}__${slotKey}`;

      if (!map.has(combinedKey)) {
        map.set(combinedKey, []);
      }
      map.get(combinedKey)!.push(a);
    }
    return map;
  }, [appointments, statusFilter]);

  // Appointments grouped by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      if (statusFilter !== 'All' && a.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        continue;
      }
      const d = a.appointment_date;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(a);
    }
    return map;
  }, [appointments, statusFilter]);

  // Check if a date is blocked / holiday
  const isDateBlocked = (dateStr: string) => {
    const blocked = blockedDates.find(b => b.date === dateStr);
    if (blocked) return blocked.reason;
    const d = new Date(`${dateStr}T12:00:00`);
    const dayOfWeek = d.getDay();
    const sched = schedule.find(s => s.day_of_week === dayOfWeek);
    if (sched && !sched.is_working) return `${sched.day_name} Closed`;
    if (dayOfWeek === 0 && (!sched || !sched.is_working)) return 'Sunday Closed';
    return null;
  };

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
      setSelectedDayDate(d.toISOString().split('T')[0]);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
      setSelectedDayDate(d.toISOString().split('T')[0]);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayDate(now.toISOString().split('T')[0]);
  };

  const currentRangeLabel = useMemo(() => {
    if (viewMode === 'day') {
      const d = new Date(`${selectedDayDate}T12:00:00`);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const first = weekDays[0].date;
      const last = weekDays[6].date;
      const fMonth = first.toLocaleDateString('en-US', { month: 'short' });
      const lMonth = last.toLocaleDateString('en-US', { month: 'short' });
      const year = last.getFullYear();
      if (fMonth === lMonth) {
        return `${fMonth} ${first.getDate()} – ${last.getDate()}, ${year}`;
      }
      return `${fMonth} ${first.getDate()} – ${lMonth} ${last.getDate()}, ${year}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewMode, selectedDayDate, weekDays, currentDate]);

  // OPD Stats for current week/period
  const periodStats = useMemo(() => {
    const datesInView = new Set(weekDays.map(d => d.dateStr));
    const activeInPeriod = appointments.filter(a => datesInView.has(a.appointment_date));

    let morningCount = 0;
    let eveningCount = 0;
    let confirmedCount = 0;

    for (const a of activeInPeriod) {
      if (a.status?.toLowerCase() === 'confirmed') confirmedCount++;
      const timeUpper = (a.appointment_time || '').toUpperCase();
      if (
        timeUpper.includes('AM') ||
        timeUpper.startsWith('08:') ||
        timeUpper.startsWith('09:') ||
        timeUpper.startsWith('10:') ||
        timeUpper.startsWith('11:') ||
        timeUpper.startsWith('12:')
      ) {
        morningCount++;
      } else {
        eveningCount++;
      }
    }

    return {
      total: activeInPeriod.length,
      morning: morningCount,
      evening: eveningCount,
      confirmed: confirmedCount
    };
  }, [appointments, weekDays]);

  const handleOpenAppointment = (a: Appointment) => {
    setSelectedAppointment(a);
    setIsRescheduling(false);
    setRescheduleDate(a.appointment_date);
    setRescheduleTime(normalizeTimeSlot(a.appointment_time) || '10:00 AM');
    setNotifyPatientWhatsapp(true);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedAppointment || !onReschedule) return;
    setReschedulingLoading(true);
    try {
      await onReschedule(selectedAppointment.id, rescheduleDate, rescheduleTime, notifyPatientWhatsapp);
      setSelectedAppointment(null);
      setIsRescheduling(false);
    } catch (e: any) {
      alert(e.message || 'Failed to reschedule');
    } finally {
      setReschedulingLoading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ─── Calendar Toolbar ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xs">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all touch-target"
          >
            Today
          </button>

          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={handlePrev}
              className="p-2 text-slate-600 hover:bg-white transition-all touch-target"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-slate-600 hover:bg-white transition-all border-l border-slate-200 touch-target"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 truncate">
            {currentRangeLabel}
          </h2>
        </div>

        {/* View Mode & Filter */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* View Switcher: Day | Week | Month */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* ─── Week OPD Summary Metrics ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
            <CalendarDays size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">Total in View</p>
            <p className="text-xs sm:text-sm font-black text-slate-900">{periodStats.total} Visits</p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
            🌅
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">Morning OPD</p>
            <p className="text-xs sm:text-sm font-black text-amber-700">{periodStats.morning} Slots</p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
            🌆
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">Evening OPD</p>
            <p className="text-xs sm:text-sm font-black text-indigo-700">{periodStats.evening} Slots</p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            <CheckCircle2 size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">Confirmed</p>
            <p className="text-xs sm:text-sm font-black text-emerald-700">{periodStats.confirmed} Active</p>
          </div>
        </div>
      </div>

      {/* ─── MOBILE-FRIENDLY DAY VIEW (Perfect on Phones) ─── */}
      {viewMode === 'day' && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Horizontal Date Selector Strip */}
          <div className="p-2 sm:p-3 border-b border-slate-200 bg-slate-50/60 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {weekDays.map(d => {
                const isSelected = d.dateStr === selectedDayDate;
                const count = (appointmentsByDate.get(d.dateStr) || []).length;
                const blocked = isDateBlocked(d.dateStr);

                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDayDate(d.dateStr)}
                    className={`px-3 py-2 rounded-xl flex flex-col items-center justify-center min-w-[56px] transition-all touch-target ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
                        : d.isToday
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {d.dayName}
                    </span>
                    <span className="text-sm font-black mt-0.5">
                      {d.dayNumber}
                    </span>
                    {blocked ? (
                      <span className={`text-[8px] font-extrabold px-1 rounded mt-0.5 ${isSelected ? 'bg-red-500/30 text-white' : 'text-red-500'}`}>
                        Off
                      </span>
                    ) : count > 0 ? (
                      <span className={`text-[9px] font-extrabold px-1 rounded-full mt-0.5 ${isSelected ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'}`}>
                        {count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blocked Day Notice */}
          {isDateBlocked(selectedDayDate) && (
            <div className="m-3 sm:m-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs font-bold text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span>This date is marked as Closed / Leave: {isDateBlocked(selectedDayDate)}</span>
            </div>
          )}

          {/* Vertical Hourly Timeline */}
          <div className="divide-y divide-slate-100">
            {DEFAULT_TIME_SLOTS.map(slot => {
              const combinedKey = `${selectedDayDate}__${slot}`;
              const slotAppointments = appointmentsByDateAndSlot.get(combinedKey) || [];
              const isBlocked = !!isDateBlocked(selectedDayDate);

              return (
                <div key={slot} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 hover:bg-slate-50/50 transition-colors">
                  {/* Time label */}
                  <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
                    <Clock size={13} className="text-slate-400" />
                    <span>{slot}</span>
                  </div>

                  {/* Slot Contents */}
                  <div className="flex-1 w-full">
                    {slotAppointments.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {slotAppointments.map(a => {
                          const pName = a.patients?.name || a.patient_name || 'Patient';
                          const pPhone = a.patients?.phone || a.phone_number || '';
                          const isCompleted = a.status?.toLowerCase() === 'completed';
                          const isConfirmed = a.status?.toLowerCase() === 'confirmed';
                          const isPending = a.status?.toLowerCase() === 'pending';

                          return (
                            <motion.div
                              key={a.id}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => handleOpenAppointment(a)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                                isCompleted
                                  ? 'bg-purple-50 border-purple-200 text-purple-950 hover:bg-purple-100'
                                  : isConfirmed
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100'
                                  : isPending
                                  ? 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-black text-xs sm:text-sm truncate">{pName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  isCompleted ? 'bg-purple-200/80 text-purple-800' : isConfirmed ? 'bg-emerald-200/80 text-emerald-800' : 'bg-amber-200/80 text-amber-800'
                                }`}>
                                  {a.status || 'Confirmed'}
                                </span>
                              </div>
                              {pPhone && <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{pPhone}</p>}
                              {a.notes && <p className="text-[10px] font-medium text-slate-600 truncate mt-1">📋 {a.notes}</p>}
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      !isBlocked && (
                        <button
                          type="button"
                          onClick={() => onSlotClick(selectedDayDate, slot)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-dashed border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center sm:justify-start gap-1.5 touch-target"
                        >
                          <Plus size={14} />
                          <span>Book Appointment at {slot}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── WEEK VIEW (Desktop / Tablet Responsive Grid with Sticky Time) ─── */}
      {viewMode === 'week' && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[760px] md:min-w-[860px]">
              {/* Day Header Row */}
              <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/75 sticky top-0 z-10">
                <div className="p-3 text-center border-r border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-center sticky left-0 bg-slate-50 z-20">
                  <Clock size={12} className="mr-1" />
                  <span>Time</span>
                </div>

                {weekDays.map(d => {
                  const blockedReason = isDateBlocked(d.dateStr);
                  return (
                    <div
                      key={d.dateStr}
                      onClick={() => {
                        setSelectedDayDate(d.dateStr);
                        if (typeof window !== 'undefined' && window.innerWidth < 640) {
                          setViewMode('day');
                        }
                      }}
                      className={`p-2.5 sm:p-3 text-center border-r border-slate-200 last:border-r-0 transition-all cursor-pointer ${
                        d.isToday
                          ? 'bg-blue-50/90 text-blue-900 font-extrabold'
                          : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {d.dayName}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span
                          className={`text-xs sm:text-sm font-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${
                            d.isToday ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-800'
                          }`}
                        >
                          {d.dayNumber}
                        </span>
                      </div>
                      {blockedReason && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-100 text-red-700 max-w-[85px] truncate">
                          {blockedReason}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Rows */}
              <div className="divide-y divide-slate-100">
                {DEFAULT_TIME_SLOTS.map(slot => (
                  <div key={slot} className="grid grid-cols-8 min-h-[58px] sm:min-h-[64px]">
                    {/* Sticky Time Column */}
                    <div className="p-1.5 sm:p-2 text-center border-r border-slate-200 bg-slate-50/40 text-[10px] sm:text-[11px] font-extrabold text-slate-500 flex items-center justify-center sticky left-0 z-10 select-none">
                      {slot}
                    </div>

                    {/* 7 Days Columns */}
                    {weekDays.map(d => {
                      const combinedKey = `${d.dateStr}__${slot}`;
                      const slotAppointments = appointmentsByDateAndSlot.get(combinedKey) || [];
                      const isBlocked = !!isDateBlocked(d.dateStr);

                      return (
                        <div
                          key={d.dateStr}
                          className={`p-1 border-r border-slate-100 last:border-r-0 relative transition-colors ${
                            isBlocked
                              ? 'bg-slate-50/85 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(241,245,249,0.9)_6px,rgba(241,245,249,0.9)_12px)]'
                              : d.isToday
                              ? 'bg-blue-50/15 hover:bg-blue-50/40'
                              : 'hover:bg-slate-50/60'
                          }`}
                        >
                          {slotAppointments.length > 0 ? (
                            <div className="space-y-1">
                              {slotAppointments.map(a => {
                                const pName = a.patients?.name || a.patient_name || 'Patient';
                                const isCompleted = a.status?.toLowerCase() === 'completed';
                                const isConfirmed = a.status?.toLowerCase() === 'confirmed';
                                const isPending = a.status?.toLowerCase() === 'pending';

                                return (
                                  <motion.div
                                    key={a.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleOpenAppointment(a)}
                                    className={`p-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border shadow-2xs ${
                                      isCompleted
                                        ? 'bg-purple-50/95 border-purple-200 text-purple-900 hover:bg-purple-100'
                                        : isConfirmed
                                        ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950 hover:bg-emerald-100'
                                        : isPending
                                        ? 'bg-amber-50/95 border-amber-200 text-amber-950 hover:bg-amber-100'
                                        : 'bg-slate-100 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-extrabold truncate text-[11px] max-w-[85px]">{pName}</span>
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                          isCompleted
                                            ? 'bg-purple-500'
                                            : isConfirmed
                                            ? 'bg-emerald-500'
                                            : isPending
                                            ? 'bg-amber-500'
                                            : 'bg-slate-400'
                                        }`}
                                      />
                                    </div>
                                    <p className="text-[9px] font-semibold text-slate-500 truncate mt-0.5">
                                      {formatDisplayTime(a.appointment_time)}
                                    </p>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            !isBlocked && (
                              <button
                                type="button"
                                onClick={() => onSlotClick(d.dateStr, slot)}
                                className="w-full h-full min-h-[44px] rounded-lg opacity-0 hover:opacity-100 hover:bg-blue-50/70 border border-dashed border-blue-300 transition-all flex items-center justify-center text-[10px] font-bold text-blue-600"
                                title={`Book appointment for ${d.dayName} at ${slot}`}
                              >
                                <Plus size={12} />
                              </button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MONTH VIEW (Compact on Mobile, Expansive on Desktop) ─── */}
      {viewMode === 'month' && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/75 text-center text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 py-2 sm:py-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Month day grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {monthDays.map(d => {
              const dayAppointments = appointmentsByDate.get(d.dateStr) || [];
              const blockedReason = isDateBlocked(d.dateStr);

              return (
                <div
                  key={d.dateStr}
                  onClick={() => {
                    setSelectedDayDate(d.dateStr);
                    if (!blockedReason) {
                      setViewMode('day');
                    }
                  }}
                  className={`min-h-[70px] sm:min-h-[100px] p-1.5 sm:p-2.5 transition-all cursor-pointer ${
                    !d.isCurrentMonth
                      ? 'bg-slate-50/40 text-slate-300'
                      : blockedReason
                      ? 'bg-slate-50/80'
                      : d.isToday
                      ? 'bg-blue-50/25'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] sm:text-xs font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                        d.isToday
                          ? 'bg-blue-600 text-white shadow-xs'
                          : d.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {d.dayNumber}
                    </span>

                    {dayAppointments.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-blue-100 text-blue-700">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {blockedReason ? (
                    <div className="mt-1 text-[8px] sm:text-[10px] font-bold text-red-600 bg-red-50 p-0.5 sm:p-1 rounded truncate">
                      {blockedReason}
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {dayAppointments.slice(0, 2).map(a => {
                        const pName = a.patients?.name || a.patient_name || 'Patient';
                        return (
                          <div
                            key={a.id}
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenAppointment(a);
                            }}
                            className="hidden sm:block px-1.5 py-0.5 rounded text-[9px] font-bold truncate bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100"
                          >
                            {pName}
                          </div>
                        );
                      })}
                      {/* Mobile dot indicator */}
                      <div className="flex sm:hidden gap-0.5 flex-wrap mt-1">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── APPOINTMENT DETAIL POPUP MODAL (Touch Friendly) ─── */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointment(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl z-10 overflow-hidden my-6"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/25 shrink-0">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                      {selectedAppointment.patients?.name || selectedAppointment.patient_name || 'Patient Appointment'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 truncate">
                      {selectedAppointment.patients?.phone || selectedAppointment.phone_number || 'No contact phone'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 touch-target"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Date</span>
                    <span className="text-xs font-extrabold text-slate-900">{selectedAppointment.appointment_date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Time Slot</span>
                    <span className="text-xs font-extrabold text-blue-700">{formatDisplayTime(selectedAppointment.appointment_time)}</span>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Clinical Notes / Concern</span>
                    <p className="text-xs font-semibold text-slate-700">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Appointment Status</label>
                  <select
                    value={selectedAppointment.status || 'confirmed'}
                    onChange={e => {
                      onUpdateStatus(selectedAppointment.id, e.target.value);
                      setSelectedAppointment(prev => prev ? { ...prev, status: e.target.value } : null);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Reschedule Date & Time Panel */}
                <div className="pt-1">
                  {!isRescheduling ? (
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(true)}
                      className="w-full py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all touch-target"
                    >
                      <CalendarClock size={15} />
                      <span>Reschedule Date & Time</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                          <CalendarClock size={14} className="text-blue-600" />
                          <span>Reschedule Appointment</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsRescheduling(false)}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">New Date</label>
                          <input
                            type="date"
                            value={rescheduleDate}
                            onChange={e => setRescheduleDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">New Time</label>
                          <select
                            value={rescheduleTime}
                            onChange={e => setRescheduleTime(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                          >
                            {DEFAULT_TIME_SLOTS.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifyPatientWhatsapp}
                          onChange={e => setNotifyPatientWhatsapp(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Send WhatsApp notification to patient</span>
                      </label>

                      <button
                        type="button"
                        onClick={handleConfirmReschedule}
                        disabled={reschedulingLoading}
                        className="w-full btn-primary py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {reschedulingLoading ? (
                          <span>Rescheduling...</span>
                        ) : (
                          <>
                            <RotateCcw size={13} />
                            <span>Confirm & Save New Slot</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSendReminder(selectedAppointment)}
                    className="p-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-all touch-target"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${selectedAppointment.patients?.phone || selectedAppointment.phone_number}`}
                    className="p-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-all text-center touch-target"
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </a>
                </div>

                {(selectedAppointment.patient_id || selectedAppointment.patients?.id) && (
                  <Link
                    href={`/dashboard/patients/${selectedAppointment.patient_id || selectedAppointment.patients?.id}`}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-all touch-target"
                  >
                    <Eye size={14} />
                    <span>Open Patient Medical File</span>
                  </Link>
                )}

                {selectedAppointment.status?.toLowerCase() !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => {
                      onCompleteAndBill(selectedAppointment);
                      setSelectedAppointment(null);
                    }}
                    className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all touch-target"
                  >
                    <CheckCircle2 size={16} />
                    <span>Complete Visit & Generate Bill</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
