'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  CheckCircle2,
  Search,
  X,
  CreditCard,
  Building,
  TrendingUp,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Quick Bill Form State
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [fee, setFee] = useState('800');
  const [gstRate, setGstRate] = useState('18');
  const [notes, setNotes] = useState('Consultation & Vision Therapy');

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
        if (clinic) setClinicId(clinic.id);
        fetchInvoices();
      } catch (err) {
        console.error('Init error:', err);
        setLoading(false);
      }
    };
    init();

    // Realtime subscription for live billing updates without refresh
    const channel = supabase
      .channel('realtime-billing-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchInvoices())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchInvoices())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchInvoices())
      .subscribe();

    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => {
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        if (data.success && data.patients) {
          const filtered = data.patients.filter((p: any) =>
            (p.name || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
            (p.phone || '').includes(patientSearch)
          ).slice(0, 5);
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };
    const timer = setTimeout(searchPatients, 300);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  async function fetchInvoices() {
    try {
      const res = await fetch('/api/billing');
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateDirectInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please search and select a patient first.');
      return;
    }
    setCreating(true);
    try {
      const feeNum = Number(fee);
      const gstAmt = (feeNum * Number(gstRate)) / 100;
      const totalAmt = feeNum + gstAmt;

      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinicId,
          patient_id: selectedPatient.id,
          amount: feeNum,
          consultation_fee: feeNum,
          gst_rate: Number(gstRate),
          total_amount: totalAmt,
          status: 'paid'
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to create invoice.');
      } else {
        alert('✅ Invoice Generated Successfully!');
        setIsModalOpen(false);
        setPatientSearch('');
        setSelectedPatient(null);
        fetchInvoices();
      }
    } catch (err: any) {
      alert(`Invoice Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const search = searchQuery.toLowerCase();
    const patientName = (inv.appointments?.patients?.name || inv.patient_name || '').toLowerCase();
    const invoiceId = `CL-${inv.id.slice(0, 4).toUpperCase()}`.toLowerCase();
    return patientName.includes(search) || invoiceId.includes(search);
  });

  const totalRevenue = invoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalGst = invoices.reduce((acc, curr) => acc + (Number(curr.gst_amount) || 0), 0);

  // Dynamic 7-day chart calculations
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = past7Days.map(dateObj => {
    const dateStr = dateObj.toISOString().split('T')[0];
    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    const dayTotal = invoices
      .filter(inv => inv.created_at?.startsWith(dateStr))
      .reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);

    const maxRev = Math.max(...past7Days.map(d => {
      const dStr = d.toISOString().split('T')[0];
      return invoices.filter(inv => inv.created_at?.startsWith(dStr)).reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    }), 1000);

    const heightPct = Math.max(10, Math.round((dayTotal / maxRev) * 100));

    return {
      day: dayLabel,
      amount: dayTotal,
      height: `${heightPct}%`,
      isToday
    };
  });

  const exportCSV = () => {
    const headers = ['Invoice ID', 'Date', 'Patient Name', 'Phone', 'Subtotal', 'GST', 'Total Amount', 'Status'];
    const rows = filteredInvoices.map(inv => [
      `CL-${inv.id.slice(0, 8).toUpperCase()}`,
      new Date(inv.created_at).toLocaleDateString(),
      `"${inv.appointments?.patients?.name || inv.patient_name || 'Patient'}"`,
      `"${inv.appointments?.patients?.phone || inv.phone_number || 'N/A'}"`,
      inv.amount || (inv.total / 1.18).toFixed(2),
      inv.gst_amount || (inv.total - inv.total / 1.18).toFixed(2),
      inv.total,
      'Paid'
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `clinic_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendWhatsApp = async (inv: any) => {
    try {
      const patientName = (inv.appointments?.patients?.name || inv.patient_name || 'Valued Patient').trim();
      const rawPhone = inv.appointments?.patients?.phone || inv.phone_number;
      if (!rawPhone) {
        alert("Patient does not have a phone number on file.");
        return;
      }
      
      const invCode = `CL-${inv.id.slice(0, 6).toUpperCase()}`;
      const totalAmt = Number(inv.total).toFixed(2);
      const pdfUrl = `${window.location.origin}/api/billing/pdf?id=${inv.id}`;
      
      const message = `Hello *${patientName}*! 👋\n\nYour official GST Invoice *#${invCode}* for *₹${totalAmt}* at *KK Neuro Vision Therapy Institute* has been generated.\n\n📄 *Invoice Details:*\n• Invoice ID: #${invCode}\n• Total Amount: ₹${totalAmt} (Incl. 18% GST)\n• Clinic: KK Neuro Vision Therapy Institute, Ahmedabad.\n\n📥 *Download Official Invoice PDF:*\n${pdfUrl}\n\nThank you for visiting KK Neuro Vision Therapy Institute! 🙏`;
      
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: rawPhone,
          message: message,
          patient_id: inv.patient_id || inv.appointments?.patients?.id,
          clinic_id: clinicId
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.deliveredViaApi) {
          alert(`✅ Invoice & PDF Link Sent Live via WhatsApp to ${patientName}!`);
        } else {
          window.open(data.waWebUrl, '_blank');
        }
      } else {
        alert(data.error || 'Failed to send WhatsApp invoice.');
      }
    } catch (err: any) {
      const rawPhone = inv.appointments?.patients?.phone || inv.phone_number || '';
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const invCode = `CL-${inv.id.slice(0, 6).toUpperCase()}`;
      const pdfUrl = `${window.location.origin}/api/billing/pdf?id=${inv.id}`;
      const message = `Hello *${inv.patient_name || 'Patient'}*! 👋\n\nYour official GST Invoice *#${invCode}* for *₹${inv.total}* at *KK Neuro Vision Therapy Institute* has been generated.\n\n📥 Download Invoice PDF:\n${pdfUrl}`;
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const generatePDF = (invoice: any) => {
    const doc = new jsPDF();
    const patientName = invoice.appointments?.patients?.name || invoice.patient_name || 'Valued Patient';
    const patientPhone = invoice.appointments?.patients?.phone || invoice.phone_number || '';
    
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
    doc.text(`#CL-INV-${invoice.id.slice(0, 8).toUpperCase()}`, 140, 62);
    doc.setTextColor(100);
    doc.text('DATE:', 140, 68);
    doc.setTextColor(30);
    doc.text(new Date(invoice.created_at).toLocaleDateString('en-IN'), 140, 73);

    // Table
    const total = Number(invoice.total);
    const subtotal = invoice.amount ? Number(invoice.amount) : (total / 1.18);
    const gst = invoice.gst_amount ? Number(invoice.gst_amount) : (total - subtotal);

    (doc as any).autoTable({
      startY: 85,
      head: [['Service Description', 'Amount (INR)']],
      body: [
        ['Medical Consultation & Vision Therapy Review', `INR ${subtotal.toFixed(2)}`],
        ['GST Tax (Integrated)', `INR ${gst.toFixed(2)}`],
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

    doc.save(`Invoice_${patientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Billing & Invoices
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Automated GST invoices, billing records, and revenue insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV} 
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 touch-target"
          >
            <BarChart3 size={16} />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center justify-center gap-2 touch-target shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            <span>+ Quick Bill</span>
          </button>
        </div>
      </div>

      {/* ─── Financial Stat Overview Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <ReceiptIndianRupee size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Revenue</p>
            <p className="text-xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Invoices Issued</p>
            <p className="text-xl font-extrabold text-blue-600">{invoices.length}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
            <Percent size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">GST Collected</p>
            <p className="text-xl font-extrabold text-purple-600">₹{totalGst.toFixed(0)}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <Send size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">WhatsApp Delivery</p>
            <p className="text-xl font-extrabold text-amber-600">100% Active</p>
          </div>
        </div>
      </div>

      {/* ─── 7-Day Revenue Trend Chart ─── */}
      <div className="clinic-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Past 7 Days Revenue Trend
            </h2>
            <p className="text-xs font-medium text-slate-400">Daily collection performance for KK Neuro Vision Therapy Institute</p>
          </div>
        </div>

        <div className="flex items-end justify-between h-36 md:h-44 gap-2 pt-4 border-t border-slate-100">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
              <div className="relative w-full flex justify-center h-full items-end">
                <div 
                  className="w-full max-w-[2.5rem] rounded-t-xl transition-all duration-500 relative"
                  style={{ 
                    height: d.height, 
                    background: d.isToday ? 'linear-gradient(to top, #2563eb, #3b82f6)' : '#cbd5e1' 
                  }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    ₹{d.amount}
                  </div>
                </div>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${d.isToday ? 'text-blue-600' : 'text-slate-400'}`}>{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Invoices History Table ─── */}
      <div className="clinic-card overflow-hidden min-h-[450px]">
        {/* Search Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search invoice # or patient name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Showing <span className="font-extrabold text-slate-800">{filteredInvoices.length}</span> invoice(s)
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
            Loading invoice database...
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl m-6 bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 mx-auto font-bold">
              <ReceiptIndianRupee size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No Invoices Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              {searchQuery ? "No matches for your search query." : "Invoices auto-generate when you complete patient visits."}
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs inline-flex items-center gap-2">
              <Plus size={16} /> Create Quick Bill
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <div className="col-span-3">Invoice ID & Date</div>
              <div className="col-span-4">Patient Name & Phone</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredInvoices.map((inv, i) => {
                const patientName = inv.appointments?.patients?.name || inv.patient_name || 'Patient';
                const patientPhone = inv.appointments?.patients?.phone || inv.phone_number || 'N/A';
                const invId = `CL-${inv.id.slice(0, 6).toUpperCase()}`;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={inv.id} 
                    className="p-4 md:px-6 md:py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50/80 transition-all group"
                  >
                    {/* Invoice ID & Date */}
                    <div className="md:col-span-3">
                      <p className="font-extrabold text-slate-900 text-sm">{invId}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>

                    {/* Patient Details */}
                    <div className="md:col-span-4 mt-2 md:mt-0">
                      <p className="font-extrabold text-slate-800 text-sm">{patientName}</p>
                      <p className="text-xs font-medium text-slate-500">{patientPhone}</p>
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-2 mt-2 md:mt-0 md:text-right">
                      <p className="font-extrabold text-slate-900 text-base">₹{Number(inv.total).toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incl. 18% GST</p>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-1 mt-2 md:mt-0 flex md:justify-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 size={11} /> Paid
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 mt-3 md:mt-0 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => generatePDF(inv)} 
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-blue-100 shadow-sm"
                        title="Download Invoice PDF"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </button>
                      <button 
                        onClick={() => sendWhatsApp(inv)} 
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-emerald-100 shadow-sm"
                        title="Send via WhatsApp"
                      >
                        <Send size={13} />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Quick Bill Modal (React Portal) ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Full Screen Viewport Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)} 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 15 }} 
                className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/30 overflow-hidden z-10"
              >
                {/* Header */}
                <div className="p-6 md:p-7 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-white flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                      <ReceiptIndianRupee size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Direct Invoice</h2>
                      <p className="text-xs font-semibold text-slate-500">KK Neuro Vision Therapy Institute</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all border border-transparent hover:border-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleCreateDirectInvoice} className="p-6 md:p-7 space-y-4">
                  {/* Search Patient */}
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Select Patient</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search patient name..." 
                        value={selectedPatient ? selectedPatient.name : patientSearch} 
                        onChange={e => { setSelectedPatient(null); setPatientSearch(e.target.value); }} 
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" 
                      />
                    </div>
                    {searchResults.length > 0 && !selectedPatient && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                        {searchResults.map(p => (
                          <div key={p.id} onClick={() => { setSelectedPatient(p); setSearchResults([]); }} className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-xs font-bold border-b border-slate-100 last:border-none">
                            <span className="text-slate-900">{p.name}</span>
                            <span className="text-slate-500">{p.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Consultation Fee (₹)</label>
                    <input type="number" required value={fee} onChange={e => setFee(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black text-lg text-slate-900 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">GST Tax Rate (%)</label>
                    <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900">
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST (Standard)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{fee}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>GST ({gstRate}%):</span>
                      <span>₹{((Number(fee) * Number(gstRate)) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-blue-700 pt-2 border-t border-blue-200/60">
                      <span>Total Payable:</span>
                      <span>₹{(Number(fee) + (Number(fee) * Number(gstRate)) / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" disabled={creating} className="w-1/2 btn-primary text-xs py-3 font-extrabold shadow-lg shadow-blue-500/25">{creating ? 'Generating...' : 'Generate Invoice'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
