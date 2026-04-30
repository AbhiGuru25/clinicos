export default function Hero() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #F0FDF4 50%, #F8FAFF 100%)', paddingTop: '120px', paddingBottom: '80px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* CENTERED Hero Text */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px auto' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', marginBottom: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Trusted by 50+ Clinics Across India</span>
          </div>

          {/* Headline */}
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '24px', color: '#0F172A' }}>
            Your Clinic Runs<br />
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              On Autopilot.
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', marginBottom: '40px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px auto', color: '#64748B' }}>
            ClinicOS automates appointments, patient reminders, billing & daily reports — all through <strong style={{ color: '#0F172A' }}>WhatsApp</strong>. No complex software. No training needed.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            <a href="#pricing" style={{
              padding: '16px 32px', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', color: 'white', textDecoration: 'none',
              background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
              boxShadow: '0 8px 30px rgba(14,165,233,0.35)', display: 'inline-block',
              transition: 'transform 0.2s'
            }}>
              Start 14-Day Free Trial →
            </a>
            <a href="https://wa.me/916352449698?text=Hi, I want a ClinicOS demo"
              target="_blank" rel="noopener noreferrer" style={{
                padding: '16px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', color: '#334155', background: 'white',
                border: '2px solid #E2E8F0', display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
              📱 Book Free Demo
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            {[
              { icon: '✅', text: 'No credit card needed' },
              { icon: '🔒', text: 'HIPAA-safe data' },
              { icon: '⚡', text: 'Setup in 24 hours' },
              { icon: '📱', text: 'Works on WhatsApp' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', inset: '-20px', borderRadius: '40px', opacity: 0.15,
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)', filter: 'blur(40px)', transform: 'scale(0.95)'
          }} />

          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', background: 'white' }}>
            {/* Window bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FEBC2E' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28C840' }} />
              <div style={{ marginLeft: '16px', padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', color: '#94A3B8', background: 'white', border: '1px solid #E2E8F0' }}>
                clinicos.in/dashboard
              </div>
            </div>

            {/* Stats row */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'white' }}>
              {[
                { label: "Today's Appointments", value: '24', color: '#0EA5E9', icon: '📅', bg: '#EFF6FF' },
                { label: 'Reminders Sent', value: '18', color: '#10B981', icon: '📲', bg: '#F0FDF4' },
                { label: 'Revenue Today', value: '₹12,400', color: '#7C3AED', icon: '💰', bg: '#F5F3FF' },
                { label: 'Pending Reports', value: '3', color: '#F59E0B', icon: '📊', bg: '#FFFBEB' },
              ].map((stat, i) => (
                <div key={i} style={{ borderRadius: '16px', padding: '20px', background: stat.bg, border: `1px solid ${stat.color}20` }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
                  <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ padding: '0 24px 24px', background: 'white' }}>
              <div style={{ borderRadius: '16px', padding: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#0EA5E9', marginBottom: '12px' }}>
                  🤖 AI Activity — Live
                </div>
                {[
                  { time: '10:42 AM', msg: 'Appointment booked for Ramesh Patel — Dr. Shah (2:30 PM)', dot: '#10B981' },
                  { time: '10:38 AM', msg: 'Reminder sent to 8 patients for tomorrow\'s appointments', dot: '#0EA5E9' },
                  { time: '10:15 AM', msg: 'Invoice ₹800 auto-generated for Priya Mehta', dot: '#7C3AED' },
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', flexShrink: 0 }}>{log.time}</span>
                    <span style={{ fontSize: '0.82rem', color: '#475569' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
