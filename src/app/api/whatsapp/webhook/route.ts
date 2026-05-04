import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with Admin Key to bypass RLS for system operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('WhatsApp Webhook Payload:', payload);

    // Evolution API structure usually looks like this:
    // { instance: 'ClinicOS', event: 'messages.upsert', data: { message: { ... } } }
    
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
    const senderNumber = remoteJid.split('@')[0];
    const textContent = message.message?.conversation || message.message?.extendedTextMessage?.text || '';

    if (!textContent) return NextResponse.json({ status: 'ok' });

    // 2. Find or create patient
    let { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('phone', senderNumber)
      .eq('clinic_id', clinic.id)
      .single();

    if (!patient) {
      const { data: newPatient } = await supabaseAdmin
        .from('patients')
        .insert({
          name: 'New WhatsApp Patient',
          phone: senderNumber,
          clinic_id: clinic.id
        })
        .select()
        .single();
      patient = newPatient;
    }

    // 3. Store the message
    const { data: newMessage, error: msgError } = await supabaseAdmin
      .from('whatsapp_messages')
      .insert({
        clinic_id: clinic.id,
        patient_id: patient?.id,
        sender_number: senderNumber,
        content: textContent,
        type: 'incoming',
        status: 'received'
      })
      .select()
      .single();

    // 4. Trigger n8n Master Workflow (Async - don't wait for it to respond to sender)
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
