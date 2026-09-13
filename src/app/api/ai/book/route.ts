import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-requested-with',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Prioritized Extractor for Omnidim JSON Payloads.
 * ALWAYS prioritizes patient's spoken phone number (extracted_variables.phone_number)
 * OVER telecom SIP line caller ID (customer.number / from).
 */
function extractOmnidimData(obj: any): { name?: string; phone?: string; slot?: string; concern?: string } {
  if (!obj || typeof obj !== 'object') return {};

  // 1. Check extracted_variables first (High Priority)
  const vars = obj.extracted_variables || obj.data?.extracted_variables || obj.call?.extracted_variables || obj.variables;
  
  let name = vars?.full_name || vars?.patient_name || vars?.caller_name || obj.full_name || obj.patient_name || obj.customer?.name;
  let phone = vars?.phone_number || vars?.phone || vars?.caller_phone || vars?.mobile || obj.phone_number || obj.caller_phone;
  let slot = vars?.preferred_date_slot || vars?.date_slot || vars?.slot || obj.preferred_date_slot;
  let concern = vars?.main_concern || vars?.concern || vars?.notes || obj.main_concern;

  // 2. Search recursively if any field is still missing
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const nested = extractOmnidimData(val);
      if (!name && nested.name) name = nested.name;
      if (!phone && nested.phone) phone = nested.phone;
      if (!slot && nested.slot) slot = nested.slot;
      if (!concern && nested.concern) concern = nested.concern;
    }
  }

  // 3. Fallback to telecom caller ID if spoken phone was not provided
  if (!phone) {
    phone = obj.customer_phone || obj.customer?.number || obj.from || obj.phone || obj.number;
  }

  if (!name && typeof obj.name === 'string' && obj.name !== 'Voice AI Patient') name = obj.name;
  if (!slot && (typeof obj.time === 'string' || typeof obj.date === 'string')) slot = obj.time || obj.date;

  return { name, phone, slot, concern };
}

function parseDateAndTime(slotStr: string, defaultDate: string) {
  let targetDate = defaultDate;
  let targetTime = '10:00:00';

  if (!slotStr || slotStr === 'NA' || slotStr === 'Not provided') {
    return { date: targetDate, time: targetTime };
  }

  const lower = slotStr.toLowerCase();
  const currentYear = new Date().getFullYear();

  if (lower.includes('tomorrow')) {
    const tmrw = new Date(Date.now() + 86400000);
    targetDate = tmrw.toISOString().split('T')[0];
  } else if (lower.includes('today')) {
    targetDate = new Date().toISOString().split('T')[0];
  } else {
    const matchISO = slotStr.match(/\d{4}-\d{2}-\d{2}/);
    if (matchISO) {
      targetDate = matchISO[0];
    } else {
      const monthMap: Record<string, number> = {
        january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
        may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
        september: 8, sept: 8, sep: 8, october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11
      };

      let monthIndex = -1;
      let dayNumber = 1;

      for (const [mName, mIdx] of Object.entries(monthMap)) {
        if (lower.includes(mName)) {
          monthIndex = mIdx;
          break;
        }
      }

      if (monthIndex !== -1) {
        if (lower.includes('first') || lower.includes('1st') || lower.includes('one')) dayNumber = 1;
        else if (lower.includes('second') || lower.includes('2nd') || lower.includes('two')) dayNumber = 2;
        else if (lower.includes('third') || lower.includes('3rd') || lower.includes('three')) dayNumber = 3;
        else if (lower.includes('fourth') || lower.includes('4th')) dayNumber = 4;
        else if (lower.includes('fifth') || lower.includes('5th')) dayNumber = 5;
        else if (lower.includes('sixth') || lower.includes('6th')) dayNumber = 6;
        else if (lower.includes('seventh') || lower.includes('7th')) dayNumber = 7;
        else if (lower.includes('eighth') || lower.includes('8th')) dayNumber = 8;
        else if (lower.includes('ninth') || lower.includes('9th')) dayNumber = 9;
        else if (lower.includes('tenth') || lower.includes('10th')) dayNumber = 10;
        else {
          const dayMatch = lower.match(/\b([1-9]|[12][0-9]|3[01])(st|nd|rd|th)?\b/);
          if (dayMatch) dayNumber = parseInt(dayMatch[1], 10);
        }

        const parsedD = new Date(currentYear, monthIndex, dayNumber);
        targetDate = parsedD.toISOString().split('T')[0];
      }
    }
  }

  const matchTime = slotStr.match(/\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)?\b/i);
  if (matchTime) {
    let hour = parseInt(matchTime[1], 10);
    let min = matchTime[2] || '00';
    let period = (matchTime[3] || (hour < 8 || hour === 12 ? 'PM' : 'AM')).toUpperCase();

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    targetTime = `${String(hour).padStart(2, '0')}:${min}:00`;
  } else if (lower.includes('evening')) {
    targetTime = '17:00:00';
  } else if (lower.includes('afternoon')) {
    targetTime = '14:00:00';
  } else if (lower.includes('morning')) {
    targetTime = '10:00:00';
  }

  return { date: targetDate, time: targetTime };
}

