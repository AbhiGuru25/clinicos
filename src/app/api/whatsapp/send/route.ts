import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const { phone, message, patient_id, clinic_id } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: 'Missing phone or message' }, { status: 400 });
    }

    const result = await sendWhatsAppMessage({
      phone,
      message,
      patientId: patient_id,
      clinicId: clinic_id
    });

    return NextResponse.json({
      success: true,
      deliveredViaApi: result.deliveredViaApi,
      waWebUrl: result.waWebUrl,
      cleanPhone: result.cleanPhone,
      message: 'WhatsApp message processed'
    });
  } catch (err: any) {
    console.error('[WhatsApp Send API Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
