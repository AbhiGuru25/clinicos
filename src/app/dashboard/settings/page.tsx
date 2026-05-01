import { Settings, Shield, Bell, MapPin, Clock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clinic Settings</h1>
        <p className="text-slate-500 font-medium">Configure your profile, schedule, and WhatsApp automation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { name: 'Clinic Profile', icon: MapPin, active: true },
            { name: 'Work Hours', icon: Clock, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Security', icon: Shield, active: false },
          ].map((item) => (
            <button 
              key={item.name} 
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                item.active ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-50 pb-4">Clinic Profile</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinic Name</label>
                <input type="text" defaultValue="Sharma Medical Center" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
                <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinic Address</label>
                <textarea defaultValue="123 Medical Plaza, Ahmedabad, Gujarat" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none min-h-[100px]" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
