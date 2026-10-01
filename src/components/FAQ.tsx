'use client';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Do I need a new phone number for ClinicOS?',
    a: 'No. ClinicOS connects to your existing clinic WhatsApp number, so patients keep messaging the number they already know.'
  },
  {
    q: 'How long does setup take?',
    a: 'Most clinics go live within a few days. We configure your OPD hours, doctors, slots and billing templates with you — you don\u2019t touch any code.'
  },
  {
    q: 'How is patient data protected?',
    a: 'Access is login-protected and role-based, data travels over encrypted connections and is hosted on secure managed cloud infrastructure. Our practices align with India\u2019s DPDP Act, and your data is never sold or shared.'
  },
  {
    q: 'Does it work with multiple doctors?',
    a: 'Yes. You can run multiple doctors with their own schedules, OPD hours and leave dates, all feeding one shared queue and billing desk.'
  },
  {
    q: 'What if I want to cancel?',
    a: 'You can cancel any time — no lock-in. Patient lists and invoices export to CSV, so your records always stay with you.'
  }
];

export default function FAQ() {
  return (
    <section id="faq" style={{ padding: '80px 0', background: 'transparent' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#FFFDF8', border: '1px solid #E3DDCF', color: '#0E7C6B', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Common Questions
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, lineHeight: 1.08, color: '#1A2B3C', marginBottom: '16px' }}>
            Asked by <span style={{ color: '#0E7C6B' }}>clinic owners</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E3DDCF', background: '#FFFDF8', boxShadow: '3px 3px 0 rgba(26,43,60,0.08)' }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A2B3C', marginBottom: '12px', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#0E7C6B' }}>Q.</span>
                {faq.q}
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#5B6B7B', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#B45309', fontWeight: 800 }}>A.</span>
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '40px', textAlign: 'center', padding: '24px', borderRadius: '14px', background: '#DDF0EA', border: '1px solid #9ED9C8' }}
        >
          <p style={{ fontSize: '0.9rem', color: '#0A5C4F', fontWeight: 600 }}>
            Have another question? <a href="https://wa.me/916352449698" target="_blank" rel="noopener noreferrer" style={{ color: '#0A5C4F', textDecoration: 'underline' }}>Chat with us on WhatsApp</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
