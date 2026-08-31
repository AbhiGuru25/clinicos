import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Patient ID is required' }, { status: 400 });
    }

    // 1. Fetch Patient
    const { data: patient, error: pErr } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (pErr || !patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // 2. Fetch Patient's Appointments
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('patient_id', id)
      .order('appointment_date', { ascending: false });

    // 3. Fetch Patient's Invoices
    const { data: invoices } = await supabaseAdmin
      .from('invoices')
      .select('*, appointments(appointment_date, notes)')
      .eq('appointments.patient_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      patient,
      appointments: appointments || [],
      invoices: invoices || []
    });
  } catch (err: any) {
    console.error('API Patient ID Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
