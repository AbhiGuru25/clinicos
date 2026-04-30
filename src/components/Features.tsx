import React from 'react';

const features = [
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, 
    color: '#0EA5E9', bg: '#EFF6FF', title: 'AI Appointment Booking', desc: 'Patients WhatsApp your clinic number. The AI instantly checks availability, books slots, and sends confirmations — 24/7.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, 
    color: '#10B981', bg: '#F0FDF4', title: 'Smart Patient Reminders', desc: 'Automated WhatsApp reminders sent 24h and 1h before appointments. Reduce no-shows by up to 70%.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, 
    color: '#7C3AED', bg: '#F5F3FF', title: 'Auto GST Billing', desc: 'Generate GST-compliant invoices automatically and send them directly to patients via WhatsApp.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, 
    color: '#F59E0B', bg: '#FFFBEB', title: 'Daily Reports on WhatsApp', desc: "Every evening at 8 PM, receive your clinic's daily summary — patients seen, revenue collected, and tomorrow's appointments." 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 19 12a4.95 4.95 0 1 0-7-7L3.5 13.5a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>, 
    color: '#EC4899', bg: '#FDF2F8', title: 'Prescription Tracker', desc: 'Log prescriptions digitally and provide automated medicine reminders for your patients.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, 
    color: '#0EA5E9', bg: '#EFF6FF', title: 'Revenue Dashboard', desc: 'Track daily, weekly, and monthly revenue in real-time. Know exactly how your business is performing.' 
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '60px 0', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '16px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Everything You Need
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '12px' }}>
            One System.<br />
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every Clinic Need.
            </span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: '480px', margin: '0 auto' }}>
            Built specifically for Indian clinics — from solo GPs to hospitals.
          </p>
        </div>

        {/* Feature cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748B' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
