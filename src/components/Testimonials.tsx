'use client';
import { motion } from 'framer-motion';

// Honest pilot positioning — no invented clinics, no invented numbers.
const points = [
  {
    title: 'Your real OPD, week one',
    desc: 'We onboard one doctor and one queue first. You keep your paper register alongside until the team trusts the screen.',
    icon: '🩺',
  },
  {
    title: 'Your number, your patients',
    desc: 'Bookings happen on the WhatsApp number patients already know. Nothing new to download, nothing new to remember.',
    icon: '💬',
  },
  {
    title: 'You keep your data',
    desc: 'Patient lists and invoices export to CSV any time. If you ever leave, everything goes with you.',
    icon: '📂',
  }
];

export default function Testimonials() {
  return (
    <section style={{ padding: '100px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Pilot Program
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '16px' }}>
            Try it on your OPD <span style={{ color: '#0E7C6B' }}>before you trust it.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#5B6B7B', maxWidth: '520px', margin: '0 auto' }}>
            We are onboarding pilot clinics in Ahmedabad right now. No tall claims — run it next to your current system and judge the difference yourself.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {points.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: '#FFFDF8', borderRadius: '14px', border: '1px solid #E3DDCF', boxShadow: '3px 3px 0 rgba(26,43,60,0.08)' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '20px' }}>{t.icon}</div>
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1A2B3C', marginBottom: '10px' }}>{t.title}</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#5B6B7B' }}>
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
