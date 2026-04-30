export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: 'white', padding: '64px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0EA5E9, #10B981)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <span className="font-display" style={{ fontSize: '1.3rem', fontWeight: 900 }}>Clinic<span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>OS</span></span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#94A3B8', marginBottom: '16px', maxWidth: '280px' }}>
              AI-powered clinic management built for Indian healthcare. WhatsApp-first. Zero complexity.
            </p>
            <p style={{ fontSize: '0.78rem', color: '#475569' }}>
              A product by <a href="https://zynteq.in" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', textDecoration: 'none' }}>Zynteq Agency</a>
            </p>
          </div>

          {/* Product Links */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748B', marginBottom: '20px' }}>Product</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '#pricing'], ['Book Demo', 'https://wa.me/916352449698']].map(([label, href]) => (
                <li key={label}>
                  <a href={href} style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748B', marginBottom: '20px' }}>Contact</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <a href="https://wa.me/916352449698" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📱 +91 63524 49698
                </a>
              </li>
              <li>
                <a href="mailto:hello@zynteq.in" style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'none' }}>
                  ✉️ hello@zynteq.in
                </a>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>📍 Ahmedabad, Gujarat</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: '32px', borderTop: '1px solid #1E293B', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ fontSize: '0.78rem', color: '#475569' }}>
            © 2026 ClinicOS by Zynteq Agency. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" style={{ fontSize: '0.78rem', color: '#475569', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
