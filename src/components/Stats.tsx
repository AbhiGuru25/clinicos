'use client';
import { motion } from 'framer-motion';

const stats = [
  { 
    value: '4 hrs', 
    label: 'Efficiency Gain Daily', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
  },
  { 
    value: '70%', 
    label: 'Reduced No-Show Rate', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 
  },
  { 
    value: '24/7', 
    label: 'Care Availability', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg> 
  },
  { 
    value: '48 hrs', 
    label: 'Implementation Time', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 
  },
];

export default function Stats() {
  return (
    <section style={{ padding: '40px 0', background: 'white', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                className="font-display" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2px', color: '#0F172A' }}
              >
                {s.value}
              </motion.div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
