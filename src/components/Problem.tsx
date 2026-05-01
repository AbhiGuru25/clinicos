'use client';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: '📞',
    title: 'Missed Calls = Lost Revenue',
    desc: "Your receptionist can't answer every call. Every missed call is a patient who books elsewhere.",
    stat: '₹8,000+',
    statDesc: 'Lost per month from missed calls'
  },
  {
    icon: '🚫',
    title: 'No-Shows Waste Your Time',
    desc: 'Patients forget appointments. Empty slots mean zero revenue and wasted doctor time.',
    stat: '30%',
    statDesc: 'Average no-show rate without reminders'
  },
  {
    icon: '📋',
    title: 'Manual Billing Is Slow',
    desc: 'Writing invoices by hand takes hours. Errors are common. GST compliance is stressful.',
    stat: '4 hrs',
    statDesc: 'Wasted daily on admin tasks'
  }
];

export default function Problem() {
  return (
    <section style={{ padding: '100px 0', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            The Real Problem
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Your clinic is losing <span style={{ color: '#B91C1C' }}>money</span> every day.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '500px', margin: '0 auto' }}>
            Manual processes are silently killing your clinic's efficiency and revenue.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {problems.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', borderColor: '#FECACA' }}
              style={{ 
                padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #F1F5F9',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{p.icon}</div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>{p.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#64748B', marginBottom: '20px' }}>{p.desc}</p>
              
              <div style={{ borderTop: '1px solid #F8FAFC', paddingTop: '16px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#B91C1C' }}>{p.stat}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{p.statDesc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
