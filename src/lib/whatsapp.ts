import { createClient } from '@supabase/supabase-js';
import { normalizePhone } from './phone';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function sendWhatsAppMessage({
  phone,
  message,
  patientId,
  clinicId
}: {
  phone: string;
  message: string;
  patientId?: string | null;
  clinicId?: string | null;
}) {
  const cleanDigits = phone.replace(/[^0-9]/g, '');
  let intlPhone = cleanDigits;
  if (cleanDigits.length === 10) {
    intlPhone = `91${cleanDigits}`;
  }

  // 1. Fetch Clinic Evolution API config
  let evoUrl = 'http://localhost:8081';
  let evoKey = 'yaot6e7yab8rlcxl95uw';
  let evoInstance = 'ClinicBot1';
  let targetClinicId = clinicId;

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id, evolution_url, evolution_apikey, evolution_instance')
    .limit(1)
    .single();

  if (clinic) {
    if (!targetClinicId) targetClinicId = clinic.id;
    if (clinic.evolution_url) evoUrl = clinic.evolution_url;
    if (clinic.evolution_apikey) evoKey = clinic.evolution_apikey;
    if (clinic.evolution_instance) evoInstance = clinic.evolution_instance;
  }

  let sentStatus = 'sent';
  let apiSuccess = false;

  // 2. Attempt Evolution API HTTP request or Meta Cloud API
  try {
    const metaToken = process.env.META_ACCESS_TOKEN || 'EAAPHaT1rNWcBSWZCxZCKloFlLBkiZCORhMrlBQ3xkSMSAsncMFMj6yNZAbf3vDjZCAoCaqPtibccI2KR3YOd264QJPaBQwFGmnHK7rR2w16r6yvUbmG6ZCYjl3FbXPVsgZAdrDNuYwramiHkRV6WCDm9c0W5pQZC02KrRLHij2M2gyNn02ZBmHQMFU0rjFqTwCQZDZD';
    const metaPhoneId = process.env.META_PHONE_NUMBER_ID || '1369421772910379';

    if (metaToken && metaPhoneId) {
      const metaRes = await fetch(`https://graph.facebook.com/v18.0/${metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: intlPhone,
          type: 'text',
          text: { body: message }
        })
      });
      if (metaRes.ok) {
        apiSuccess = true;
        sentStatus = 'delivered';
      }
    }

    if (!apiSuccess) {
      const endpoint = `${evoUrl.replace(/\/$/, '')}/message/sendText/${evoInstance}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evoKey,
          'Bypass-Tunnel-Remainder': 'true',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({
          number: intlPhone,
          text: message,
          textMessage: {
            text: message
          }
        })
      });

      if (res.ok) {
        apiSuccess = true;
        sentStatus = 'delivered';
      } else {
        console.warn(`[WhatsApp API Warning] HTTP ${res.status} from ${endpoint}`);
      }
    }
  } catch (err) {
    console.warn('[WhatsApp API Warning] API unreachable. Falling back to log & web link:', err);
  }

  // 3. Log outgoing message in whatsapp_messages table
  const msgPayload: any = {
    sender_number: cleanDigits,
    content: message,
    type: 'outgoing'
  };
  if (targetClinicId) msgPayload.clinic_id = targetClinicId;
  if (patientId) msgPayload.patient_id = patientId;

  await supabaseAdmin.from('whatsapp_messages').insert([msgPayload]);

  const waWebUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;

  return {
    success: true,
    deliveredViaApi: apiSuccess,
    waWebUrl,
    cleanPhone: cleanDigits
  };
}
