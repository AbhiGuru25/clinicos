'use client';
import { motion } from 'framer-motion';

// Plans describe real modules. Anything custom goes through a conversation,
// not a feature checkbox.
const plans = [
  { name: 'Starter', price: '999', desc: 'For solo practitioners getting off paper', color: '#0E7C6B', features: ['WhatsApp AI booking', 'Automatic appointment reminders', 'Live OPD queue & calendar', 'Patient directory with CSV export', 'Up to 1 doctor & 1 location', 'Email support'], cta: 'Start Free Trial', popular: false },
  { name: 'Growth', price: '2,499', desc: 'For clinics that bill daily', color: '#0E7C6B', features: ['Everything in Starter', 'GST billing with PDF invoices', 'Invoices delivered on WhatsApp', 'Medical document uploads', '7-day revenue trend', 'Priority WhatsApp support'], popular: true },
  { name: 'Custom', price: 'Custom', desc: 'For multi-doctor setups & hospitals', color: '#1A2B3C', features: ['Everything in Growth', 'Multiple doctors & schedules', 'Guided onboarding & staff training', 'Custom workflows by Zynteq', 'Data migration assistance', 'Dedicated manager'], popular: false },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '80px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Simple Pricing
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '16px' }}>
            Pay for what your desk <span style={{ color: '#0E7C6B' }}>actually uses.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#5B6B7B', maxWidth: '480px', margin: '0 auto' }}>
            Every plan starts with a free trial. No cards, no lock-in, export your data any time.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{
                position: 'relative', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column',
                background: '#FFFDF8',
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #E3DDCF',
                boxShadow: '3px 3px 0 rgba(26,43,60,0.08)',
                transition: 'all 0.3s ease'
              }}
            >

              {plan.popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: 'white', background: plan.color }}>
                  Most Clinics Pick This
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: plan.color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.name}</div>
                <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#1A2B3C', lineHeight: 1, marginBottom: '8px' }}>
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginRight: '2px' }}>₹</span>}
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#93A0AE' }}>/mo</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5B6B7B', marginBottom: '8px' }}>{plan.desc}</div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1, listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#1A2B3C' }}>
                    <svg style={{ flexShrink: 0, marginTop: '2px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/916352449698"
                style={{
                  display: 'block', width: '100%', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s ease',
                  background: plan.popular ? plan.color : '#FFFDF8',
                  color: plan.popular ? 'white' : plan.color,
                  border: plan.popular ? '1px solid #0A5C4F' : `1px solid ${plan.color}`
                }}
              >
                Talk to Us on WhatsApp
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
