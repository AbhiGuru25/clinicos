const faqs = [
  {
    q: 'Do I need to buy a new phone number for ClinicOS?',
    a: 'No. We can connect ClinicOS to your existing clinic WhatsApp number. Your patients don’t need to save a new number.'
  },
  {
    q: 'How long does it take to set up?',
    a: 'We usually go live within 48 hours. Our team handles all the configuration, so you don’t have to do anything.'
  },
  {
    q: 'Is patient data safe and private?',
    a: 'Absolutely. We use end-to-end encryption and follow HIPAA-safe data practices. Your data is never shared with third parties.'
  },
  {
    q: 'Does it work if I have multiple doctors in my clinic?',
    a: 'Yes. ClinicOS can manage multiple doctor schedules, rooms, and billing templates under one WhatsApp number.'
  },
  {
    q: 'What if I want to cancel the service?',
    a: 'You can cancel anytime. There are no long-term contracts. We also provide a full data export if you decide to leave.'
  }
];

export default function FAQ() {
  return (
    <section id="faq" style={{ padding: '80px 0', background: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Common Questions
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Frequently Asked <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Questions</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#0EA5E9' }}>Q.</span>
                {faq.q}
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#64748B', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#10B981', fontWeight: 800 }}>A.</span>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', padding: '24px', borderRadius: '24px', background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
          <p style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>
            Have another question? <a href="https://wa.me/916352449698" target="_blank" rel="noopener noreferrer" style={{ color: '#10B981', textDecoration: 'underline' }}>Chat with us on WhatsApp</a>
          </p>
        </div>
      </div>
    </section>
  );
}
