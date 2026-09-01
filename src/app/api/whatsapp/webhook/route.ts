import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function handleMultiMessageAutoReply({
  cleanPhone,
  patientName,
  userMessage,
  clinicId
}: {
  cleanPhone: string;
  patientName: string;
  userMessage: string;
  clinicId: string;
}) {
  const msgLower = userMessage.toLowerCase().trim();

  // 1. Menu Selection "1" or "book" or "appointment"
  if (msgLower === '1' || msgLower.includes('book') || msgLower.includes('appointment')) {
    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `Hello *${patientName}*! 👋\n\nI'd be happy to help you book an OPD Consultation at *KK Neuro Vision Therapy Institute*.`,
      clinicId
    });
    await delay(1200);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `📅 *Available OPD Slots Today & Tomorrow:*\n\n• Today (Evening): 4:00 PM | 5:30 PM | 6:30 PM\n• Tomorrow (Morning): 10:00 AM | 11:30 AM\n• Tomorrow (Evening): 4:00 PM | 5:30 PM`,
      clinicId
    });
    await delay(1200);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `✍️ *To confirm your booking, please reply with:*\n\n"Your Name, Preferred Time Slot"\n\n_Example: Rahul, Tomorrow 10 AM_`,
      clinicId
    });
    return;
  }

  // 2. Menu Selection "2" or "address" or "location" or "where"
  if (msgLower === '2' || msgLower.includes('address') || msgLower.includes('location') || msgLower.includes('where')) {
    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `📍 *KK Neuro Vision Therapy Institute Location:*`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `Healthcare Hub, Near Circle, SG Highway, Ahmedabad, Gujarat — 380015.\n\n📞 Desk: +91 95588 55508\n⏰ OPD Timings: 9:00 AM – 8:00 PM (Mon to Sat)`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `🗺️ *Click for Google Maps Navigation:*\nhttps://maps.google.com/?q=KK+Neuro+Vision+Therapy+Institute+Ahmedabad`,
      clinicId
    });
    return;
  }

  // 3. Menu Selection "3" or "fees" or "cost" or "treatment"
  if (msgLower === '3' || msgLower.includes('fees') || msgLower.includes('cost') || msgLower.includes('price')) {
    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `📋 *Consultation Fees & Therapy Services:*`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `• *Doctor OPD Consultation:* ₹800\n• *Complete Vision Therapy Assessment:* ₹1,500\n• *Amblyopia (Lazy Eye) Evaluation:* ₹1,200\n• *Strabismus / Squint Examination:* ₹1,500`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `Would you like me to book an OPD consultation slot for you with Dr. Vikash today? 🗓️\n\nReply *1* to view available slots!`,
      clinicId
    });
    return;
  }

  // 4. Default Interactive Welcome Menu (Staggered 3-Message Flow)
  await sendWhatsAppMessage({
    phone: cleanPhone,
    message: `Hello *${patientName}*! 👋 Welcome to *KK Neuro Vision Therapy Institute*.`,
    clinicId
  });
  await delay(1200);

  await sendWhatsAppMessage({
    phone: cleanPhone,
    message: `Dr. Vikash & Team specialize in Vision Therapy, Amblyopia (Lazy Eye), Strabismus, and Comprehensive Eye Evaluations.`,
    clinicId
  });
  await delay(1200);

  await sendWhatsAppMessage({
    phone: cleanPhone,
    message: `🤖 *How can I help you today? Please reply with a number:*\n\n1️⃣ Book OPD Appointment\n2️⃣ Clinic Address & Directions\n3️⃣ Consultation Fees & Treatments\n4️⃣ Talk to Front Desk Receptionist`,
    clinicId
  });
}

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

    // Ignore messages sent by bot itself
    if (message.key.fromMe) return NextResponse.json({ status: 'ok' });

    const remoteJid = message.key.remoteJid;
    const rawSenderNumber = remoteJid.split('@')[0];
    const cleanSenderNumber = normalizePhone(rawSenderNumber);
    const textContent = message.message?.conversation || message.message?.extendedTextMessage?.text || '';

    if (!textContent) return NextResponse.json({ status: 'ok' });

    // 2. Find or create patient with deduplicated phone lookup
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanSenderNumber,
      name: 'Valued Patient',
      clinicId: clinic.id
    });

    const patientName = patient?.name && patient.name !== 'New WhatsApp Patient' ? patient.name : 'Valued Patient';

    // 3. Store the incoming message in database
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

    // 4. Trigger Next-Level Multi-Message Auto-Reply Engine
    handleMultiMessageAutoReply({
      cleanPhone: cleanSenderNumber,
      patientName: patientName,
      userMessage: textContent,
      clinicId: clinic.id
    }).catch(err => console.error('Multi-Message Bot Error:', err));

    // 5. Trigger n8n Master Workflow if configured
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
