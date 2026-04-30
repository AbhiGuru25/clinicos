export default function CTA() {
  return (
    <section style={{ padding: '80px 0', background: 'white' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ 
            borderRadius: '32px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)' 
          }}>
          
          {/* Background pattern */}
          <div style={{ 
              position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', marginBottom: '24px', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Limited Spots Available This Month
            </div>

            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: 'white', marginBottom: '20px' }}>
              Your Clinic Deserves<br />Better Technology.
            </h2>

            <p style={{ fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', maxWidth: '520px', margin: '0 auto 40px auto' }}>
              Join 50+ clinics across Gujarat already saving 4 hours daily. Start your 14-day free trial — no card, no commitment.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <a href="#pricing"
                style={{
                  padding: '16px 32px', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', color: '#0F172A', textDecoration: 'none',
                  background: 'white', transition: 'all 0.2s ease', display: 'inline-block'
                }}>
                Start Free Trial — 14 Days Free →
              </a>
              <a href="https://wa.me/916352449698?text=Hi, I want a demo of ClinicOS"
                target="_blank" rel="noopener noreferrer" style={{
                  padding: '16px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '1rem',
                  textDecoration: 'none', color: 'white', background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease'
                }}>
                📱 WhatsApp for Demo
              </a>
            </div>

            <p style={{ marginTop: '32px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              Powered by <strong style={{ color: 'white' }}>Zynteq Agency</strong> · India's #1 AI Automation Agency
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
