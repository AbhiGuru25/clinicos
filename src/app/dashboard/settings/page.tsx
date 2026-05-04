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
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchClinic();
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  async function fetchClinic() {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) {
        setClinic(data);
        setClinicName(data.name || '');
        setDoctorName(data.doctor_name || '');
        setAddress(data.address || '');
        setPhone(data.whatsapp_number || '');
        setEvolutionUrl(data.evolution_url || '');
        setEvolutionKey(data.evolution_apikey || '');
        setInstanceName(data.evolution_instance || '');
      }
    } catch (err) {
      console.error('Error fetching clinic:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('clinics')
      .update({
        name: clinicName,
        doctor_name: doctorName,
        whatsapp_number: phone,
        address: address,
        evolution_url: evolutionUrl,
        evolution_apikey: evolutionKey,
        evolution_instance: instanceName,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>Clinic Settings</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Configure your profile, schedule, and WhatsApp automation.</p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 right-0 md:static flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm z-10"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <CheckCircle2 size={16} />
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {[
            { name: 'Clinic Profile', icon: MapPin, active: true },
            { name: 'Work Hours', icon: Clock, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Security', icon: Shield, active: false },
          ].map((item) => (
            <button 
              key={item.name} 
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm transition-all whitespace-nowrap touch-target ${
                item.active ? '' : 'hover:bg-white/5'
              }`}
              style={{
                background: item.active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                border: item.active ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                color: item.active ? 'var(--brand-primary)' : 'var(--text-muted)'
              }}
            >
              <item.icon size={20} />
              <span className="hidden sm:inline">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="clinic-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-primary)' }}>
                    <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>Clinic Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>Doctor Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Abhi Virani"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full px-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                      style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>Clinic Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shah Multispeciality Clinic"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                      style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="e.g. 123 SG Highway, Ahmedabad"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                        style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>WhatsApp Number (For Display)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                        style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="clinic-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
                      <Wifi size={20} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>WhatsApp Engine</h2>
                  </div>
                  <div className="px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-wider w-fit" 
                    style={{ 
                      background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                      color: isConnected ? '#10B981' : '#F59E0B' 
                    }}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    {isConnected ? 'Active' : 'Setup Required'}
                  </div>
                </div>

                {!isConnected && (
                  <div className="rounded-2xl p-5 mb-6 shadow-sm" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚡</span>
                      <h3 className="font-bold text-brand-primary">Quick Setup — Takes 5 minutes</h3>
                    </div>
                    <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Your WhatsApp automation is one connection away from going live for your patients.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>1</div>
                        <p className="text-sm font-medium pt-0.5" style={{ color: 'var(--text-primary)' }}>Enter your Evolution API URL</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>2</div>
                        <p className="text-sm font-medium pt-0.5" style={{ color: 'var(--text-primary)' }}>Enter your Secret Key</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>3</div>
                        <p className="text-sm font-medium pt-0.5" style={{ color: 'var(--text-primary)' }}>Click Test Connection</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>Evolution API URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="https://evolution.yourdomain.com"
                        value={evolutionUrl}
                        onChange={(e) => setEvolutionUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                        style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>API Global Key</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
                        <input 
                          type="password" 
                          placeholder="Secret Key"
                          value={evolutionKey}
                          onChange={(e) => setEvolutionKey(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                          style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>Instance Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ClinicOS"
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                        className="w-full px-4 py-3 border-none rounded-xl font-bold outline-none touch-target"
                        style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsConnected(!isConnected)}
                    className="w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all touch-target"
                    style={{ background: isConnected ? 'rgba(239,68,68,0.1)' : 'var(--bg-app)', color: isConnected ? '#FCA5A5' : 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    {isConnected ? 'Disconnect Engine' : 'Test Connection'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 pb-20 md:pb-4">
              <button 
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center justify-center gap-2 touch-target w-full md:w-auto disabled:opacity-50"
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
