'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section style={{ background: 'transparent', paddingTop: '100px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Subtle Medical Pattern from CSS */}
      <div className="bg-cross-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* CENTERED Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}
        >

          {/* Clinical Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', marginBottom: '24px', background: 'white', border: '1px solid #E2E8F0', color: '#0369A1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0369A1"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Modern Healthcare Automation</span>
          </motion.div>

          {/* Clinical Headline */}
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '20px', color: '#0F172A' }}>
            Elevate Your Clinic with<br />
            <span style={{ color: '#0369A1' }}>Intelligent Automation.</span>
          </h1>

          <p style={{ fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 32px auto', color: '#475569' }}>
            The all-in-one "WhatsApp-First" management system designed to reduce no-shows, automate billing, and let you focus on what matters most: <strong style={{ color: '#0369A1' }}>Patient Care.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#pricing" style={{
                padding: '14px 32px', borderRadius: '12px', fontWeight: 900, fontSize: '0.95rem', color: 'white', textDecoration: 'none',
                background: '#0369A1',
                boxShadow: '0 8px 24px rgba(3,105,161,0.25)', display: 'inline-block'
              }}
            >
              Start Free Trial
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/916352449698?text=Hi, I want a ClinicOS demo"
              target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', color: '#0369A1', background: 'white',
                border: '1px solid #0369A1', display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              View Live Demo
            </motion.a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: 'HIPAA Compliant' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'Bank-Grade Security' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, text: 'Real-time Health Monitoring' },
            ].map((b, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.75rem', fontWeight: 600 }}
              >
                <span style={{ color: '#0369A1' }}>{b.icon}</span>
                <span>{b.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clinical Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: '850px', margin: '0 auto', position: 'relative' }}
        >
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', background: 'white' }}>
            {/* Header bar */}
            <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinic Management Console v2.0</div>
              <div style={{ width: '20px' }} />
            </div>

            {/* Dashboard Content */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* Side info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    style={{ padding: '16px', borderRadius: '12px', background: '#F0F9FF', border: '1px solid #E0F2FE' }}
                  >
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '4px' }}>Active Patients</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0C4A6E' }}>142</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    style={{ padding: '16px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #DCFCE7' }}
                  >
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>Appointments</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#14532D' }}>28</div>
                  </motion.div>
                </div>
                {/* Main list */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', marginBottom: '12px' }}>UPCOMING VISITS</div>
                  {[
                    { name: 'Rahul Sharma', time: '10:30 AM', status: 'Confirmed' },
                    { name: 'Priya Patel', time: '11:15 AM', status: 'Reminded' },
                    { name: 'Amit Shah', time: '12:00 PM', status: 'Pending' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{p.time}</div>
                      </div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: p.status === 'Confirmed' ? '#F0FDF4' : '#F8FAFC', color: p.status === 'Confirmed' ? '#166534' : '#64748B' }}>
                        {p.status}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
