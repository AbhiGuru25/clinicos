import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { findOrCreatePatient } from '@/lib/phone';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

function parseDateAndTime(slotStr: string, defaultDate: string) {
  let targetDate = defaultDate;
  let targetTime = '10:00 AM';

  if (!slotStr) return { date: targetDate, time: targetTime };

  const lower = slotStr.toLowerCase();
  const today = new Date();

  if (lower.includes('tomorrow')) {
    const tmrw = new Date(Date.now() + 86400000);
    targetDate = tmrw.toISOString().split('T')[0];
  } else if (lower.includes('today')) {
    targetDate = today.toISOString().split('T')[0];
  } else {
    // Check if YYYY-MM-DD date in string
    const matchDate = slotStr.match(/\d{4}-\d{2}-\d{2}/);
    if (matchDate) targetDate = matchDate[0];
  }

  // Extract time pattern (e.g. 10:00 AM, 1:00 PM, 5 PM, morning, evening)
  const matchTime = slotStr.match(/\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)\b/i);
  if (matchTime) {
    targetTime = matchTime[0].toUpperCase();
  } else if (lower.includes('evening')) {
    targetTime = '05:00 PM';
  } else if (lower.includes('afternoon')) {
    targetTime = '02:00 PM';
  } else if (lower.includes('morning')) {
    targetTime = '10:00 AM';
  }

  return { date: targetDate, time: targetTime };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[Omnidim AI Booking API] Received payload:', payload);

    // Support flat body OR Omnidim extracted_variables OR post-call payload
    const vars = payload.extracted_variables || payload.variables || payload;

    const patientName = vars.full_name || vars.patient_name || vars.name || 'Voice AI Patient';
    const rawPhone = vars.phone_number || vars.phone || vars.caller_phone || payload.caller_number || '';
    const rawSlot = vars.preferred_date_slot || vars.date_slot || vars.time || vars.date || '';
    const mainConcern = vars.main_concern || vars.notes || 'Voice AI Appointment Inquiry';

    if (!rawPhone) {
      return NextResponse.json({ error: 'Missing required field: phone_number' }, { status: 400 });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const { date, time } = parseDateAndTime(rawSlot, todayStr);

    // Get default clinic
    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .limit(1)
      .single();

    // Smart Deduplicated Patient Lookup / Registration
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: rawPhone,
      name: patientName,
      clinicId: clinic?.id,
      history: mainConcern !== 'Voice AI Appointment Inquiry' ? `Concern: ${mainConcern}` : undefined
    });

    // Insert appointment into OPD Queue
    const aptPayload: any = {
      patient_id: patient.id,
      appointment_date: date,
      appointment_time: time,
      notes: `Concern: ${mainConcern} (Booked via Omnidim Voice AI)`,
      status: 'confirmed'
    };
    if (clinic?.id) aptPayload.clinic_id = clinic.id;

    const { data: appointment, error: apptError } = await supabaseAdmin
      .from('appointments')
      .insert([aptPayload])
      .select('*, patients(id, name, phone)')
      .single();

    if (apptError) {
      console.error('[Omnidim AI Booking API] Error creating appointment:', apptError);
      return NextResponse.json({ error: `Appointment creation failed: ${apptError.message}` }, { status: 500 });
    }

    console.log('[Omnidim AI Booking API] Successfully booked appointment:', appointment.id);

    return NextResponse.json({
      status: 'success',
      message: `Appointment confirmed for ${patientName} on ${date} at ${time}`,
      appointment
    });

  } catch (err: any) {
    console.error('[Omnidim AI Booking API] Internal Server Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
