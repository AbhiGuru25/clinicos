import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { findOrCreatePatient, normalizePhone } from '@/lib/phone';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk'
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generative AI Knowledge Base Prompt for KK Neuro Vision Therapy Institute
const CLINIC_KNOWLEDGE_PROMPT = `
You are the 24/7 AI Receptionist & Clinical Coordinator for KK Neuro Vision Therapy Institute in Ahmedabad, Gujarat.
Doctor / Founder: Dr. Vikash
Location: Healthcare Hub, Near Circle, SG Highway, Ahmedabad, Gujarat — 380015
Phone / WhatsApp: +91 63524 49698
OPD Hours: 9:00 AM – 1:00 PM (Morning) & 4:00 PM – 8:00 PM (Evening), Monday to Saturday. Sunday closed.

Treatments & Specializations:
- Vision Therapy & Neuro-Optometric Rehabilitation
- Amblyopia (Lazy Eye) Evaluation & Treatment
- Strabismus (Squint) Non-Surgical Therapy
- Digital Eye Strain & Binocular Vision Disorders
- Comprehensive Pediatric & Adult Eye Assessment

Consultation Fees:
- OPD Doctor Consultation: ₹800
- Vision Therapy & Amblyopia Assessment: ₹1,200 – ₹1,500

Behavior & Rules:
1. Answer in the same language the patient messages you (English, Hindi, or Gujarati).
2. Be warm, professional, concise, empathetic, and clear.
3. Always offer to help them book an OPD appointment slot with Dr. Vikash.
4. Keep responses short and suitable for WhatsApp (2-4 lines max).
5. Never diagnose medical conditions directly; invite them for a clinical OPD assessment with Dr. Vikash.
`;

