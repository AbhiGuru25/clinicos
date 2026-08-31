import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('*, appointments(id)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API Patients Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, patients: data || [] });
  } catch (err: any) {
    console.error('API Patients Internal Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clinic_id, name, phone, medical_notes } = body;

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      return NextResponse.json({ success: false, error: 'Valid phone number is required.' }, { status: 400 });
    }

    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanPhone,
      name,
      clinicId: clinic_id,
      history: medical_notes
    });

    return NextResponse.json({ success: true, patient });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
