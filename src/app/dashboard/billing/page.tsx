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
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, appointments(patients(name))')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setInvoices(data || []);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Billing & Invoices</h1>
          <p className="text-slate-500 font-medium">Manage patient payments and generate GST-compliant invoices.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 scale-100 hover:scale-105">
          <Plus size={20} />
          Create Manual Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-50 rounded-full blur-3xl group-hover:bg-sky-100 transition-colors" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Revenue</p>
          <h3 className="text-3xl font-black text-slate-900">₹{invoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0).toLocaleString()}</h3>
          <p className="text-emerald-600 text-sm font-bold mt-2">+14% vs last month</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Invoices Generated</p>
          <h3 className="text-3xl font-black text-slate-900">{invoices.length}</h3>
          <p className="text-slate-400 text-sm font-medium mt-2">Automated by ClinicOS Engine</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200 flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Growth Tip</p>
          <p className="font-bold text-sm leading-relaxed">Automated WhatsApp billing reduces payment delays by 40%.</p>
          <button className="text-xs font-black text-sky-400 uppercase tracking-widest mt-4 hover:text-sky-300">Learn More →</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs">All</button>
            <button className="px-4 py-2 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-50">Paid</button>
            <button className="px-4 py-2 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-50">Pending</button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Fetching billing logs...</div>
        ) : invoices.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 mx-auto">
              <ReceiptIndianRupee size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Invoices Yet</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
              Invoices will appear here once you mark an appointment as "Completed".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
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
                    className="border-b border-slate-50 hover:bg-slate-50/50"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-violet-600" />
                        <span className="font-bold text-slate-900">#INV-{inv.id.slice(0, 5).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600">{inv.appointments?.patients?.name}</td>
                    <td className="px-8 py-5 font-black text-slate-900">₹{inv.total}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Paid</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-sky-600"><Download size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600"><Send size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-slate-900"><MoreHorizontal size={18} /></button>
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
