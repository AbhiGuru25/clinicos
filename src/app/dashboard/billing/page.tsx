import { ReceiptIndianRupee, Download, BarChart3, Plus } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Billing & Invoices</h1>
          <p className="text-slate-500 font-medium">Manage patient payments and generate GST-compliant invoices.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-100">
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Revenue</p>
          <h3 className="text-3xl font-black text-slate-900">₹4,28,450</h3>
          <p className="text-emerald-600 text-sm font-bold mt-2">+14% vs last month</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Pending Payments</p>
          <h3 className="text-3xl font-black text-slate-900">₹12,800</h3>
          <p className="text-slate-400 text-sm font-medium mt-2">from 4 patient visits</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center border-dashed">
          <button className="text-sm font-bold text-violet-600 flex items-center gap-2">
            <BarChart3 size={18} />
            View Revenue Breakdown
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Invoices</h2>
          <button className="text-sm font-bold text-slate-500">Filters</button>
        </div>

        <div className="p-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 mx-auto">
            <ReceiptIndianRupee size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Auto-Invoicing Active</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">
            ClinicOS automatically generates GST invoices when a visit is marked completed. You can manually create and send them here as well.
          </p>
        </div>
      </div>
    </div>
  );
}
