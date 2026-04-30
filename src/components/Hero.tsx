export default function Hero() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #F0FDF4 50%, #F8FAFF 100%)', paddingTop: '100px', paddingBottom: '60px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* CENTERED Hero Text */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Trusted by 50+ Clinics Across India</span>
          </div>

          {/* Headline */}
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '20px', color: '#0F172A' }}>
            Your Clinic Runs<br />
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              On Autopilot.
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 32px auto', color: '#64748B' }}>
            ClinicOS automates appointments, patient reminders, billing & reports — all through <strong style={{ color: '#0F172A' }}>WhatsApp</strong>. No complex software needed.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <a href="#pricing" style={{
              padding: '14px 28px', borderRadius: '14px', fontWeight: 900, fontSize: '0.95rem', color: 'white', textDecoration: 'none',
              background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
              boxShadow: '0 8px 30px rgba(14,165,233,0.3)', display: 'inline-block'
            }}>
              Start 14-Day Free Trial
            </a>
            <a href="https://wa.me/916352449698?text=Hi, I want a ClinicOS demo"
              target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 28px', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', color: '#334155', background: 'white',
                border: '2px solid #E2E8F0', display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Free Demo
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            {[
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>, text: 'No card needed' },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'HIPAA-safe' },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, text: 'Fast Setup' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ color: '#10B981' }}>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'white' }}>
            {/* Window bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
            </div>

            {/* Stats row */}
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: 'white' }}>
              {[
                { label: 'Today', value: '24', color: '#0EA5E9', bg: '#EFF6FF' },
                { label: 'Sent', value: '18', color: '#10B981', bg: '#F0FDF4' },
                { label: 'Revenue', value: '₹12k', color: '#7C3AED', bg: '#F5F3FF' },
                { label: 'Pending', value: '3', color: '#F59E0B', bg: '#FFFBEB' },
              ].map((stat, i) => (
                <div key={i} style={{ borderRadius: '12px', padding: '12px', background: stat.bg, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '2px' }}>{stat.label}</div>
                  <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ padding: '0 16px 16px', background: 'white' }}>
              <div style={{ borderRadius: '12px', padding: '12px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                {[
                  { time: '10:42 AM', msg: 'Appointment booked — Dr. Shah', dot: '#10B981' },
                  { time: '10:38 AM', msg: 'Reminder sent to 8 patients', dot: '#0EA5E9' },
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94A3B8' }}>{log.time}</span>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>{log.msg}</span>
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
