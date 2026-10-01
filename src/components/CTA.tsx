'use client';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section style={{ padding: '80px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: '20px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            background: '#0B3530', border: '1px solid #155E54'
          }}
        >

          {/* Gold dot texture */}
          <div style={{
              position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(rgba(245,197,24,0.25) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', marginBottom: '24px', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', color: '#F5C518', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}
            >
              Free Trial · No Card Needed
            </motion.div>

            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#FFFDF8', marginBottom: '20px' }}>
              See your own OPD<br />run itself for a week.
            </h2>

            <p style={{ fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.7, color: 'rgba(255,253,248,0.7)', maxWidth: '520px', margin: '0 auto 40px auto' }}>
              Start a free trial or book a 15-minute WhatsApp demo. We will set up your queue together — keep your register alongside until you are convinced.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#pricing"
                style={{
                  padding: '16px 32px', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', color: '#0B3530', textDecoration: 'none',
                  background: '#F5C518', transition: 'all 0.2s ease', display: 'inline-block'
                }}
              >
                Start Free Trial →
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/916352449698?text=Hi, I want a demo of ClinicOS"
                target="_blank" rel="noopener noreferrer" style={{
                  padding: '16px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem',
                  textDecoration: 'none', color: '#FFFDF8', background: 'transparent',
                  border: '1px solid rgba(255,253,248,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1FA855"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Book WhatsApp Demo
              </motion.a>
            </div>

            <p style={{ marginTop: '32px', fontSize: '0.82rem', color: 'rgba(255,253,248,0.5)' }}>
              Built by <strong style={{ color: '#F5C518' }}>Zynteq.</strong> · Clinics own their data, always
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
