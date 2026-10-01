'use client';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Real-time Live Sync',
    desc: 'The moment a patient books on WhatsApp, it appears on your screen instantly. No refreshing needed.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
  },
  {
    title: 'Collections Without Chasing',
    desc: 'Complete a visit and the GST invoice is generated, downloadable as PDF and sendable on WhatsApp.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
  {
    title: 'Patient History in One Click',
    desc: 'Every past visit, bill and uploaded document lives on the patient file. Repeat visits take seconds.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  }
];

export default function DashboardShowcase() {
  return (
    <section id="dashboard-preview" style={{ padding: '100px 0', background: 'transparent', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>

          {/* Left Side: Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            {/* Main Browser Window */}
            <div style={{
              background: '#FFFDF8', borderRadius: '14px', border: '1px solid #E3DDCF',
              boxShadow: '4px 4px 0 rgba(26,43,60,0.1)', overflow: 'hidden', position: 'relative'
            }}>
              {/* Browser Top Bar */}
              <div style={{ padding: '12px 16px', background: '#0B3530', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#155E54' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#155E54' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#155E54' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: '#9DBFAC', fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>OPD DESK — LIVE</div>
              </div>

              {/* Dashboard Content */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A2B3C' }}>Today&apos;s OPD</div>
                  <div style={{ fontSize: '0.7rem', color: '#93A0AE', fontFamily: "'IBM Plex Mono', monospace" }}>MORNING SHIFT</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#0B3530', border: '1px solid #155E54', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9DBFAC', textTransform: 'uppercase', marginBottom: '4px' }}>Now serving</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFDF8', fontFamily: "'IBM Plex Mono', monospace" }}>#04</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#DDF0EA', border: '1px solid #9ED9C8', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0A5C4F', textTransform: 'uppercase', marginBottom: '4px' }}>Billed today</div>
                    <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A5C4F' }}>₹14.5k</div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed #C9C0AC', background: '#FAF7F0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#93A0AE', marginBottom: '8px', letterSpacing: '1px' }}>UP NEXT</div>
                  {[
                    { name: 'Rahul Sharma', time: '10:30 AM', status: 'Confirmed' },
                    { name: 'Priya Patel', time: '10:45 AM', status: 'WhatsApp' },
                    { name: 'Amit Desai', time: '11:00 AM', status: 'Pending' },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px dashed #E3DDCF' : 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0B3530', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#FFFDF8', fontFamily: "'IBM Plex Mono', monospace" }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A2B3C' }}>{p.name}</div>
                          <div style={{ fontSize: '0.65rem', color: '#93A0AE', fontFamily: "'IBM Plex Mono', monospace" }}>{p.time}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 800, padding: '4px 8px', borderRadius: '999px', background: p.status === 'Pending' ? '#FEF3C7' : '#DDF0EA', color: p.status === 'Pending' ? '#92400E' : '#0A5C4F', textTransform: 'uppercase' }}>
                        {p.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Live Indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '8px 12px', background: '#0B3530', border: '1px solid #155E54', borderRadius: '999px', color: '#FFFDF8', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(11,53,48,0.3)' }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                LIVE SYNC
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '24px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              The Doctor&apos;s Desk
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '24px' }}>
              Your Entire OPD,<br />
              <span style={{ color: '#0E7C6B' }}>On One Screen.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#5B6B7B', marginBottom: '40px', lineHeight: 1.7 }}>
              While patients book on WhatsApp, you watch the queue move live. No registers, no phone tag with staff — it&apos;s all here.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DDF0EA', color: '#0E7C6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A2B3C', marginBottom: '4px' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#5B6B7B', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
