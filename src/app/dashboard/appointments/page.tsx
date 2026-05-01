import { Calendar, Filter, Plus } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Appointments</h1>
          <p className="text-slate-500 font-medium">Manage your clinic schedule and visit statuses.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100">
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[400px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">
            <Calendar size={18} />
            Week View
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 cursor-pointer">
            <Filter size={18} />
            Filter
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <Calendar size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Calendar View Coming Soon</h3>
          <p className="text-slate-400 font-medium max-w-sm">
            We are integrating a full drag-and-drop calendar for easier scheduling. Use the Overview tab for today's visits.
          </p>
        </div>
      </div>
    </div>
  );
}
