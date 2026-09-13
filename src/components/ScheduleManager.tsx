'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Calendar, Check, AlertCircle, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleUpdated: () => void;
  clinicId?: string | null;
}

const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

export default function ScheduleManager({
  isOpen,
  onClose,
  onScheduleUpdated,
  clinicId
}: ScheduleManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'routine' | 'holidays'>('routine');

  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [slotDuration, setSlotDuration] = useState<number>(30);

  // Blocked Dates / Holidays
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayReason, setNewHolidayReason] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSchedule();
      loadHolidays();
    }
  }, [isOpen]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.success && data.schedule) {
        setSchedule(data.schedule);
        if (data.schedule[0]?.slot_duration_minutes) {
          setSlotDuration(data.schedule[0].slot_duration_minutes);
        }
      }
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHolidays = () => {
    try {
      const saved = localStorage.getItem('clinicos_blocked_dates');
      if (saved) {
        setBlockedDates(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveHolidays = (dates: BlockedDate[]) => {
    setBlockedDates(dates);
    try {
      localStorage.setItem('clinicos_blocked_dates', JSON.stringify(dates));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate) return;
    const item: BlockedDate = {
      id: Date.now().toString(),
      date: newHolidayDate,
      reason: newHolidayReason.trim() || 'Clinic Holiday / Doctor Leave'
    };
    const updated = [...blockedDates.filter(b => b.date !== newHolidayDate), item].sort((a, b) => a.date.localeCompare(b.date));
    saveHolidays(updated);
    setNewHolidayDate('');
    setNewHolidayReason('');
  };

  const handleRemoveHoliday = (id: string) => {
    const updated = blockedDates.filter(b => b.id !== id);
    saveHolidays(updated);
  };

  const handleToggleDay = (day_of_week: number) => {
    setSchedule(prev => prev.map(d => d.day_of_week === day_of_week ? { ...d, is_working: !d.is_working } : d));
  };

  const handleTimeChange = (day_of_week: number, field: 'morning_start' | 'morning_end' | 'evening_start' | 'evening_end', val: string) => {
    setSchedule(prev => prev.map(d => d.day_of_week === day_of_week ? { ...d, [field]: val } : d));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = schedule.map(d => ({
        ...d,
        slot_duration_minutes: slotDuration
      }));

      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule: payload,
          clinic_id: clinicId
        })
      });

      const data = await res.json();
      if (data.success) {
        onScheduleUpdated();
        onClose();
      } else {
        alert(data.error || 'Failed to update schedule');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving schedule');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/30 overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/25">
                <Clock size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Doctor & Clinic Schedule</h2>
                <p className="text-xs font-semibold text-slate-500">Configure OPD Consultation Hours & Leave Dates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all border border-transparent hover:border-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('routine')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'routine'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Weekly OPD Routine (Mon – Sun)
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'holidays'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>Holidays & Doctor Leave</span>
              {blockedDates.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {blockedDates.length}
                </span>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto space-y-6">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-bold">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
                Loading schedule...
              </div>
            ) : activeTab === 'routine' ? (
              <div className="space-y-6">
                {/* Slot Duration Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Appointment Slot Duration</h4>
                    <p className="text-xs text-slate-500">How long each patient consultation is scheduled for</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {[15, 30, 45, 60].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setSlotDuration(mins)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          slotDuration === mins
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {mins === 60 ? '1 hr' : `${mins}m`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day-by-day table */}
                <div className="space-y-2.5">
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <span className="col-span-3">Day of Week</span>
                    <span className="col-span-4">Morning OPD Shift</span>
                    <span className="col-span-4">Evening OPD Shift</span>
                    <span className="col-span-1 text-right">Status</span>
                  </div>

                  {schedule.map(day => (
                    <div
                      key={day.day_of_week}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        day.is_working
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200/60 opacity-65'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Day & Toggle */}
                        <div className="sm:col-span-3 flex items-center justify-between sm:justify-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleDay(day.day_of_week)}
                            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                              day.is_working ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <motion.div
                              layout
                              className={`w-4 h-4 rounded-full bg-white shadow-md ${
                                day.is_working ? 'ml-auto' : 'mr-auto'
                              }`}
                            />
                          </button>
                          <span className={`text-sm font-extrabold ${day.is_working ? 'text-slate-900' : 'text-slate-400'}`}>
                            {day.day_name}
                          </span>
                        </div>

                        {day.is_working ? (
                          <>
                            {/* Morning Shift */}
                            <div className="sm:col-span-4 flex items-center gap-1.5 w-full">
                              <span className="text-[10px] font-bold text-slate-400 sm:hidden w-14 shrink-0">Morning:</span>
                              <select
                                value={day.morning_start}
                                onChange={e => handleTimeChange(day.day_of_week, 'morning_start', e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-800"
                              >
                                {TIME_OPTIONS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <span className="text-xs text-slate-400 font-bold shrink-0">to</span>
                              <select
                                value={day.morning_end}
                                onChange={e => handleTimeChange(day.day_of_week, 'morning_end', e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-800"
                              >
                                {TIME_OPTIONS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>

                            {/* Evening Shift */}
                            <div className="sm:col-span-4 flex items-center gap-1.5 w-full">
                              <span className="text-[10px] font-bold text-slate-400 sm:hidden w-14 shrink-0">Evening:</span>
                              <select
                                value={day.evening_start}
                                onChange={e => handleTimeChange(day.day_of_week, 'evening_start', e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-800"
                              >
                                {TIME_OPTIONS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <span className="text-xs text-slate-400 font-bold shrink-0">to</span>
                              <select
                                value={day.evening_end}
                                onChange={e => handleTimeChange(day.day_of_week, 'evening_end', e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-800"
                              >
                                {TIME_OPTIONS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>

                            {/* Status Tag */}
                            <div className="sm:col-span-1 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                                Open
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="sm:col-span-9 flex items-center justify-between sm:justify-end text-right">
                            <span className="text-xs font-bold text-slate-400 italic">Clinic Closed / Off</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-600 sm:ml-4">
                              Closed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Holidays & Leave Tab */
              <div className="space-y-6">
                <form onSubmit={handleAddHoliday} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    <span>Block a Date (Holiday / Doctor Leave)</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Patients will not be scheduled on blocked dates. The calendar will clearly mark this day as Closed.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Select Date</label>
                      <input
                        required
                        type="date"
                        value={newHolidayDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setNewHolidayDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Reason / Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Diwali Holiday, Medical Conference"
                        value={newHolidayReason}
                        onChange={e => setNewHolidayReason(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-end">
                      <button
                        type="submit"
                        className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </form>

                {/* List of Blocked Dates */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Scheduled Leaves & Holidays ({blockedDates.length})</h5>
                  {blockedDates.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed rounded-2xl border-slate-200 text-slate-400 text-xs font-semibold">
                      No holidays or leave dates blocked. The clinic will operate according to the weekly routine.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blockedDates.map(b => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">{b.date}</p>
                              <p className="text-[11px] font-medium text-slate-500">{b.reason}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveHoliday(b.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Remove Blocked Date"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Changes sync live into WhatsApp & Voice AI engines
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-200/80 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-6 py-2.5 text-xs font-extrabold shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
