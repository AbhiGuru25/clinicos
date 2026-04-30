const features = [
  { icon: '📅', color: '#0EA5E9', bg: '#EFF6FF', title: 'AI Appointment Booking', desc: 'Patients WhatsApp your clinic number. The AI instantly checks availability, books slots, and sends confirmations — 24/7, no receptionist needed.' },
  { icon: '📲', color: '#10B981', bg: '#F0FDF4', title: 'Smart Patient Reminders', desc: 'Automated WhatsApp reminders sent 24h and 1h before appointments. Reduce no-shows by up to 70% without a single manual call.' },
  { icon: '🧾', color: '#7C3AED', bg: '#F5F3FF', title: 'Auto GST Billing', desc: 'Generate GST-compliant invoices automatically after every visit. Send them directly to patients via WhatsApp with one click.' },
  { icon: '📊', color: '#F59E0B', bg: '#FFFBEB', title: 'Daily Reports on WhatsApp', desc: "Every evening at 8 PM, receive your clinic's daily summary — patients seen, revenue collected, and tomorrow's appointments." },
  { icon: '💊', color: '#EC4899', bg: '#FDF2F8', title: 'Prescription Tracker', desc: 'Log prescriptions digitally. Patients can request medicine reminders. Doctors can access records from any device instantly.' },
  { icon: '📈', color: '#0EA5E9', bg: '#EFF6FF', title: 'Revenue Dashboard', desc: 'Track daily, weekly, and monthly revenue in real-time. Know which services generate the most income and which days are busiest.' },
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
            <div key={i} className="card" style={{ padding: '32px', background: 'white', cursor: 'default' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '24px', background: f.bg }}>
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
