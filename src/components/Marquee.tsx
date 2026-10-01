'use client';
import { motion } from 'framer-motion';

const items = [
  'WhatsApp Appointment Booking',
  'Automatic Reminders',
  'Live OPD Queue',
  'GST Billing & Invoices',
  'Patient Files & Visit History',
  'Medical Document Uploads',
  'Zero App Downloads',
  'Guided Setup in Days',
];

export default function Marquee() {
  return (
    <div style={{ background: '#0B3530', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', borderTop: '1px solid #155E54', borderBottom: '1px solid #155E54' }}>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ display: 'flex', gap: '60px', alignItems: 'center' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ color: '#FFFDF8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {item} <span style={{ color: '#F5C518', opacity: 0.9 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
