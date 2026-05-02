'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Search, Download, ExternalLink, Calendar, Phone, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*, appointments(id)')
      .order('name', { ascending: true });

    if (error) console.error(error);
    else setPatients(data || []);
    setLoading(false);
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>Patients</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Full medical history and records for all your patients.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 touch-target">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="clinic-card overflow-hidden min-h-[600px]">
        <div className="p-4 md:p-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-none rounded-2xl font-bold placeholder:text-slate-400 outline-none touch-target"
              style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Syncing medical records...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6 mx-auto">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Patients Found</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
              {searchQuery ? "No matches for your search." : "Your patient list will populate here as they book via WhatsApp."}
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-8 py-5 border-b text-[10px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <div className="col-span-2">Patient Details</div>
              <div>Phone</div>
              <div className="text-center">Visits</div>
              <div>Registered</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="p-4 md:p-0 space-y-3 md:space-y-0">
              {filteredPatients.map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={p.id} 
                  className="mobile-card-row md:grid md:grid-cols-6 md:gap-4 md:px-8 md:py-5 md:border-b md:rounded-none group transition-all md:items-center"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Patient Details */}
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style={{ background: 'var(--brand-primary)' }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold leading-none mb-1 text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>ID: {p.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    {p.phone}
                  </div>

                  {/* Visits */}
                  <div className="flex items-center md:justify-center gap-2 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                    <span className="md:hidden text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Visits:</span>
                    <div className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg font-bold text-sm" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-primary)' }}>
                      {p.appointments?.length || 0}
                    </div>
                  </div>

                  {/* Registered */}
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={14} className="hidden md:block" style={{ color: 'var(--text-muted)' }} />
                    <span className="md:hidden text-[10px] uppercase font-bold tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Registered:</span>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>

                  {/* Actions */}
                  <div className="flex md:justify-end mt-2 md:mt-0">
                    <Link 
                      href={`/dashboard/patients/${p.id}`}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all touch-target border"
                      style={{ background: 'white', color: 'var(--brand-primary)', borderColor: 'var(--border)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-app)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; }}
                    >
                      View Records
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
