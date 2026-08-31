import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select('*, appointments(appointment_date, notes, status, patients(id, name, phone))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API Billing Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, invoices: data || [] });
  } catch (err: any) {
    console.error('API Billing Internal Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      clinic_id, 
      patient_id, 
      appointment_id, 
      amount, 
      consultation_fee, 
      gst_rate, 
      gst_amount, 
      total_amount 
    } = body;

    let targetAppointmentId = appointment_id;

    // 1. If no appointment_id provided, create a completed appointment for this patient first
    if (!targetAppointmentId && patient_id) {
      const todayStr = new Date().toISOString().split('T')[0];
      const nowStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;

      const aptPayload: any = {
        patient_id,
        appointment_date: todayStr,
        appointment_time: nowStr,
        status: 'completed',
        notes: 'Direct Consultation & Billing'
      };
      if (clinic_id) aptPayload.clinic_id = clinic_id;

      const { data: newApt } = await supabaseAdmin
        .from('appointments')
        .insert([aptPayload])
        .select()
        .single();

      if (newApt) targetAppointmentId = newApt.id;
    }

    // 2. Compute financial breakdown according to exact invoices table schema
    const baseAmt = Number(amount || consultation_fee || 800);
    const calculatedGst = gst_amount ?? ((baseAmt * (Number(gst_rate) || 18)) / 100);
    const calculatedTotal = total_amount ?? (baseAmt + calculatedGst);

    const invPayload: any = {
      appointment_id: targetAppointmentId || null,
      amount: baseAmt,
      gst_amount: calculatedGst,
      total: calculatedTotal
    };
    if (clinic_id) invPayload.clinic_id = clinic_id;

    // Insert only valid schema columns: [id, clinic_id, appointment_id, amount, gst_amount, total, created_at]
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert([invPayload])
      .select()
      .single();

    if (error) {
      console.error('Insert Invoice Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (err: any) {
    console.error('Post Billing Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
