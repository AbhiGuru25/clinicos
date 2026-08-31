import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      clinic_id, 
      patient_id: existingPatientId, 
      is_new_patient, 
      patient_name, 
      patient_phone, 
      appointment_date, 
      appointment_time, 
      notes 
    } = body;

    let finalPatientId = existingPatientId;

    // 1. Deduplicated Patient Lookup / Registration
    if (patient_phone || is_new_patient) {
      const patient = await findOrCreatePatient(supabaseAdmin, {
        phone: patient_phone,
        name: patient_name,
        clinicId: clinic_id
      });
      if (patient) finalPatientId = patient.id;
    }

    if (!finalPatientId) {
      return NextResponse.json({ success: false, error: 'Patient details or phone number is required.' }, { status: 400 });
    }

    // 2. Insert Appointment with service role (bypasses RLS)
    const aptPayload: any = {
      patient_id: finalPatientId,
      appointment_date: appointment_date,
      appointment_time: appointment_time,
      status: 'confirmed',
      notes: notes || ''
    };
    if (clinic_id) aptPayload.clinic_id = clinic_id;

    const { data: appointment, error: aptErr } = await supabaseAdmin
      .from('appointments')
      .insert([aptPayload])
      .select('*, patients(id, name, phone)')
      .single();

    if (aptErr) {
      return NextResponse.json({ success: false, error: `Appointment booking failed: ${aptErr.message}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    console.error('Book API Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
