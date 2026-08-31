import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Doctor Name
    const { data: clinic } = await supabaseAdmin.from('clinics').select('doctor_name').limit(1).single();
    const doctorName = (clinic?.doctor_name && !clinic.doctor_name.toLowerCase().includes('name2')) 
      ? clinic.doctor_name 
      : 'Dr. Vikash';

    // 2. Total Patients
    const { data: patients } = await supabaseAdmin.from('patients').select('id, name, phone, created_at');

    // 3. Appointments
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('*, patients(name, phone)')
      .order('appointment_time', { ascending: true });

    // 4. Invoices / Revenue
    const { data: invoices } = await supabaseAdmin.from('invoices').select('total, amount');
    const totalRevenue = (invoices || []).reduce((sum, inv) => sum + (Number(inv.total || inv.amount) || 0), 0);

    // 5. WhatsApp Messages
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('*, patients(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    const todayAppointments = (appointments || []).filter(a => a.appointment_date === todayStr);

    return NextResponse.json({
      success: true,
      doctorName,
      totalPatients: (patients || []).length,
      todayVisits: todayAppointments.length,
      totalRevenue,
      todayAppointments,
      allAppointments: appointments || [],
      messages: messages || []
    });
  } catch (err: any) {
    console.error('API Stats Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
