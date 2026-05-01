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
      .select('*')
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Patients</h1>
          <p className="text-slate-500 font-medium">Full medical history and records for all your patients.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        <div className="p-8 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-left">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Phone</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Registered</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={p.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{p.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient ID: {p.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {p.phone}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link 
                        href={`/dashboard/patients/${p.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-sky-600 hover:text-white transition-all"
                      >
                        View Records
                        <ExternalLink size={14} />
                      </Link>
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
