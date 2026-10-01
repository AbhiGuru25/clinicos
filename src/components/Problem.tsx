'use client';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: '📞',
    title: 'Missed Calls Walk Away',
    desc: "Your receptionist can't answer every call during OPD hours. Every unanswered call is a patient who books elsewhere.",
    foot: 'Calls you never see',
  },
  {
    icon: '🪑',
    title: 'Empty Slots Earn Nothing',
    desc: 'Patients forget appointments. Without automatic reminders, chairs sit empty while the waiting list stays on paper.',
    foot: 'Chairs sitting empty',
  },
  {
    icon: '📋',
    title: 'Paper Registers Don\u2019t Scale',
    desc: 'Handwritten bills, registers and follow-ups eat into consultation time — and GST mistakes are stressful to fix.',
    foot: 'Hours lost to paperwork',
  }
];

export default function Problem() {
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FFEDD5', border: '1px solid #FDBA74', color: '#9A3412', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            The Real Problem
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '16px' }}>
            Your clinic leaks time<br />every single day.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5B6B7B', maxWidth: '500px', margin: '0 auto' }}>
            Manual front-desk work quietly eats into the hours you could spend with patients.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                padding: '32px', background: '#FFFDF8', borderRadius: '14px', border: '1px solid #E3DDCF',
                boxShadow: '3px 3px 0 rgba(26,43,60,0.08)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#C2410C' }} />
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{p.icon}</div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1A2B3C', marginBottom: '10px' }}>{p.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#5B6B7B', marginBottom: '20px' }}>{p.desc}</p>

              <div style={{ borderTop: '1px dashed #E3DDCF', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.foot}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
