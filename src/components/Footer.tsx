import { ZynteqBolt } from '@/components/Brand';

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: 'white', padding: '64px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ZynteqBolt size={18} tile tileSize={38} />
              <span>
                <span className="font-display" style={{ display: 'block', fontSize: '1.3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>ClinicOS</span>
                <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: '#64748B', marginTop: '4px' }}>BY <a href="https://zynteq.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F5C518', textDecoration: 'none' }}>ZYNTEQ.</a></span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#94A3B8', marginBottom: '16px', maxWidth: '280px' }}>
              AI-powered clinic management built for Indian healthcare. WhatsApp-first. Zero complexity.
            </p>
            <p style={{ fontSize: '0.78rem', color: '#475569' }}>
              A product by <a href="https://zynteq.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F5C518', textDecoration: 'none' }}>Zynteq Agency</a>
            </p>
          </div>

          {/* Product Links */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748B', marginBottom: '20px' }}>Product</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
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
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
              <li>
                <a href="https://wa.me/916352449698" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  +91 63524 49698
                </a>
              </li>
              <li>
                <a href="mailto:hello@zynteq.in" style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  hello@zynteq.in
                </a>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Ahmedabad, Gujarat
                </span>
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
