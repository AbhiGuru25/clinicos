'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import BackgroundDecor from '@/components/BackgroundDecor';

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(name, phone)')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) console.error('Error fetching appointments:', error);
      else setAppointments(data || []);
      setLoading(false);
    }

    fetchAppointments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main style={{ minHeight: '100vh', padding: '40px 24px', position: 'relative' }}>
      <BackgroundDecor />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0369A1' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 900 }}>Clinic<span style={{ color: '#0369A1' }}>OS</span></span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>Doctor Console</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Welcome back,</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0369A1' }}>Dr. Rahul Sharma</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Today Appointments', value: appointments.length, color: '#0369A1', bg: '#F0F9FF' },
            { label: 'Pending Confirms', value: appointments.filter(a => a.status === 'pending').length, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Completed', value: '0', color: '#0D9488', bg: '#F0FDF4' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '24px', borderRadius: '16px', background: stat.bg, border: '1px solid rgba(0,0,0,0.02)' }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Appointments Table */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', color: '#1E293B' }}>Upcoming Visits</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Loading clinical data...</div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
              No appointments booked yet. 
              <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Waiting for WhatsApp messages...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appointments.map((a, i) => (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid #F8FAFC', background: '#F8FAFC' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#0369A1', border: '1px solid #E2E8F0' }}>
                      {a.patients?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>{a.patients?.name || 'Unknown Patient'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{a.patients?.phone}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{a.appointment_time}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{a.appointment_date}</div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                    background: a.status === 'confirmed' ? '#F0FDF4' : '#FFFBEB',
                    color: a.status === 'confirmed' ? '#166534' : '#D97706'
                  }}>
                    {a.status}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Powered by <strong>ClinicOS Engine</strong> · Real-time WhatsApp sync active
          </p>
        </div>
      </div>
    </main>
  );
}
