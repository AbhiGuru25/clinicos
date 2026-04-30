'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid #F1F5F9', height: '64px', display: 'flex', alignItems: 'center' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0EA5E9, #10B981)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>Clinic<span style={{ color: '#0EA5E9' }}>OS</span></span>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '#pricing']].map(([label, href]) => (
                <a key={label} href={href} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</a>
              ))}
            </div>
          )}

          {/* CTA + Mobile Menu (Right) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && (
              <>
                <a href="#pricing" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textDecoration: 'none' }}>Sign In</a>
                <a href="#pricing" style={{ fontSize: '0.82rem', fontWeight: 800, padding: '8px 18px', borderRadius: '10px', color: 'white', textDecoration: 'none', background: 'linear-gradient(135deg, #0EA5E9, #10B981)' }}>
                  Start Free Trial
                </a>
              </>
            )}
            
            {isMobile && (
              <button onClick={() => setOpen(!open)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', color: '#64748B' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {open ? <path d="M18 6L6 18M6 6l12 12"/> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobile && open && (
          <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: 'white', borderBottom: '1px solid #F1F5F9', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '#pricing']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid #F8FAFC' }}>{label}</a>
            ))}
            <a href="#pricing" style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', fontWeight: 800, color: 'white', textDecoration: 'none', marginTop: '12px', background: 'linear-gradient(135deg, #0EA5E9, #10B981)' }}>
              Start Free Trial
            </a>
          </div>
        )}
      </nav>

      {/* WhatsApp Float */}
      <a href="https://wa.me/916352449698?text=Hi, I want to know more about ClinicOS"
        target="_blank" rel="noopener noreferrer" 
        style={{ 
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, 
          width: '56px', height: '56px', background: '#25D366', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)', transition: 'transform 0.2s',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </>
  );
}
