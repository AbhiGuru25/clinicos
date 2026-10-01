'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Every item below maps to a real, working ClinicOS screen or API.
const features = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA', title: 'WhatsApp AI Booking', desc: 'Patients book by chatting on your clinic number. The AI checks real availability and confirms the slot into your dashboard.'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA', title: 'Automatic Reminders', desc: 'One-tap or scheduled WhatsApp reminders for today and tomorrow\u2019s queue. Fewer empty chairs, zero manual follow-ups.'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    color: '#B45309', bg: '#FEF3C7', title: 'Live OPD Queue & Calendar', desc: 'Walk-ins and WhatsApp bookings merge into one live queue with token order, reminders and complete-and-bill in one click.'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: '#B45309', bg: '#FEF3C7', title: 'Patient Files & History', desc: 'Searchable directory with every visit, uploaded medical documents and CSV export for your records.'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA', title: 'GST Billing on WhatsApp', desc: 'Consultation fee plus GST slabs, branded PDF invoices, ledger with CSV export — sent to the patient\u2019s phone.'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    color: '#0E7C6B', bg: '#DDF0EA', title: 'Revenue at a Glance', desc: 'Total collections, GST gathered and a 7-day revenue trend — enough signal for daily decisions, no spreadsheet needed.'
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '60px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '16px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            What&apos;s Inside
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '12px' }}>
            Everything the front desk does.<br />
            <span style={{ color: '#0E7C6B' }}>On autopilot.</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#5B6B7B', maxWidth: '480px', margin: '0 auto' }}>
            Six working modules, one queue. Click any demo and see it in the live dashboard.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card" style={{ padding: '24px', background: '#FFFDF8', borderRadius: '14px', border: '1px solid #E3DDCF', boxShadow: '3px 3px 0 rgba(26,43,60,0.08)' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1A2B3C', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#5B6B7B' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
