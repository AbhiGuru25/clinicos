'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Connect Your Number',
    desc: 'We link ClinicOS to your existing clinic WhatsApp number. No new number, no new app for patients to install.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA'
  },
  {
    num: '02',
    title: 'Guided Setup Together',
    desc: "We configure your OPD hours, appointment slots, doctors and billing templates with you — usually over a day or two.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA'
  },
  {
    num: '03',
    title: 'Your AI Goes Live',
    desc: 'Patients start booking via WhatsApp. Reminders go out automatically. Your dashboard shows the queue in real time.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    color: '#B45309', bg: '#FEF3C7'
  },
  {
    num: '04',
    title: 'You Grow, We Adjust',
    desc: 'Add doctors, change OPD hours or add services any time from settings. The system follows how your clinic actually runs.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    color: '#B45309', bg: '#FEF3C7'
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '80px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            How It Works
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '16px' }}>
            Live in days,
            <span style={{ color: '#0E7C6B' }}> not months.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5B6B7B', maxWidth: '500px', margin: '0 auto' }}>
            No IT team. No installation. No training sessions. Just four steps.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="card" style={{ position: 'relative', padding: '32px', background: '#FFFDF8', borderRadius: '14px', border: '1px solid #E3DDCF', boxShadow: '3px 3px 0 rgba(26,43,60,0.08)' }}
            >
              {/* Step number watermark */}
              <div className="font-display" style={{ fontSize: '4rem', fontWeight: 600, lineHeight: 1, marginBottom: '16px', opacity: 0.1, userSelect: 'none', color: step.color, fontFamily: "'IBM Plex Mono', monospace" }}>
                {step.num}
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', marginTop: '-16px', background: step.bg, color: step.color }}>
                {step.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1A2B3C', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#5B6B7B' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
