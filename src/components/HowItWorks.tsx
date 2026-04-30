const steps = [
  { 
    num: '01', 
    title: 'Share Your WhatsApp Number', 
    desc: 'We connect ClinicOS to your existing clinic WhatsApp number. No new number, no new app — your existing number gets superpowers.', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, 
    color: '#0EA5E9', bg: '#EFF6FF' 
  },
  { 
    num: '02', 
    title: 'We Configure in 24 Hours', 
    desc: "Our team sets up your appointment slots, services, staff names, and billing templates. You don't touch a single line of code.", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, 
    color: '#10B981', bg: '#F0FDF4' 
  },
  { 
    num: '03', 
    title: 'Your AI Goes Live', 
    desc: 'Patients start booking via WhatsApp. Reminders go out automatically. Your dashboard shows real-time data. You just see patients.', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>, 
    color: '#7C3AED', bg: '#F5F3FF' 
  },
  { 
    num: '04', 
    title: 'You Grow, We Scale', 
    desc: 'Add new doctors, branches, or services any time. ClinicOS scales with your clinic — from 10 to 1000 patients a day.', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, 
    color: '#F59E0B', bg: '#FFFBEB' 
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-alt" style={{ padding: '80px 0', background: '#F8FAFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            How It Works
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Up & Running in
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> 48 Hours.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '500px', margin: '0 auto' }}>
            No IT team. No installation. No training sessions. Just follow these 4 steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {steps.map((step, i) => (
            <div key={i} className="card" style={{ position: 'relative', padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              {/* Step number watermark */}
              <div className="font-display" style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '16px', opacity: 0.07, userSelect: 'none', color: step.color }}>
                {step.num}
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', marginTop: '-16px', background: step.bg, color: step.color }}>
                {step.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#64748B' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
