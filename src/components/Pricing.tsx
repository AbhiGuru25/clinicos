const plans = [
  { name: 'Starter', price: '999', desc: 'Designed for solo practitioners', color: '#0369A1', features: ['AI Patient Intake Bot', 'Automated Reminders', 'Up to 200 appointments/mo', 'Revenue tracking', 'Email support'], cta: 'Start Free Trial', popular: false },
  { name: 'Growth', price: '2,499', desc: 'Best for multi-doctor clinics', color: '#0D9488', features: ['Everything in Starter', 'GST-Compliant Billing', 'Daily WhatsApp Performance Report', 'Prescription Management', 'Unlimited appointments', 'Priority support'], popular: true },
  { name: 'Enterprise', price: 'Custom', desc: 'For hospital chains & networks', color: '#1E293B', features: ['Everything in Growth', 'Multi-branch centralization', 'Custom EMR integrations', 'Staff performance metrics', 'White-label reporting', 'Dedicated manager'], popular: false },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '80px 0', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Flexible Engagement
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Choose Your <span style={{ color: '#0369A1' }}>Service Level.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '480px', margin: '0 auto' }}>
            Professional medical automation at a predictable price. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ 
                position: 'relative', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column',
                background: 'white',
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #F1F5F9',
                boxShadow: plan.popular ? '0 20px 40px rgba(0, 0, 0, 0.05)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}>

              {plan.popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: 'white', background: plan.color }}>
                  Recommended
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: plan.color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.name}</div>
                <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', lineHeight: 1, marginBottom: '8px' }}>
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginRight: '2px' }}>₹</span>}
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94A3B8' }}>/mo</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>{plan.desc}</div>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1, listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <svg style={{ flexShrink: 0, marginTop: '2px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="https://wa.me/916352449698"
                style={{
                  display: 'block', width: '100%', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s ease',
                  background: plan.popular ? plan.color : 'white',
                  color: plan.popular ? 'white' : plan.color,
                  border: plan.popular ? 'none' : `1px solid ${plan.color}`
                }}>
                Start Implementation
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
