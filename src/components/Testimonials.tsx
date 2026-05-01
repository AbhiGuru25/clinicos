'use client';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: "ClinicOS ne hamare clinic ki zindagi badal di. Pehle roz 20-30 calls miss hote the. Ab koi bhi appointment miss nahi hoti. Patients khud WhatsApp pe book kar lete hain.",
    author: "Dr. Manish Shah",
    role: "Shah Multispeciality Clinic, Ahmedabad",
    initials: "MS",
    color: "#0369A1"
  },
  {
    text: "The GST billing feature alone saves us 2 hours every day. Invoices go directly to patients on WhatsApp. My staff can now focus on actual patient care.",
    author: "Dr. Priya Mehta",
    role: "Mehta Dental Clinic, Surat",
    initials: "PM",
    color: "#0D9488"
  },
  {
    text: "Setup in exactly 48 hours as promised. The daily 8PM report on WhatsApp is my favorite feature — I know exactly how the clinic performed without asking anyone.",
    author: "Dr. Rajesh Patel",
    role: "Patel Nursing Home, Rajkot",
    initials: "RP",
    color: "#4F46E5"
  }
];

export default function Testimonials() {
  return (
    <section style={{ padding: '100px 0', background: '#F8FAFF' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Doctors Love It
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Real Results from <span style={{ color: '#0369A1' }}>Real Clinics.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
            >
              <div style={{ color: '#F59E0B', fontSize: '1.2rem', marginBottom: '20px' }}>★★★★★</div>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#475569', fontStyle: 'italic', marginBottom: '24px' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{t.author}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
