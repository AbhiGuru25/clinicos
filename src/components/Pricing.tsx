const plans = [
  { name: 'Starter', price: '₹999', desc: 'Perfect for solo doctors & small clinics', color: '#0EA5E9', features: ['AI WhatsApp Appointment Bot', 'Patient Reminder Automation', 'Up to 200 appointments/month', 'Basic revenue dashboard', 'Email support'], cta: 'Start Free Trial', popular: false, ctaStyle: 'outline' },
  { name: 'Growth', price: '₹2,499', desc: 'For growing clinics with multiple doctors', color: '#10B981', features: ['Everything in Starter', 'Auto GST Invoice Generation', 'Daily WhatsApp Report', 'Prescription Tracker', 'Unlimited appointments', 'Priority WhatsApp support', 'Multi-doctor scheduling'], cta: 'Start Free Trial', popular: true, ctaStyle: 'filled' },
  { name: 'Enterprise', price: 'Custom', desc: 'For hospital chains & multi-branch setups', color: '#7C3AED', features: ['Everything in Growth', 'Multi-branch management', 'Custom integrations (HIS/EMR)', 'Dedicated account manager', 'Staff performance analytics', 'White-label options'], cta: 'Contact Us', popular: false, ctaStyle: 'outline' },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '80px 0', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Simple Pricing
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Try Free for 14 Days.<br />
            <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No Card Needed.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '480px', margin: '0 auto' }}>
            Cancel anytime during your trial. After 14 days, choose the plan that fits your clinic.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ 
                position: 'relative', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column',
                background: plan.popular ? 'linear-gradient(160deg, #F0F9FF, #F0FDF4)' : 'white',
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #F1F5F9',
                boxShadow: plan.popular ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                transition: 'all 0.3s ease'
              }}>

              {plan.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', padding: '6px 20px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'white', background: 'linear-gradient(135deg, #0EA5E9, #10B981)' }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: plan.color, marginBottom: '8px' }}>{plan.name}</div>
                <div className="font-display" style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', lineHeight: 1, marginBottom: '8px' }}>
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1rem', fontWeight: 400, color: '#94A3B8' }}>/mo</span>}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '8px' }}>{plan.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '4px 10px', borderRadius: '999px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  14 days free
                </div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1, listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#475569' }}>
                    <svg style={{ flexShrink: 0, marginTop: '2px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href={plan.cta === 'Contact Us' ? 'https://wa.me/916352449698' : '#'}
                style={{
                  display: 'block', width: '100%', padding: '16px', borderRadius: '16px', textAlign: 'center', fontWeight: 900, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease',
                  ...(plan.ctaStyle === 'filled' 
                    ? { background: 'linear-gradient(135deg, #0EA5E9, #10B981)', color: 'white', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }
                    : { background: 'transparent', border: `2px solid ${plan.color}`, color: plan.color }
                  )
                }}>
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            All plans include data encryption · Cancel anytime · Setup within 48 hours guaranteed
          </span>
        </div>
      </div>
    </section>
  );
}
