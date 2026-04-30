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
    </>
  );
}
