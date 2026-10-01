'use client';
import { motion } from 'framer-motion';

// Honest capability strip — what the product does, not measured outcomes.
const stats = [
  {
    value: '24/7',
    label: 'WhatsApp Booking Line',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E7C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  },
  {
    value: '1-click',
    label: 'GST Invoices on WhatsApp',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E7C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    value: 'Live',
    label: 'OPD Queue, No Refresh',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E7C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  {
    value: '0',
    label: 'Apps Patients Must Install',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  },
];

export default function Stats() {
  return (
    <section style={{ padding: '40px 0', background: 'transparent', borderTop: '1px dashed #C9C0AC', borderBottom: '1px dashed #C9C0AC' }}>
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
                className="font-display" style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '2px', color: '#1A2B3C' }}
              >
                {s.value}
              </motion.div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#5B6B7B', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
