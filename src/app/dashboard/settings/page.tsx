'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Shield, Bell, MapPin, Clock, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchClinic();
  }, []);

  async function fetchClinic() {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .limit(1)
      .single();

    if (error) console.error(error);
    else setClinic(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('clinics')
      .update({
        name: clinic.name,
        whatsapp_number: clinic.whatsapp_number,
        address: clinic.address,
      })
      .eq('id', clinic.id);

    setSaving(false);
    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Loading clinic profile...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clinic Settings</h1>
          <p className="text-slate-500 font-medium">Configure your profile, schedule, and WhatsApp automation.</p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm border border-emerald-100"
            >
              <CheckCircle2 size={16} />
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
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
          <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-50 pb-4">Clinic Profile</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinic Name</label>
                <input 
                  type="text" 
                  value={clinic?.name || ''} 
                  onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={clinic?.whatsapp_number || ''} 
                  onChange={(e) => setClinic({ ...clinic, whatsapp_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinic Address</label>
                <textarea 
                  value={clinic?.address || ''} 
                  onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none min-h-[120px]" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-2xl font-black hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
