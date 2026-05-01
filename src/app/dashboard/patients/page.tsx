import { Users, Search, Download } from 'lucide-react';

export default function PatientsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Patients</h1>
          <p className="text-slate-500 font-medium">Full medical history and records for all your patients.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
          <Download size={20} />
          Export Database
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6 mx-auto">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Patient Records EMR</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">
            Your patient list will automatically populate here as they book via WhatsApp. You can add clinical notes to each profile soon.
          </p>
        </div>
      </div>
    </div>
  );
}
