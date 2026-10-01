// ==============================================================================
// Supabase Edge Function: whatsapp-appointment-reminder
// Runtime: Deno / TypeScript (Supabase Edge Runtime)
// Description: Triggers automated Meta WhatsApp Cloud API confirmation & reminder
//              messages upon appointment creation or 2-hour schedule window.
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "CRON_DISPATCH";
  table?: string;
  record?: {
    id: string;
    clinic_id: string;
    patient_id: string;
    appointment_date: string;
    start_time: string;
    status: string;
    whatsapp_reminder_sent?: boolean;
  };
  appointment_id?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const metaAccessToken = Deno.env.get("META_ACCESS_TOKEN") ?? "";
    const metaPhoneNumberId = Deno.env.get("META_PHONE_NUMBER_ID") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration in Edge Function environment.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: WebhookPayload = await req.json();

    const appointmentId = body.record?.id || body.appointment_id;
    if (!appointmentId) {
      return new Response(JSON.stringify({ error: "Missing appointment ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch appointment details with Patient and Clinic details
    const { data: appointment, error: aptError } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        status,
        whatsapp_reminder_sent,
        patients (
          id,
          name,
          phone
        ),
        clinics (
          id,
          name,
          phone
        )
      `)
      .eq("id", appointmentId)
      .single();

    if (aptError || !appointment) {
      throw new Error(`Appointment not found: ${aptError?.message}`);
    }

    const patient = (appointment as any).patients;
    const clinic = (appointment as any).clinics;

    if (!patient?.phone) {
      return new Response(JSON.stringify({ skipped: true, reason: "No phone number for patient" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Format phone number (E.164 without +)
    let recipientPhone = patient.phone.replace(/[^0-9]/g, "");
    if (recipientPhone.length === 10) {
      recipientPhone = "91" + recipientPhone;
    }

    // 3. Send WhatsApp Notification via Meta Cloud API
    const messagePayload = {
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: "text",
      text: {
        body: `Namaste ${patient.name} 🙏\n\nYour appointment at *${clinic.name || "Clinic"}* is confirmed:\n📅 Date: *${appointment.appointment_date}*\n⏰ Time: *${appointment.start_time}*\n\nIf you need to reschedule or ask any question, reply directly to this message.\n\n— *${clinic.name}*`,
      },
    };

    let whatsappResponse = { status: "simulated_success", id: "wamid_demo_" + Date.now() };

    if (metaAccessToken && metaPhoneNumberId) {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${metaPhoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${metaAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        }
      );
      whatsappResponse = await res.json();
    }

    // 4. Mark appointment reminder as sent in Supabase
    await supabase
      .from("appointments")
      .update({
        whatsapp_reminder_sent: true,
        whatsapp_reminder_sent_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    // 5. Insert audit log in whatsapp_logs table
    await supabase.from("whatsapp_logs").insert([
      {
        clinic_id: appointment.clinic_id,
        recipient_phone: recipientPhone,
        message_type: "reminder",
        status: "sent",
        meta_message_id: (whatsappResponse as any).messages?.[0]?.id || (whatsappResponse as any).id,
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        appointment_id: appointmentId,
        recipient: recipientPhone,
        delivery: whatsappResponse,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
