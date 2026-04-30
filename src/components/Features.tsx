import React from 'react';

const features = [
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, 
    color: '#0369A1', bg: '#F0F9FF', title: 'Smart Scheduling', desc: 'Automated 24/7 appointment booking on WhatsApp. Synchronized with your clinic calendar instantly.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, 
    color: '#0D9488', bg: '#F0FDF4', title: 'Patient Outreach', desc: 'Personalized reminders and follow-up messages sent automatically to reduce no-shows and increase compliance.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, 
    color: '#4F46E5', bg: '#F5F3FF', title: 'Automated Billing', desc: 'Secure, paperless billing and GST-compliant invoicing sent directly to patient WhatsApp after consultations.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, 
    color: '#0369A1', bg: '#F0F9FF', title: 'Practice Analytics', desc: 'Real-time monitoring of clinic revenue, patient volume, and staff performance available 24/7.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, 
    color: '#0D9488', bg: '#F0FDF4', title: 'Digital Health Records', desc: 'Secure cloud storage for prescriptions and patient history, accessible only by authorized practitioners.' 
  },
  { 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, 
    color: '#4F46E5', bg: '#F5F3FF', title: 'Encrypted & Secure', desc: 'Data is protected with healthcare-standard encryption, ensuring complete patient confidentiality.' 
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '60px 0', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '16px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Comprehensive Solutions
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '12px' }}>
            Unified Clinic<br />
            <span style={{ color: '#0369A1' }}>Management System.</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '480px', margin: '0 auto' }}>
            A professional ecosystem built to modernize patient engagement and streamline operations.
          </p>
        </div>

        {/* Feature cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748B' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
