import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role to bypass RLS for backend server actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[AI Booking API] Received payload:', payload);

    const { patient_name, phone, date, time } = payload;

    if (!phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields (phone, date, time)' }, { status: 400 });
    }

    // 1. Try to find the patient by phone number
    let { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('id, clinic_id')
      .eq('phone', phone)
      .limit(1)
      .single();

    // 2. If patient does not exist, create a new one
    if (!patient) {
      console.log(`[AI Booking API] Patient not found for phone ${phone}. Creating new patient.`);
      
      // Grab the first clinic ID as a default (assuming single tenant MVP for now)
      const { data: clinic } = await supabaseAdmin
        .from('clinics')
        .select('id')
        .limit(1)
        .single();
        
      if (!clinic) {
        return NextResponse.json({ error: 'No clinic configured in the database' }, { status: 500 });
      }

      const { data: newPatient, error: createError } = await supabaseAdmin
        .from('patients')
        .insert({
          name: patient_name || 'WhatsApp Patient',
          phone: phone,
          clinic_id: clinic.id
        })
        .select('id, clinic_id')
        .single();

      if (createError || !newPatient) {
        console.error('[AI Booking API] Error creating patient:', createError);
        return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
      }

      patient = newPatient;
    }

    // 3. Insert the appointment using the real UUID
    const { data: appointment, error: apptError } = await supabaseAdmin
      .from('appointments')
      .insert({
        patient_id: patient.id,
        appointment_date: date,
        appointment_time: time,
        notes: `Booked via AI Assistant`,
        status: 'confirmed' // Or 'scheduled' based on your ENUM
      })
      .select()
      .single();

    if (apptError) {
      console.error('[AI Booking API] Error creating appointment:', apptError);
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    console.log('[AI Booking API] Successfully booked appointment:', appointment.id);
    return NextResponse.json({ status: 'success', appointment });

  } catch (err: any) {
    console.error('[AI Booking API] Internal Server Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
