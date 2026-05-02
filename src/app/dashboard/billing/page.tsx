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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Billing & Invoices</h1>
          <p className="text-slate-500 font-medium">Automated GST compliance and revenue tracking.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            <BarChart3 size={20} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100">
            <Plus size={20} />
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
            <ReceiptIndianRupee size={20} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
          {totalRevenue === 0 ? (
            <p className="text-slate-400 text-[10px] font-bold mt-2">Complete appointments to track revenue</p>
          ) : (
            <p className="text-emerald-600 text-[10px] font-black uppercase mt-2 tracking-widest">+18% growth</p>
          )}
        </div>
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Invoices Issued</p>
          <h3 className="text-3xl font-black text-slate-900">{invoices.length}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase mt-2 tracking-widest">100% automated</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-100">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Send size={20} />
          </div>
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1">WhatsApp Delivery</p>
          <h3 className="text-3xl font-black italic">Active</h3>
          <p className="text-indigo-200 text-[10px] font-bold mt-2 uppercase tracking-widest">Bills sent instantly</p>
        </div>
      </div>

      {/* 7-Day Revenue Chart */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trend</h2>
            <p className="text-sm font-medium text-slate-500">Past 7 days performance</p>
          </div>
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-widest">
            +12% this week
          </div>
        </div>
        <div className="flex items-end justify-between h-48 gap-2 mt-4">
          {[
            { day: 'Mon', amount: 1200, height: '40%' },
            { day: 'Tue', amount: 3400, height: '70%' },
            { day: 'Wed', amount: 2100, height: '50%' },
            { day: 'Thu', amount: 4500, height: '85%' },
            { day: 'Fri', amount: 5200, height: '100%' },
            { day: 'Sat', amount: 3100, height: '65%', isToday: true },
            { day: 'Sun', amount: 1800, height: '45%' },
          ].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full">
              <div className="relative w-full flex justify-center h-full items-end">
                <div className={`w-full max-w-[3rem] rounded-t-xl transition-all ${d.isToday ? 'bg-sky-100 group-hover:bg-sky-200' : 'bg-violet-50 group-hover:bg-violet-100'}`} style={{ height: '100%' }}>
                  <div className={`absolute bottom-0 w-full max-w-[3rem] rounded-t-xl transition-all duration-500 ${d.isToday ? 'bg-sky-500 group-hover:bg-sky-600' : 'bg-violet-500 group-hover:bg-violet-600'}`} style={{ height: d.height }}></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  ₹{d.amount}
                </div>
              </div>
              <p className={`text-xs font-black uppercase tracking-widest ${d.isToday ? 'text-sky-600' : 'text-slate-400'}`}>{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Billing History</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Search Invoices..." className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold italic">Analyzing revenue data...</div>
        ) : invoices.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-[2rem] bg-violet-50 flex items-center justify-center text-violet-400 mb-6 shadow-inner border border-violet-100/50">
              <ReceiptIndianRupee size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">No Invoices Yet</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm leading-relaxed">
              Complete your first appointment to auto-generate your first invoice.
            </p>
            <a href="/dashboard/appointments" className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Complete an Appointment
              <ChevronRight size={18} />
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID & Date</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={inv.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 group transition-all"
                  >
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900 text-sm mb-1">#CL-INV-{inv.id.slice(0, 4).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(inv.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-700">{inv.appointments?.patients?.name}</p>
                      <p className="text-xs font-medium text-slate-400">{inv.appointments?.patients?.phone}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900 text-lg">₹{inv.total}</p>
                      <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">Incl. GST</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase w-fit">
                        <CheckCircle2 size={12} />
                        Paid
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => generatePDF(inv)}
                          title="Download PDF" 
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                        >
                          <Download size={20} />
                        </button>
                        <button title="Resend WhatsApp" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Send size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
