import { SupabaseClient } from '@supabase/supabase-js';

export interface DoctorDaySchedule {
  day_of_week: number;
  day_name: string;
  is_working: boolean;
  morning_start: string;
  morning_end: string;
  evening_start: string;
  evening_end: string;
  slot_duration_minutes: number;
}

export interface BlockedDate {
  date: string;
  reason: string;
}

const DEFAULT_SCHEDULE: DoctorDaySchedule[] = [
  { day_of_week: 1, day_name: 'Monday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 2, day_name: 'Tuesday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 3, day_name: 'Wednesday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 4, day_name: 'Thursday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 5, day_name: 'Friday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 6, day_name: 'Saturday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
  { day_of_week: 0, day_name: 'Sunday', is_working: false, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 60 },
];

/**
 * Loads the active doctor schedule from Supabase doctor_schedule table.
 */
export async function getDoctorSchedule(
  supabaseAdmin: SupabaseClient,
  clinicId?: string | null
): Promise<DoctorDaySchedule[]> {
  try {
    const query = supabaseAdmin
      .from('doctor_schedule')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (clinicId) {
      query.or(`clinic_id.eq.${clinicId},clinic_id.is.null`);
    }

    const { data: rows, error } = await query;
    if (error || !rows || rows.length === 0) {
      return DEFAULT_SCHEDULE;
    }

    const dayMap = new Map<number, any>();
    for (const r of rows) {
      const d = r.day_of_week;
      if (!dayMap.has(d)) {
        dayMap.set(d, {
          day_of_week: d,
          is_working: true,
          shifts: [],
          slot_duration_minutes: r.slot_duration_minutes || 60
        });
      }
      dayMap.get(d).shifts.push({
        start_time: r.start_time?.slice(0, 5) || '09:00',
        end_time: r.end_time?.slice(0, 5) || '13:00'
      });
    }

    return [1, 2, 3, 4, 5, 6, 0].map(d => {
      const def = DEFAULT_SCHEDULE.find(s => s.day_of_week === d)!;
      const custom = dayMap.get(d);
      if (custom && custom.shifts.length > 0) {
        const m = custom.shifts[0] || { start_time: '09:00', end_time: '13:00' };
        const e = custom.shifts[1] || { start_time: '16:00', end_time: '20:00' };
        return {
          day_of_week: d,
          day_name: def.day_name,
          is_working: true,
          morning_start: m.start_time,
          morning_end: m.end_time,
          evening_start: e.start_time,
          evening_end: e.end_time,
          slot_duration_minutes: custom.slot_duration_minutes || 60
        };
      }
      return def;
    });
  } catch (err) {
    console.error('Error in getDoctorSchedule:', err);
    return DEFAULT_SCHEDULE;
  }
}

/**
 * Validates if the clinic is open on a given date (checks day of week & blocked holidays).
 */
export function isClinicOpenOnDate(
  schedule: DoctorDaySchedule[],
  blockedDates: BlockedDate[] = [],
  dateStr: string
): { isOpen: boolean; reason?: string; daySchedule?: DoctorDaySchedule } {
  // Check if date is explicitly blocked / holiday
  const blocked = blockedDates.find(b => b.date === dateStr);
  if (blocked) {
    return { isOpen: false, reason: blocked.reason || 'Clinic Holiday / Doctor Leave' };
  }

  const d = new Date(`${dateStr}T12:00:00`);
  const dayOfWeek = d.getDay();
  const daySched = schedule.find(s => s.day_of_week === dayOfWeek) || DEFAULT_SCHEDULE.find(s => s.day_of_week === dayOfWeek);

  if (!daySched || !daySched.is_working) {
    return {
      isOpen: false,
      reason: `${daySched?.day_name || 'Sunday'} is the clinic's scheduled weekly off day`,
      daySchedule: daySched
    };
  }

  return { isOpen: true, daySchedule: daySched };
}

/**
 * Snaps any time string to clean 1-hour slots: '08:00 AM', '09:00 AM', etc.
 */
export function snapTo1HourSlot(timeStr: string): string {
  if (!timeStr) return '10:00 AM';
  const upper = timeStr.toUpperCase().trim();
  
  const match = upper.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const ampm = match[3] || (hour < 8 || hour === 12 ? 'PM' : 'AM');
    if (hour > 12) hour = hour % 12 || 12;
    return `${String(hour).padStart(2, '0')}:00 ${ampm.toUpperCase()}`;
  }

  return '10:00 AM';
}

/**
 * Checks if a requested time falls within Doctor OPD hours.
 * If not, returns the closest suggested OPD slot.
 */
export function validateOpdTime(
  daySched: DoctorDaySchedule,
  timeStr: string
): { valid: boolean; normalizedTime: string; suggestedTime?: string; reason?: string } {
  const normalized = snapTo1HourSlot(timeStr);
  
  // Convert time to 24hr minutes for easy range checking
  const match = normalized.match(/(\d{2}):00\s*(AM|PM)/);
  if (!match) return { valid: true, normalizedTime: normalized };

  let hour = parseInt(match[1], 10);
  const ampm = match[2];
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  const morningStartH = parseInt(daySched.morning_start?.split(':')[0] || '9', 10);
  const morningEndH = parseInt(daySched.morning_end?.split(':')[0] || '13', 10);
  const eveningStartH = parseInt(daySched.evening_start?.split(':')[0] || '16', 10);
  const eveningEndH = parseInt(daySched.evening_end?.split(':')[0] || '20', 10);

  const inMorning = hour >= morningStartH && hour < morningEndH;
  const inEvening = hour >= eveningStartH && hour < eveningEndH;

  if (inMorning || inEvening) {
    return { valid: true, normalizedTime: normalized };
  }

  // Suggest closest available slot
  let suggested = '10:00 AM';
  if (hour < morningStartH) {
    suggested = `${String(morningStartH).padStart(2, '0')}:00 AM`;
  } else if (hour >= morningEndH && hour < eveningStartH) {
    suggested = `${String(eveningStartH % 12 || 12).padStart(2, '0')}:00 PM`;
  } else if (hour >= eveningEndH) {
    suggested = `${String(morningStartH).padStart(2, '0')}:00 AM`;
  }

  return {
    valid: false,
    normalizedTime: normalized,
    suggestedTime: suggested,
    reason: `Consultation hours on ${daySched.day_name} are Morning: ${daySched.morning_start}–${daySched.morning_end} and Evening: ${daySched.evening_start}–${daySched.evening_end}`
  };
}

/**
 * Generates an up-to-date schedule snippet to inject into AI system prompts.
 */
export function getSchedulePromptSnippet(schedule: DoctorDaySchedule[]): string {
  const workingDays = schedule.filter(s => s.is_working).map(s => 
    `• ${s.day_name}: Morning ${s.morning_start}–${s.morning_end} | Evening ${s.evening_start}–${s.evening_end}`
  ).join('\n');

  const offDays = schedule.filter(s => !s.is_working).map(s => s.day_name).join(', ') || 'Sunday';

  return `
Doctor's Live OPD Schedule & Working Hours:
${workingDays}
• Weekly Off: ${offDays} (Closed)
• Slot Duration: 1-hour appointment slots (e.g. 9:00 AM, 10:00 AM, 4:00 PM, 5:00 PM).
Strictly schedule appointments ONLY within these working hours and on working days. Never confirm slots on ${offDays} or outside OPD hours.
`.trim();
}
