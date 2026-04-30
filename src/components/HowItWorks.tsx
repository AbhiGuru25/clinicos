const steps = [
  { num: '01', title: 'Share Your WhatsApp Number', desc: 'We connect ClinicOS to your existing clinic WhatsApp number. No new number, no new app — your existing number gets superpowers.', icon: '📱', color: '#0EA5E9', bg: '#EFF6FF' },
  { num: '02', title: 'We Configure in 24 Hours', desc: "Our team sets up your appointment slots, services, staff names, and billing templates. You don't touch a single line of code.", icon: '⚙️', color: '#10B981', bg: '#F0FDF4' },
  { num: '03', title: 'Your AI Goes Live', desc: 'Patients start booking via WhatsApp. Reminders go out automatically. Your dashboard shows real-time data. You just see patients.', icon: '🚀', color: '#7C3AED', bg: '#F5F3FF' },
  { num: '04', title: 'You Grow, We Scale', desc: 'Add new doctors, branches, or services any time. ClinicOS scales with your clinic — from 10 to 1000 patients a day.', icon: '📈', color: '#F59E0B', bg: '#FFFBEB' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-alt" style={{ padding: '80px 0' }}>
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
            <div key={i} className="card" style={{ position: 'relative', padding: '32px', background: 'white' }}>
              {/* Step number watermark */}
              <div className="font-display" style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '16px', opacity: 0.07, userSelect: 'none', color: step.color }}>
                {step.num}
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', marginTop: '-16px', background: step.bg }}>
                {step.icon}
              </div>
              <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#94A3B8' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
