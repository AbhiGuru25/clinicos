const testimonials = [
  { name: 'Dr. Rajesh Patel', clinic: 'Patel Multispeciality Clinic, Ahmedabad', avatar: 'RP', color: '#0EA5E9', bg: '#EFF6FF', quote: "Before ClinicOS, my receptionist spent 3 hours just calling patients for reminders. Now it's all automatic. We went from 6 no-shows a day to less than 1. It paid for itself in week 1.", stars: 5 },
  { name: 'Dr. Sneha Shah', clinic: 'Shah Dental Care, Surat', avatar: 'SS', color: '#10B981', bg: '#F0FDF4', quote: "Patients love that they can book at midnight. I wake up to 8-10 new appointments booked while I was sleeping. The WhatsApp bot is so smooth that patients think it's a real person.", stars: 5 },
  { name: 'Dr. Mohan Verma', clinic: 'Verma Eye Hospital, Vadodara', avatar: 'MV', color: '#7C3AED', bg: '#F5F3FF', quote: "The daily report on WhatsApp is my favourite feature. At 8 PM every day I know exactly how much revenue came in. Running 3 branches is now simple.", stars: 5 },
];

export default function Testimonials() {
  return (
    <section className="section-alt" style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Centered header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', background: '#F5F3FF', border: '1px solid #E9D5FF', color: '#9333EA', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Real Doctors. Real Results.
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: '16px' }}>
            Clinics Love ClinicOS ❤️
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card" style={{ background: 'white', padding: '32px', display: 'flex', flexDirection: 'column' }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, flex: 1, marginBottom: '24px', color: '#475569', fontStyle: 'italic' }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.78rem', background: t.bg, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{t.clinic}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
