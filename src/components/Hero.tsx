'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section style={{ background: 'transparent', paddingTop: '100px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* CENTERED Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}
        >

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '24px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', boxShadow: '2px 2px 0 rgba(26,43,60,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>WhatsApp-first clinic automation</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 600, lineHeight: 1.02, letterSpacing: '-1px', marginBottom: '24px', color: '#1A2B3C' }}>
            Your Clinic.<br />
            Running on <span style={{ color: '#0E7C6B' }}>Autopilot.</span>
          </h1>

          <p style={{ fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 40px auto', color: '#5B6B7B' }}>
            ClinicOS takes WhatsApp bookings, sends reminders, manages your OPD queue and bills with GST — while you just see patients. No new apps. No training. <strong style={{ color: '#1A2B3C' }}>Guided setup in days.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#pricing" style={{
                padding: '14px 32px', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem', color: 'white', textDecoration: 'none',
                background: '#0E7C6B', border: '1px solid #0A5C4F',
                boxShadow: '3px 3px 0 #0A5C4F', display: 'inline-block'
              }}
            >
              Start Free Trial
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/916352449698?text=Hi, I want a ClinicOS demo"
              target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', color: '#1A2B3C', background: '#FFFDF8',
                border: '1px solid #C9C0AC', boxShadow: '3px 3px 0 rgba(26,43,60,0.12)', display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1FA855"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              View Live Demo
            </motion.a>
          </div>

          {/* Honest trust points — only what the product does */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            {[
              'Live OPD queue',
              'GST-ready billing',
              'Access-controlled records',
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5B6B7B', fontSize: '0.75rem', fontWeight: 700 }}
              >
                <span style={{ color: '#0E7C6B' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* OPD deck preview — mirrors the real dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: '850px', margin: '0 auto', position: 'relative' }}
        >
          <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E3DDCF', boxShadow: '4px 4px 0 rgba(26,43,60,0.1)', background: '#FFFDF8' }}>
            {/* Header bar */}
            <div style={{ padding: '12px 20px', background: '#0B3530', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9DBFAC', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'IBM Plex Mono', monospace" }}>Today&apos;s OPD — Live</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', fontWeight: 800, color: '#F5C518' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5C518' }} />
                BY ZYNTEQ.
              </div>
            </div>

            {/* Deck content */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* Now serving */}
                <div style={{ padding: '16px', borderRadius: '12px', background: '#0B3530', border: '1px solid #155E54', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9DBFAC', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Now serving</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFDF8', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>#04</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFDF8', marginTop: '6px' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.65rem', color: '#9DBFAC', fontFamily: "'IBM Plex Mono', monospace" }}>10:30 AM</div>
                </div>
                {/* Queue list */}
                <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed #C9C0AC', background: '#FAF7F0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#93A0AE', marginBottom: '8px', letterSpacing: '1px' }}>UP NEXT</div>
                  {[
                    { name: 'Priya Patel', time: '10:45 AM', tag: 'Confirmed' },
                    { name: 'Amit Shah', time: '11:00 AM', tag: 'WhatsApp' },
                    { name: 'Kavya Nair', time: '11:15 AM', tag: 'Pending' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 2 ? '1px dashed #E3DDCF' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A2B3C' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#93A0AE', fontFamily: "'IBM Plex Mono', monospace" }}>{p.time}</div>
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 800, padding: '4px 8px', borderRadius: '999px', background: p.tag === 'Pending' ? '#FEF3C7' : '#DDF0EA', color: p.tag === 'Pending' ? '#92400E' : '#0A5C4F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {p.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
