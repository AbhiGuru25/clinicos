'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Download, 
  ExternalLink, 
  Calendar, 
  Phone, 
  Activity,
  UserPlus,
  MessageSquare,
  X,
  UserCheck,
  Filter
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function PatientsPage() {
  const [mounted, setMounted] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clinicId, setClinicId] = useState<string | null>(null);

  // New Patient Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        const { data: clinic } = await supabase.from('clinics').select('id').limit(1).single();
        if (clinic) setClinicId(clinic.id);
        fetchPatients();
      } catch (err) {
        console.error('Init error:', err);
        setLoading(false);
      }
    };
    init();

    // Live Realtime listener for zero-refresh updates
    const channel = supabase
      .channel('realtime-patients-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchPatients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchPatients())
      .subscribe();

    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => {
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinicId,
          name,
          phone,
          gender,
          age,
          medical_notes: notes
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(`Registration Error: ${data.error}`);
      } else {
        alert('✅ New Patient Registered Successfully!');
        setIsModalOpen(false);
        setName('');
        setPhone('');
        setAge('');
        setNotes('');
        fetchPatients();
      }
    } catch (err: any) {
      alert(`Registration Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone || '').includes(searchQuery) ||
    (p.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick Stats
  const totalPatients = patients.length;
  const repeatPatients = patients.filter(p => (p.appointments?.length || 0) > 1).length;
  const newThisMonth = patients.filter(p => {
    if (!p.created_at) return false;
    const d = new Date(p.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const exportCSV = () => {
    const headers = ['Patient ID', 'Name', 'Phone', 'Gender', 'Age', 'Registered Date', 'Total Visits'];
    const rows = filteredPatients.map(p => [
      p.id,
      `"${p.name || ''}"`,
      `"${p.phone || ''}"`,
      p.gender || 'N/A',
      p.age || 'N/A',
      p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A',
      p.appointments?.length || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `patients_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
            Patients Directory
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Medical records, vision therapy history &amp; patient database
          </p>

        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV} 
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 touch-target"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center justify-center gap-2 touch-target shadow-lg shadow-blue-500/20"
          >
            <UserPlus size={18} />
            <span>+ Register Patient</span>
          </button>
        </div>
      </div>

      {/* ─── Patient Metrics Bar ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Patients</p>
            <p className="text-xl font-extrabold text-slate-900">{totalPatients}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">New This Month</p>
            <p className="text-xl font-extrabold text-emerald-600">{newThisMonth}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Repeat Patients</p>
            <p className="text-xl font-extrabold text-purple-600">{repeatPatients}</p>
          </div>
        </div>

        <div className="clinic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">WhatsApp AI</p>
            <p className="text-xl font-extrabold text-amber-600">Active</p>
          </div>
        </div>

      </div>

      {/* ─── Search & Patient Table Card ─── */}
      <div className="clinic-card overflow-hidden min-h-[550px]">
        {/* Search Bar Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patient by name, mobile, or ID..." 
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
            Showing <span className="font-extrabold text-slate-800">{filteredPatients.length}</span> patient record(s)
          </p>
        </div>

        {/* Patients Table Container */}
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
            Syncing medical database...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl m-6 bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 mx-auto font-bold">
              <Users size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No Patients Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              {searchQuery ? "No matches for your search query." : "Your patient directory will populate automatically when patients book."}
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs inline-flex items-center gap-2">
              <UserPlus size={16} /> Register First Patient
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="min-w-[650px] md:min-w-full">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <div className="col-span-4">Patient Information</div>
                <div className="col-span-3">Contact Details</div>
                <div className="col-span-2 text-center">Visits</div>
                <div className="col-span-2">Registered On</div>
                <div className="col-span-1 text-right">Records</div>
              </div>

            {/* Rows List */}
            <div className="divide-y divide-slate-100">
              {filteredPatients.map((p, i) => {
                const pPhone = p.phone || '';
                const cleanPhone = pPhone.replace(/[^0-9]/g, '');

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={p.id} 
                    className="p-4 md:px-6 md:py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50/80 transition-all group"
                  >
                    {/* Patient Name & Avatar */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-blue-500/20 shrink-0">
                        {(p.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Link 
                          href={`/dashboard/patients/${p.id}`} 
                          className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors flex items-center gap-1.5 group/link"
                          title="View Full Medical File"
                        >
                          <span>{p.name || 'Unnamed Patient'}</span>
                          <ExternalLink size={12} className="text-slate-400 group-hover/link:text-blue-600 transition-colors" />
                        </Link>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {p.id.slice(0, 8)}</p>
                      </div>
                    </div>

                    {/* Contact Info & Direct Actions */}
                    <div className="md:col-span-3 mt-2 md:mt-0 flex items-center justify-between md:justify-start gap-3">
                      <span className="text-xs font-semibold text-slate-600">{pPhone || 'No Phone'}</span>
                      {cleanPhone && (
                        <div className="flex items-center gap-2">
                          <a 
                            href={`tel:${cleanPhone}`} 
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-bold flex items-center gap-1"
                            title="Call Patient"
                          >
                            <Phone size={12} />
                          </a>
                          <a 
                            href={`https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all text-xs font-bold flex items-center gap-1"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Total Visits Pill */}
                    <div className="md:col-span-2 mt-2 md:mt-0 text-center">
                      <Link 
                        href={`/dashboard/patients/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold hover:bg-blue-100 transition-all"
                      >
                        <Activity size={12} />
                        <span>{p.appointments?.length || 0} Visit(s)</span>
                      </Link>
                    </div>

                    {/* Registered Date */}
                    <div className="md:col-span-2 mt-2 md:mt-0 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>

                    {/* Records & Actions */}
                    <div className="md:col-span-1 mt-3 md:mt-0 flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/patients/${p.id}`} 
                        className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
                      >
                        <span>File</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* ─── Register New Patient Modal (React Portal) ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Full Screen Backdrop */}
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
                className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/30 overflow-hidden z-10"
              >
                {/* Header */}
                <div className="p-6 md:p-7 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-white flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                      <UserPlus size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Register New Patient</h2>
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

                {/* Form */}
                <form onSubmit={handleRegisterPatient} className="p-6 md:p-7 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Patient Full Name</label>
                    <input required type="text" placeholder="e.g. Vikram Shah" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Mobile Phone</label>
                      <input required type="tel" placeholder="e.g. 9825012345" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Age (Years)</label>
                    <input type="number" placeholder="e.g. 28" value={age} onChange={e => setAge(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Initial Medical / Vision Therapy Notes</label>
                    <input type="text" placeholder="e.g. Referred for Amblyopia evaluation" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-semibold outline-none text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900" />
                  </div>

                  <div className="pt-3 flex items-center gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" disabled={saving} className="w-1/2 btn-primary text-xs py-3 font-extrabold shadow-lg shadow-blue-500/25">{saving ? 'Registering...' : 'Save Patient Record'}</button>
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
