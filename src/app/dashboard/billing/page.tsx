'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ReceiptIndianRupee, 
  Download, 
  BarChart3, 
  Plus, 
  FileText, 
  Send,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const generatePDF = (invoice: any) => {
    const doc = new jsPDF();
    const patient = invoice.appointments?.patients;
    
    // Header Branding
    doc.setFontSize(24);
    doc.setTextColor(124, 58, 237); // Violet-600
    doc.text('ClinicOS', 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Smart Medical Management', 14, 32);

    // Clinic Info (Right Side)
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text('Shah Multispeciality Clinic', 140, 20);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Ambli Road, Ahmedabad, GJ', 140, 25);
    doc.text('GSTIN: 24AAAAA0000A1Z5', 140, 30);
    doc.text('+91 63524 49698', 140, 35);

    // Separator
    doc.setDrawColor(240);
    doc.line(14, 45, 196, 45);

    // Patient & Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('BILL TO:', 14, 55);
    doc.setTextColor(30);
    doc.setFontSize(12);
    doc.text(patient?.name || 'Valued Patient', 14, 62);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(patient?.phone || '', 14, 67);

    doc.setTextColor(100);
    doc.text('INVOICE NO:', 140, 55);
    doc.setTextColor(30);
    doc.text(`#CL-INV-${invoice.id.slice(0, 8).toUpperCase()}`, 140, 62);
    doc.setTextColor(100);
    doc.text('DATE:', 140, 68);
    doc.setTextColor(30);
    doc.text(new Date(invoice.created_at).toLocaleDateString(), 140, 73);

    // Table
    const total = Number(invoice.total);
    const subtotal = (total / 1.18).toFixed(2);
    const gst = (total - Number(subtotal)).toFixed(2);

    (doc as any).autoTable({
      startY: 85,
      head: [['Service Description', 'Amount (INR)']],
      body: [
        ['Medical Consultation & Diagnostic Review', `INR ${subtotal}`],
        ['GST (18% Integrated)', `INR ${gst}`],
      ],
      headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: 'bold' },
      foot: [['Total Payable Amount', `INR ${total}`]],
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
    doc.text('Thank you for trusting ClinicOS. Get well soon!', 14, 280);
    doc.text('Page 1 of 1', 180, 280);

    doc.save(`Invoice_${patient?.name || 'Patient'}.pdf`);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, appointments(appointment_date, patients(name, phone))')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setInvoices(data || []);
    setLoading(false);
  }

  const totalRevenue = invoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Billing & Invoices</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Automated GST compliance and revenue tracking.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all touch-target w-full sm:w-auto"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <BarChart3 size={20} />
            Export Report
          </button>
          <button className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto">
            <Plus size={20} />
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="zynteq-card p-6 md:p-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(108,92,231,0.1)', color: '#6C5CE7' }}>
            <ReceiptIndianRupee size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
          <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>₹{totalRevenue.toLocaleString()}</h3>
          {totalRevenue === 0 ? (
            <p className="text-[10px] font-bold mt-2" style={{ color: 'var(--text-muted)' }}>Complete appointments to track revenue</p>
          ) : (
            <p className="text-[10px] font-black uppercase mt-2 tracking-widest" style={{ color: '#10B981' }}>+18% growth</p>
          )}
        </div>
        <div className="zynteq-card p-6 md:p-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,180,216,0.1)', color: '#00B4D8' }}>
            <FileText size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Invoices Issued</p>
          <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{invoices.length}</h3>
          <p className="text-[10px] font-black uppercase mt-2 tracking-widest" style={{ color: 'var(--text-muted)' }}>100% automated</p>
        </div>
        <div className="p-6 md:p-8 rounded-[2rem] text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #4F46E5)', boxShadow: '0 12px 32px rgba(108,92,231,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Send size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/70">WhatsApp Delivery</p>
          <h3 className="text-3xl font-black italic">Active</h3>
          <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white/70">Bills sent instantly</p>
        </div>
      </div>

      {/* 7-Day Revenue Chart */}
      <div className="zynteq-card p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Revenue Trend</h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Past 7 days performance</p>
          </div>
          {totalRevenue > 0 && (
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest self-start sm:self-auto" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              +12% this week
            </div>
          )}
        </div>
        <div className="flex items-end justify-between h-40 md:h-48 gap-1 md:gap-2 mt-4">
          {[
            { day: 'Mon', amount: 0, height: '4%' },
            { day: 'Tue', amount: 0, height: '4%' },
            { day: 'Wed', amount: 0, height: '4%' },
            { day: 'Thu', amount: 0, height: '4%' },
            { day: 'Fri', amount: 0, height: '4%' },
            { day: 'Sat', amount: 3100, height: '65%', isToday: true },
            { day: 'Sun', amount: 0, height: '4%' },
          ].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3 group h-full">
              <div className="relative w-full flex justify-center h-full items-end">
                <div className="w-full max-w-[2rem] md:max-w-[3rem] rounded-t-xl transition-all" 
                  style={{ height: '100%', background: d.isToday ? 'rgba(108,92,231,0.15)' : 'rgba(255,255,255,0.03)' }}>
                  <div className="absolute bottom-0 w-full max-w-[2rem] md:max-w-[3rem] rounded-t-xl transition-all duration-500 hover:brightness-110" 
                    style={{ height: d.height, background: d.isToday ? '#6C5CE7' : 'rgba(255,255,255,0.1)' }}></div>
                </div>
                <div className="absolute -top-8 text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'var(--bg-app)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                  ₹{d.amount}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: d.isToday ? '#6C5CE7' : 'var(--text-muted)' }}>{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="zynteq-card overflow-hidden min-h-[500px]">
        <div className="p-4 md:p-8 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Billing History</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Search Invoices..." className="w-full sm:w-auto px-4 py-2 border-none rounded-xl text-xs font-bold outline-none touch-target" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold italic">Analyzing revenue data...</div>
        ) : invoices.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6" style={{ background: 'rgba(108,92,231,0.1)', color: '#6C5CE7' }}>
              <ReceiptIndianRupee size={40} />
            </div>
            <h3 className="text-xl font-black mb-3">No Invoices Yet</h3>
            <p className="font-medium mb-8 max-w-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Complete your first appointment to auto-generate your first invoice.
            </p>
            <a href="/dashboard/appointments" className="btn-primary flex items-center gap-2 touch-target">
              Complete an Appointment
              <ChevronRight size={18} />
            </a>
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-5 gap-4 px-8 py-5 border-b text-[10px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <div>ID & Date</div>
              <div>Patient Details</div>
              <div>Total Amount</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="p-4 md:p-0 space-y-3 md:space-y-0">
              {invoices.map((inv, i) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={inv.id} 
                  className="mobile-card-row md:grid md:grid-cols-5 md:gap-4 md:px-8 md:py-5 md:border-b md:rounded-none group transition-all md:items-center"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex justify-between md:block mb-2 md:mb-0">
                    <p className="font-black text-sm md:mb-1" style={{ color: 'var(--text-primary)' }}>#CL-{inv.id.slice(0, 4).toUpperCase()}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="mb-4 md:mb-0">
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{inv.appointments?.patients?.name}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{inv.appointments?.patients?.phone}</p>
                  </div>
                  <div className="flex justify-between items-center md:block mb-4 md:mb-0">
                    <span className="md:hidden text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Amount</span>
                    <div>
                      <p className="font-black text-lg md:leading-none" style={{ color: 'var(--text-primary)' }}>₹{inv.total}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest hidden md:block" style={{ color: '#6C5CE7' }}>Incl. GST</p>
                    </div>
                  </div>
                  <div className="mb-4 md:mb-0 flex md:block">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase w-fit" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      <CheckCircle2 size={12} />
                      Paid
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 md:opacity-40 group-hover:opacity-100 transition-opacity mt-4 md:mt-0 pt-4 md:pt-0" style={{ borderTop: 'md:hidden 1px solid var(--border)' }}>
                    <button onClick={() => generatePDF(inv)} className="p-2.5 md:p-2 rounded-lg transition-all touch-target" style={{ background: 'rgba(108,92,231,0.1)', color: '#6C5CE7' }}>
                      <Download size={18} />
                    </button>
                    <button className="p-2.5 md:p-2 rounded-lg transition-all touch-target" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      <Send size={18} />
                    </button>
                    <button className="p-2.5 md:p-2 rounded-lg transition-all touch-target" style={{ color: 'var(--text-muted)' }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