async function getGenerativeAiReply(userMsg: string, patientName: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: CLINIC_KNOWLEDGE_PROMPT },
            { role: 'user', content: `Patient Name: ${patientName}. Message: "${userMsg}"` }
          ],
          max_tokens: 250,
          temperature: 0.7
        })
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    } else if (process.env.GEMINI_API_KEY) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${CLINIC_KNOWLEDGE_PROMPT}\n\nPatient Name: ${patientName}. Patient Question: "${userMsg}"` }]
          }]
        })
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.error('Generative AI error:', err);
  }
  return null;
}

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

  // 0. Auto Appointment Booking parsing if patient replies with name/time (e.g., "Rahul, Tomorrow 10 AM" or "4 PM")
  const hasTimeKeyword = msgLower.includes('am') || msgLower.includes('pm') || msgLower.includes('tomorrow') || msgLower.includes('today') || msgLower.includes(':');
  if (hasTimeKeyword && !msgLower.startsWith('1') && !msgLower.startsWith('2') && !msgLower.startsWith('3')) {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const targetDate = msgLower.includes('tomorrow') ? tomorrowStr : todayStr;
    
    // Extract name if provided as "Name, Time"
    let extractedName = patientName;
    if (userMessage.includes(',')) {
      const parts = userMessage.split(',');
      if (parts[0].trim().length > 1) {
        extractedName = parts[0].trim();
      }
    }

    // Ensure patient name is updated
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanPhone,
      name: extractedName,
      clinicId,
      history: `WhatsApp OPD Inquiry & Booking: ${userMessage}`
    });

    // Create confirmed appointment directly in Supabase
    const aptPayload: any = {
      patient_id: patient.id,
      appointment_date: targetDate,
      appointment_time: userMessage,
      status: 'confirmed',
      notes: `Booked via WhatsApp AI Bot (${userMessage})`
    };
    if (clinicId) aptPayload.clinic_id = clinicId;

    await supabaseAdmin.from('appointments').insert([aptPayload]);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `🎉 *OPD Appointment Confirmed!*`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `👤 *Patient Name:* ${extractedName}\n📅 *Date:* ${targetDate === tomorrowStr ? 'Tomorrow' : 'Today'}\n⏰ *Time:* ${userMessage}\n📍 *Clinic:* KK Neuro Vision Therapy Institute, SG Highway, Ahmedabad`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `✅ *Your appointment is synced live into ClinicOS Dashboard!* Dr. Vikash & team look forward to seeing you.`,
      clinicId
    });
    return;
  }

  // 1. Try Generative AI LLM response first if API key is present
  const aiResponse = await getGenerativeAiReply(userMessage, patientName);
  if (aiResponse) {
    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: aiResponse,
      clinicId
    });
    return;
  }

  // 2. Menu Selection "1" or "book" or "appointment"
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

  // 3. Menu Selection "2" or "address" or "location" or "where"
  if (msgLower === '2' || msgLower.includes('address') || msgLower.includes('location') || msgLower.includes('where')) {
    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `📍 *KK Neuro Vision Therapy Institute Location:*`,
      clinicId
    });
    await delay(1000);

    await sendWhatsAppMessage({
      phone: cleanPhone,
      message: `Healthcare Hub, Near Circle, SG Highway, Ahmedabad, Gujarat — 380015.\n\n📞 Desk: +91 63524 49698\n⏰ OPD Timings: 9:00 AM – 8:00 PM (Mon to Sat)`,
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

  // 4. Menu Selection "3" or "fees" or "cost" or "treatment"
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

  // 5. Default Interactive Welcome Menu (Staggered 3-Message Flow)
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

    const instance = payload.instance || payload.sender || 'ClinicBot1';
    const data = payload.data || payload;

    // 1. Identify clinic if available (or auto-create default clinic)
    let clinicId: string | undefined = undefined;
    const { data: foundClinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('evolution_instance', instance)
      .single();

    if (foundClinic) {
      clinicId = foundClinic.id;
    } else {
      const { data: firstClinic } = await supabaseAdmin
        .from('clinics')
        .select('id')
        .limit(1)
        .single();
      if (firstClinic) {
        clinicId = firstClinic.id;
      } else {
        const { data: newClinic } = await supabaseAdmin
          .from('clinics')
          .insert([{ name: 'KK Neuro Vision Therapy Institute', evolution_instance: instance }])
          .select('id')
          .single();
        if (newClinic) clinicId = newClinic.id;
      }
    }

    // Check if Meta Cloud API Payload format
    let metaSenderNumber = '';
    let metaText = '';
    let metaName = '';

    if (payload.object === 'whatsapp_business_account' && payload.entry?.[0]?.changes?.[0]?.value) {
      const val = payload.entry[0].changes[0].value;
      
      // Ignore status receipts (sent, delivered, read)
      if (val.statuses && !val.messages) {
        return NextResponse.json({ status: 'ok' });
      }

      const msg = val.messages?.[0];
      const contact = val.contacts?.[0];
      if (msg) {
        metaSenderNumber = msg.from || '';
        metaText = msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.title || msg.caption || '';
        metaName = contact?.profile?.name || '';
      }
    }

    const message = data.message || data;

    let remoteJid = metaSenderNumber ? `${metaSenderNumber}@s.whatsapp.net` : (message.key?.remoteJid || data.key?.remoteJid || '');
    if (remoteJid.includes('@lid')) {
      remoteJid = message.key?.remoteJidAlt || data.key?.remoteJidAlt || data.sender || remoteJid;
    }
    if (!remoteJid && !metaSenderNumber) return NextResponse.json({ status: 'ok' });

    // Ignore messages sent by bot itself
    if (message.key?.fromMe) return NextResponse.json({ status: 'ok' });

    const rawSenderNumber = metaSenderNumber || remoteJid.split('@')[0];
    const cleanSenderNumber = normalizePhone(rawSenderNumber);
    const textContent = metaText || (
      message?.conversation || 
      message?.extendedTextMessage?.text || 
      message?.text || 
      data?.conversation || 
      data?.body || 
      data?.text || 
      (typeof message === 'string' ? message : '')
    ).toString().trim();

    if (!textContent) return NextResponse.json({ status: 'ok' });

    // 2. Find or create patient with deduplicated phone lookup
    const patient = await findOrCreatePatient(supabaseAdmin, {
      phone: cleanSenderNumber,
      name: 'Valued Patient',
      clinicId: clinicId
    });

    const patientName = patient?.name && patient.name !== 'New WhatsApp Patient' ? patient.name : 'Valued Patient';

    // 3. Store incoming message silently in database
    let newMessage: any = null;
    try {
      const msgPayload: any = {
        patient_id: patient?.id,
        sender_number: cleanSenderNumber,
        content: textContent,
        type: 'incoming',
        status: 'received'
      };
      if (clinicId) msgPayload.clinic_id = clinicId;

      const { data } = await supabaseAdmin
        .from('whatsapp_messages')
        .insert([msgPayload])
        .select()
        .single();
      newMessage = data;
    } catch (dbErr) {
      console.error('Database message log error (non-blocking):', dbErr);
    }

    // 4. Trigger Next-Level Multi-Message Auto-Reply Engine
    await handleMultiMessageAutoReply({
      cleanPhone: rawSenderNumber,
      patientName: patientName,
      userMessage: textContent,
      clinicId: clinicId || ''
    });

    // 5. Trigger n8n Master Workflow if configured
    if (newMessage && process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          patient: patient,
          clinicId: clinicId
        })
      }).catch(err => console.error('n8n Trigger Error:', err));
    }

    return NextResponse.json({ status: 'success' });
  } catch (err: any) {
    console.error('Webhook Top-Level Error:', err);
    return NextResponse.json({ status: 'success', message: err?.message || 'Handled error' });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'clinicos_whatsapp_token_2026';

    if (mode === 'subscribe' && (token === VERIFY_TOKEN || token === 'clinicos_whatsapp_token_2026')) {
      return new Response(challenge, { status: 200 });
    }

    return new Response(challenge || 'ClinicOS WhatsApp Webhook OK', { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'ok' });
  }
}
