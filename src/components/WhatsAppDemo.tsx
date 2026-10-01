'use client';
import { motion } from 'framer-motion';

// Sample conversation — illustrates the booking flow patients experience.
export default function WhatsAppDemo() {
  const messages = [
    { type: 'received', text: 'Namaste! 🙏 I am your clinic assistant. How can I help you today?', time: '9:00 AM' },
    { type: 'sent', text: 'I want to book an appointment for tomorrow', time: '9:01 AM' },
    { type: 'received', text: 'Sure! These slots are available tomorrow:\n• 10:00 AM ✅\n• 11:30 AM ✅\n• 3:00 PM ✅\nWhich time works for you?', time: '9:01 AM' },
    { type: 'sent', text: '10 AM please', time: '9:02 AM' },
    { type: 'received', text: '✅ Appointment confirmed!\n📅 Tomorrow, 10:00 AM\nYou\u2019ll get a reminder before your visit. See you! 🙏', time: '9:02 AM' },
  ];

  return (
    <section id="demo" style={{ padding: '100px 0', background: '#0B3530', borderTop: '1px solid #155E54', borderBottom: '1px solid #155E54' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', marginBottom: '24px', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', color: '#F5C518', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              Sample Conversation
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#FFFDF8', marginBottom: '20px' }}>
              Booking over chat,<br />not phone calls.
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.7, color: 'rgba(255,253,248,0.7)', maxWidth: '480px' }}>
              This is the shape of a real booking on your clinic number. The AI checks live availability and writes the appointment straight into your queue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Books in about a minute', desc: 'No holding, no callbacks.' },
                { title: 'Works in Hindi, Gujarati & English', desc: 'Patients write the way they speak.' },
                { title: 'Answers even after OPD hours', desc: 'Night and holiday bookings land in the queue.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C518', fontSize: '1.2rem' }}>✓</div>
                  <div>
                    <div style={{ color: '#FFFDF8', fontWeight: 800, fontSize: '1rem' }}>{item.title}</div>
                    <div style={{ color: 'rgba(255,253,248,0.6)', fontSize: '0.9rem' }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: 'relative', width: '100%', maxWidth: '340px', margin: '0 auto' }}
          >
            <div style={{
              background: '#0A0E1A', borderRadius: '48px', padding: '12px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)', border: '1px solid #155E54'
            }}>
              <div style={{ background: '#ECE5DD', borderRadius: '36px', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
                {/* WA Header */}
                <div style={{ background: '#0B3530', padding: '32px 16px 12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0E7C6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏥</div>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>Your Clinic</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>🟢 online</div>
                  </div>
                </div>
                {/* Chat content */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.5 }}
                      style={{
                        maxWidth: '85%', padding: '8px 12px', borderRadius: '12px', fontSize: '0.82rem', lineHeight: 1.5, position: 'relative',
                        alignSelf: msg.type === 'received' ? 'flex-start' : 'flex-end',
                        background: msg.type === 'received' ? 'white' : '#D9F2E3',
                        color: '#1A2B3C',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {msg.text.split('\n').map((line, j) => <div key={j}>{line}</div>)}
                      <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.5 }}>{msg.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
