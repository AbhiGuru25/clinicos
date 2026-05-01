'use client';
import { motion } from 'framer-motion';

const items = [
  'AI Appointment Booking',
  'WhatsApp Reminders',
  'Auto GST Billing',
  'No-Show Reduction',
  'Daily Reports',
  '24/7 Patient Support',
  'Zero App Downloads',
  '48-Hour Setup'
];

export default function Marquee() {
  return (
    <div style={{ background: '#0369A1', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ display: 'flex', gap: '60px', alignItems: 'center' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {item} <span style={{ opacity: 0.4 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
