import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('WhatsApp Webhook Payload:', payload);

    const { instance, data } = payload;
    
    if (!instance || !data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 1. Identify the clinic by instance name
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('evolution_instance', instance)
      .single();

    if (clinicError || !clinic) {
      console.error('Clinic not found for instance:', instance);
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const message = data.message;
    if (!message) return NextResponse.json({ status: 'ok' });

    const remoteJid = message.key.remoteJid;
    const rawSenderNumber = remoteJid.split('@')[0];
    const cleanSenderNumber = normalizePhone(rawSenderNumber);
    const textContent = message.message?.conversation || message.message?.extendedTextMessage?.text || '';

    if (!textContent) return NextResponse.json({ status: 'ok' });

    // 2. Find or create patient with deduplicated phone lookup
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanSenderNumber,
      name: 'New WhatsApp Patient',
      clinicId: clinic.id
    });

    // 3. Store the message
    const { data: newMessage } = await supabaseAdmin
      .from('whatsapp_messages')
      .insert({
        clinic_id: clinic.id,
        patient_id: patient?.id,
        sender_number: cleanSenderNumber,
        content: textContent,
        type: 'incoming',
        status: 'received'
      })
      .select()
      .single();

    // 4. Trigger n8n Master Workflow (Async)
    if (newMessage && process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          patient: patient,
          clinic: clinic
        })
      }).catch(err => console.error('n8n Trigger Error:', err));
    }

    return NextResponse.json({ status: 'success' });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
