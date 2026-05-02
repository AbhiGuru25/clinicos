'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Activity, 
  Settings as SettingsIcon, 
  Save, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Smartphone,
  Key,
  Globe,
  Wifi,
  Shield, 
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [clinic, setClinic] = useState<any>(null);
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [evolutionUrl, setEvolutionUrl] = useState('');
  const [evolutionKey, setEvolutionKey] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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

    if (data) {
      setClinic(data);
      setClinicName(data.name || '');
      setAddress(data.address || '');
      setPhone(data.whatsapp_number || '');
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('clinics')
      .update({
        name: clinicName,
        whatsapp_number: phone,
        address: address,
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
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

        <div className="md:col-span-3 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinic Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Name</label>
                    <input 
                      type="text" 
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number (For Display)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wifi size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">WhatsApp Engine</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isConnected ? 'Active' : 'Setup Required'}
                  </div>
                </div>

                {!isConnected && (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚡</span>
                      <h3 className="font-bold text-indigo-900">Quick Setup — Takes 5 minutes</h3>
                    </div>
                    <p className="text-sm font-medium text-indigo-700/80 mb-4">
                      Your WhatsApp automation is one connection away from going live for your patients.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 border border-indigo-100 shadow-sm">1</div>
                        <p className="text-sm font-medium text-indigo-900 pt-0.5">Enter your Evolution API URL</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 border border-indigo-100 shadow-sm">2</div>
                        <p className="text-sm font-medium text-indigo-900 pt-0.5">Enter your Secret Key</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 border border-indigo-100 shadow-sm">3</div>
                        <p className="text-sm font-medium text-indigo-900 pt-0.5">Click Test Connection</p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-indigo-100/50">
                      <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                        Need help? Watch 2-min setup video
                      </a>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evolution API URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="https://evolution.yourdomain.com"
                        value={evolutionUrl}
                        onChange={(e) => setEvolutionUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Global Key</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="password" 
                          placeholder="Secret Key"
                          value={evolutionKey}
                          onChange={(e) => setEvolutionKey(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instance Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ClinicOS"
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsConnected(!isConnected)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                  >
                    {isConnected ? 'Disconnect Engine' : 'Test Connection'}
                  </button>
                </div>
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
