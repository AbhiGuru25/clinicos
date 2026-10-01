import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxvcdrverdwhxccyluz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeHZjZHJ2ZXJkd2h4Y2N5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2Nzg0MywiZXhwIjoyMDkzMTQzODQzfQ.J4YGOOEPLY7reYhS5OLlY7K-Vv8v_w1lrGNhFp0tMUk';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

function sanitizeNameForPdf(name: string): string {
  if (!name) return 'Valued Patient';
  // If string contains non-ASCII (Gujarati/Hindi), convert or fallback cleanly to ASCII
  const clean = name.replace(/[^\x00-\x7F]/g, '').trim();
  if (clean.length > 0) return clean;
  return 'Valued Patient';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Missing invoice id' }, { status: 400 });
    }

    // Fetch invoice from database
    const { data: inv, error } = await supabaseAdmin
      .from('invoices')
      .select('*, appointments(appointment_date, notes, status, patients(id, name, phone))')
      .eq('id', invoiceId)
      .single();

    if (error || !inv) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const doc = new jsPDF();
    const rawPatientName = inv.appointments?.patients?.name || inv.patient_name || 'Valued Patient';
    const patientName = sanitizeNameForPdf(rawPatientName);
    const patientPhone = inv.appointments?.patients?.phone || inv.phone_number || '';

    // Header Branding
    doc.setFontSize(24);
    doc.setTextColor(124, 58, 237); // Violet-600
    doc.text('ClinicOS  |  by Zynteq', 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Smart Medical Management', 14, 32);

    // Clinic Info (Right Side)
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text('KK Neuro Vision Therapy Institute', 140, 20);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Healthcare Hub, Near Circle, Ahmedabad, GJ', 140, 25);
    doc.text('GSTIN: 24AAAAA0000A1Z5', 140, 30);
    doc.text('+91 95588 55508', 140, 35);

    // Separator
    doc.setDrawColor(240);
    doc.line(14, 45, 196, 45);

    // Patient & Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('BILL TO:', 14, 55);
    doc.setTextColor(30);
    doc.setFontSize(12);
    doc.text(patientName, 14, 62);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(patientPhone, 14, 67);

    doc.setTextColor(100);
    doc.text('INVOICE NO:', 140, 55);
    doc.setTextColor(30);
    doc.text(`#CL-INV-${inv.id.slice(0, 8).toUpperCase()}`, 140, 62);
    doc.setTextColor(100);
    doc.text('DATE:', 140, 68);
    doc.setTextColor(30);
    doc.text(new Date(inv.created_at).toLocaleDateString('en-IN'), 140, 73);

    // Table
    const total = Number(inv.total);
    const subtotal = inv.amount ? Number(inv.amount) : (total / 1.18);
    const gst = inv.gst_amount ? Number(inv.gst_amount) : (total - subtotal);

    (doc as any).autoTable({
      startY: 85,
      head: [['Service Description', 'Amount (INR)']],
      body: [
        ['Medical Consultation & Vision Therapy Review', `INR ${subtotal.toFixed(2)}`],
        ['GST Tax (Integrated 18%)', `INR ${gst.toFixed(2)}`],
      ],
      headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: 'bold' },
      foot: [['Total Payable Amount', `INR ${total.toFixed(2)}`]],
      footStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
      theme: 'grid',
    });

    // Signatures
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.text('Authorized Signatory', 140, finalY + 40);
    doc.line(140, finalY + 35, 190, finalY + 35);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for trusting KK Neuro Vision Therapy Institute. Get well soon!', 14, 280);
    doc.text('Page 1 of 1', 180, 280);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice_${inv.id.slice(0, 6)}.pdf"`
      }
    });
  } catch (err: any) {
    console.error('Invoice PDF API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
