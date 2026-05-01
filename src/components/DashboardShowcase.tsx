'use client';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Real-time Live Sync',
    desc: 'The moment a patient books on WhatsApp, it appears on your screen instantly. No refreshing needed.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
  },
  {
    title: 'Revenue Analytics',
    desc: 'Track your daily, weekly, and monthly earnings at a glance. See which services are most profitable.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
  {
    title: 'Patient History',
    desc: 'Access every patient’s past visits, billing history, and notes with one click. 100% paperless.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  }
];

export default function DashboardShowcase() {
  return (
    <section id="dashboard-preview" style={{ padding: '100px 0', background: 'white', overflow: 'hidden' }}>
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
              background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.12)', overflow: 'hidden', position: 'relative'
            }}>
              {/* Browser Top Bar */}
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>dashboard.clinicos.in</div>
              </div>

              {/* Dashboard Content */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B' }}>Doctor Console</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Friday, May 1</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F0F9FF', border: '1px solid #E0F2FE' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '4px' }}>Today Revenue</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0C4A6E' }}>₹14,500</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>Appointments</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#14532D' }}>24</div>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', marginBottom: '16px' }}>UPCOMING PATIENTS</div>
                  {[
                    { name: 'Rahul Sharma', time: '10:30 AM', status: 'Confirmed' },
                    { name: 'Priya Patel', time: '11:15 AM', status: 'Reminded' },
                    { name: 'Amit Desai', time: '12:00 PM', status: 'Confirmed' },
                  ].map((p, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#64748B' }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>{p.name}</div>
                          <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{p.time}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: p.status === 'Confirmed' ? '#F0FDF4' : '#F8FAFC', color: p.status === 'Confirmed' ? '#166534' : '#64748B' }}>
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
                style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '8px 12px', background: '#0369A1', borderRadius: '999px', color: 'white', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(3,105,161,0.3)' }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                LIVE SYNC ACTIVE
              </motion.div>
            </div>

            {/* Background Decor for Mockup */}
            <div style={{ position: 'absolute', inset: '-40px', zIndex: -1, opacity: 0.5 }}>
              <div className="bg-medical-grid" style={{ width: '100%', height: '100%' }} />
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '24px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              The Doctor's Command Center
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '24px' }}>
              Your Entire Clinic,<br />
              <span style={{ color: '#0369A1' }}>In One Dashboard.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', marginBottom: '40px', lineHeight: 1.7 }}>
              While patients talk to your AI on WhatsApp, you get a bird's-eye view of your practice. No more checking logs or asking staff — it’s all here.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F0F9FF', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', marginBottom: '4px' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Future Feature Teaser */}
            <div style={{ marginTop: '48px', padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#6366F1', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Coming Soon: V3.0</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>AI Prescription Generation 💊</div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>The AI will draft prescriptions based on your consultation notes, ready for your signature.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
