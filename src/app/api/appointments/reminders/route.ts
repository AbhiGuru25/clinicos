import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  try {
    const [hour, min] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(hour, 10));
    d.setMinutes(parseInt(min, 10));
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return timeStr;
  }
}

function formatDateLabel(dateStr: string, todayStr: string, tomorrowStr: string): string {
  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export async function processReminders(targetDateFilter?: 'today' | 'tomorrow' | 'both') {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  let datesToQuery: string[] = [];
  if (targetDateFilter === 'today') datesToQuery = [todayStr];
  else if (targetDateFilter === 'tomorrow') datesToQuery = [tomorrowStr];
  else datesToQuery = [todayStr, tomorrowStr];

  // 1. Fetch upcoming confirmed or pending appointments for targeted dates
  const { data: appointments, error } = await supabaseAdmin
    .from('appointments')
    .select('*, patients(id, name, phone)')
    .in('appointment_date', datesToQuery)
    .neq('status', 'cancelled')
    .neq('status', 'completed')
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('[Reminders Engine Error] Failed to query appointments:', error);
    return { success: false, error: error.message };
  }

  const results: any[] = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const apt of (appointments || [])) {
    const patientName = (apt.patients?.name || apt.patient_name || 'Valued Patient').trim();
    const phone = apt.patients?.phone || apt.phone_number;

    if (!phone) {
      results.push({ id: apt.id, name: patientName, status: 'skipped', reason: 'No phone number' });
      continue;
    }

    const dateLabel = formatDateLabel(apt.appointment_date, todayStr, tomorrowStr);
    const timeLabel = formatTime(apt.appointment_time);

    const message = `Hi *${patientName}*! 👋\n\nThis is a friendly reminder for your upcoming OPD consultation at *KK Neuro Vision Therapy Institute*.\n\n• *Date:* ${dateLabel} (${apt.appointment_date})\n• *Time Slot:* ${timeLabel}\n• *Consultant:* Dr. Vikash\n• *Location:* Healthcare Hub, Near Circle, SG Highway, Ahmedabad.\n\n📍 *Map Navigation:* https://maps.google.com/?q=KK+Neuro+Vision+Therapy+Institute+Ahmedabad\n\n👉 *Need to reschedule?* Reply to this message with your preferred time, or call desk at +91 63524 49698.\n\nWe look forward to seeing you!`;

    try {
      const dispatch = await sendWhatsAppMessage({
        phone,
        message,
        patientId: apt.patient_id || apt.patients?.id,
        clinicId: apt.clinic_id
      });

      sentCount++;
      results.push({
        id: apt.id,
        patient: patientName,
        phone,
        date: apt.appointment_date,
        time: timeLabel,
        deliveredViaApi: dispatch.deliveredViaApi,
        waWebUrl: dispatch.waWebUrl,
        status: 'sent'
      });
    } catch (sendErr: any) {
      failedCount++;
      results.push({
        id: apt.id,
        patient: patientName,
        phone,
        status: 'error',
        error: sendErr.message
      });
    }
  }

  return {
    success: true,
    totalTargeted: appointments?.length || 0,
    sentCount,
    failedCount,
    results
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.target || 'both';
    const result = await processReminders(target);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Reminders API Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = (searchParams.get('target') as any) || 'both';
    const result = await processReminders(target);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Reminders Cron GET Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
