import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

// Default OPD routine for KK Neuro Vision Therapy Institute:
// Mon-Sat: 09:00 - 13:00 (Morning) & 16:00 - 20:00 (Evening)
// Sun: Closed
const DEFAULT_SCHEDULE = [
  { day_of_week: 1, day_name: 'Monday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 2, day_name: 'Tuesday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 3, day_name: 'Wednesday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 4, day_name: 'Thursday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 5, day_name: 'Friday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 6, day_name: 'Saturday', is_working: true, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
  { day_of_week: 0, day_name: 'Sunday', is_working: false, morning_start: '09:00', morning_end: '13:00', evening_start: '16:00', evening_end: '20:00', slot_duration_minutes: 30 },
];

export async function GET(req: Request) {
  try {
    const { data: clinic } = await supabaseAdmin.from('clinics').select('id').limit(1).single();
    const clinicId = clinic?.id;

    // Fetch existing schedule entries
    const query = supabaseAdmin.from('doctor_schedule').select('*').order('day_of_week', { ascending: true });
    if (clinicId) {
      query.or(`clinic_id.eq.${clinicId},clinic_id.is.null`);
    }
    const { data: dbSchedule, error } = await query;

    if (error) {
      console.error('Error fetching doctor_schedule:', error);
    }

    // Map DB records to clean day schedules
    const dayMap = new Map<number, any>();
    if (dbSchedule && dbSchedule.length > 0) {
      for (const row of dbSchedule) {
        const d = row.day_of_week;
        if (!dayMap.has(d)) {
          dayMap.set(d, {
            day_of_week: d,
            is_working: true,
            shifts: [],
            slot_duration_minutes: row.slot_duration_minutes || 30
          });
        }
        dayMap.get(d).shifts.push({
          id: row.id,
          start_time: row.start_time?.slice(0, 5) || '09:00',
          end_time: row.end_time?.slice(0, 5) || '13:00'
        });
      }
    }

    // Build full week schedule with defaults if not set in DB
    const days = [1, 2, 3, 4, 5, 6, 0].map(d => {
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
          slot_duration_minutes: custom.slot_duration_minutes
        };
      }
      return def;
    });

    return NextResponse.json({
      success: true,
      schedule: days,
      clinic_id: clinicId
    });
  } catch (err: any) {
    console.error('API /api/schedule error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schedule, clinic_id } = body;

    if (!Array.isArray(schedule)) {
      return NextResponse.json({ success: false, error: 'Schedule must be an array' }, { status: 400 });
    }

    const { data: clinic } = await supabaseAdmin.from('clinics').select('id').limit(1).single();
    const targetClinicId = clinic_id || clinic?.id;

    // Remove existing schedule for this clinic to replace with updated routine
    if (targetClinicId) {
      await supabaseAdmin.from('doctor_schedule').delete().eq('clinic_id', targetClinicId);
    } else {
      await supabaseAdmin.from('doctor_schedule').delete().is('clinic_id', null);
    }

    const rowsToInsert: any[] = [];
    for (const day of schedule) {
      if (!day.is_working) continue;

      const slotDuration = day.slot_duration_minutes || 30;

      // Morning shift
      if (day.morning_start && day.morning_end) {
        rowsToInsert.push({
          clinic_id: targetClinicId,
          day_of_week: day.day_of_week,
          start_time: day.morning_start.length === 5 ? `${day.morning_start}:00` : day.morning_start,
          end_time: day.morning_end.length === 5 ? `${day.morning_end}:00` : day.morning_end,
          slot_duration_minutes: slotDuration
        });
      }

      // Evening shift
      if (day.evening_start && day.evening_end) {
        rowsToInsert.push({
          clinic_id: targetClinicId,
          day_of_week: day.day_of_week,
          start_time: day.evening_start.length === 5 ? `${day.evening_start}:00` : day.evening_start,
          end_time: day.evening_end.length === 5 ? `${day.evening_end}:00` : day.evening_end,
          slot_duration_minutes: slotDuration
        });
      }
    }

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin.from('doctor_schedule').insert(rowsToInsert);
      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ success: true, message: 'Schedule updated successfully' });
  } catch (err: any) {
    console.error('Error saving schedule:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
