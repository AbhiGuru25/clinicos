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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Book Free Demo
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>, text: 'No credit card needed' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'HIPAA-safe data' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, text: 'Setup in 24 hours' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, text: 'Works on WhatsApp' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600 }}>
                <span style={{ color: '#10B981' }}>{b.icon}</span>
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
                { label: "Today's Appointments", value: '24', color: '#0EA5E9', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, bg: '#EFF6FF' },
                { label: 'Reminders Sent', value: '18', color: '#10B981', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, bg: '#F0FDF4' },
                { label: 'Revenue Today', value: '₹12,400', color: '#7C3AED', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, bg: '#F5F3FF' },
                { label: 'Pending Reports', value: '3', color: '#F59E0B', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, bg: '#FFFBEB' },
              ].map((stat, i) => (
                <div key={i} style={{ borderRadius: '16px', padding: '20px', background: stat.bg, border: `1px solid ${stat.color}20` }}>
                  <div style={{ color: stat.color, marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
                  <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ padding: '0 24px 24px', background: 'white' }}>
              <div style={{ borderRadius: '16px', padding: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#0EA5E9', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                    AI Activity — Live
                  </span>
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
