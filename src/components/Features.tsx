import React from 'react';

const features = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, 
    color: '#0EA5E9', bg: '#EFF6FF', title: 'AI Appointment Booking', desc: 'Patients WhatsApp your clinic number. The AI instantly checks availability, books slots, and sends confirmations — 24/7, no receptionist needed.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, 
    color: '#10B981', bg: '#F0FDF4', title: 'Smart Patient Reminders', desc: 'Automated WhatsApp reminders sent 24h and 1h before appointments. Reduce no-shows by up to 70% without a single manual call.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, 
    color: '#7C3AED', bg: '#F5F3FF', title: 'Auto GST Billing', desc: 'Generate GST-compliant invoices automatically after every visit. Send them directly to patients via WhatsApp with one click.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, 
    color: '#F59E0B', bg: '#FFFBEB', title: 'Daily Reports on WhatsApp', desc: "Every evening at 8 PM, receive your clinic's daily summary — patients seen, revenue collected, and tomorrow's appointments." 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 19 12a4.95 4.95 0 1 0-7-7L3.5 13.5a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>, 
    color: '#EC4899', bg: '#FDF2F8', title: 'Prescription Tracker', desc: 'Log prescriptions digitally. Patients can request medicine reminders. Doctors can access records from any device instantly.' 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, 
    color: '#0EA5E9', bg: '#EFF6FF', title: 'Revenue Dashboard', desc: 'Track daily, weekly, and monthly revenue in real-time. Know which services generate the most income and which days are busiest.' 
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '80px 0', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Everything You Need
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            One System.<br />
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every Clinic Need.
            </span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '520px', margin: '0 auto' }}>
            Built specifically for Indian clinics — from solo GPs to multi-specialty hospitals.
          </p>
        </div>

        {/* Feature cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: '32px', background: 'white', cursor: 'default', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#64748B' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