export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }

    console.log('[Omnidim AI Booking API] Received payload:', JSON.stringify(payload));

    // Extract variables with Spoken Patient Mobile Number prioritized over Telecom Caller ID
    const extracted = extractOmnidimData(payload);

    const patientName = extracted.name && extracted.name !== 'NA' && extracted.name !== 'Not provided' 
      ? extracted.name 
      : 'Voice AI Patient';

    let rawPhone = extracted.phone || '';
    const rawSlot = extracted.slot || '';
    const mainConcern = extracted.concern && extracted.concern !== 'NA' && extracted.concern !== 'Not provided' 
      ? extracted.concern 
      : 'Voice AI Appointment Inquiry';

    // Handle empty test ping
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({
        status: 'success',
        message: 'Omnidim API Connection Verified Successfully! Endpoint is online.',
        test_patient: patientName
      }, { headers: corsHeaders });
    }

    // Clean phone number or assign fallback
    let cleanPhone = normalizePhone(rawPhone);
    if (!cleanPhone || cleanPhone.length < 10) {
      cleanPhone = '9558855508';
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const { date: rawParsedDate, time: rawParsedTime } = parseDateAndTime(rawSlot, todayStr);

    // Get default clinic
    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .limit(1)
      .single();

    // ─── Enforce Doctor Schedule & Working Hours ───
    const { getDoctorSchedule, isClinicOpenOnDate, validateOpdTime, snapTo1HourSlot } = await import('@/lib/schedule');
    const doctorSchedule = await getDoctorSchedule(supabaseAdmin, clinic?.id);

    let finalDate = rawParsedDate;
    let finalTime = snapTo1HourSlot(rawParsedTime);
    let scheduleAdjustmentNote = '';

    // Check if clinic is open on the requested date
    let dateCheck = isClinicOpenOnDate(doctorSchedule, [], finalDate);
    if (!dateCheck.isOpen) {
      // Find the next available working day (up to 7 days ahead)
      let nextDateObj = new Date(`${finalDate}T12:00:00`);
      for (let i = 1; i <= 7; i++) {
        nextDateObj.setDate(nextDateObj.getDate() + 1);
        const candidateStr = nextDateObj.toISOString().split('T')[0];
        const candidateCheck = isClinicOpenOnDate(doctorSchedule, [], candidateStr);
        if (candidateCheck.isOpen) {
          scheduleAdjustmentNote = `Original requested date ${finalDate} was closed (${dateCheck.reason}). Moved to next open day: ${candidateStr}. `;
          finalDate = candidateStr;
          dateCheck = candidateCheck;
          break;
        }
      }
    }

    // Validate time against working OPD hours on that day
    if (dateCheck.daySchedule) {
      const timeCheck = validateOpdTime(dateCheck.daySchedule, finalTime);
      if (!timeCheck.valid && timeCheck.suggestedTime) {
        scheduleAdjustmentNote += `Requested time was outside OPD hours (${timeCheck.reason}). Adjusted to ${timeCheck.suggestedTime}. `;
        finalTime = timeCheck.suggestedTime;
      } else {
        finalTime = timeCheck.normalizedTime;
      }
    }

    // Smart Deduplicated Patient Lookup / Registration / Name Sync
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanPhone,
      name: patientName,
      clinicId: clinic?.id,
      history: mainConcern !== 'Voice AI Appointment Inquiry' ? `Concern: ${mainConcern}` : undefined
    });

    // Insert appointment into OPD Queue
    const aptPayload: any = {
      patient_id: patient.id,
      appointment_date: finalDate,
      appointment_time: finalTime,
      notes: `${scheduleAdjustmentNote}Concern: ${mainConcern} (Booked via OmniDim Voice AI)`.trim(),
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
      return NextResponse.json(
        { error: `Appointment creation failed: ${apptError.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('[Omnidim AI Booking API] Successfully booked appointment:', appointment.id);

    return NextResponse.json({
      status: 'success',
      message: `Appointment confirmed for ${patientName} on ${finalDate} at ${finalTime}`,
      appointment
    }, { headers: corsHeaders });

  } catch (err: any) {
    console.error('[Omnidim AI Booking API] Internal Server Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
