export default function Stats() {
  const stats = [
    { value: '4 hrs', label: 'Saved Daily Per Clinic', icon: '⏱️' },
    { value: '70%', label: 'Fewer Missed Appointments', icon: '📉' },
    { value: '24/7', label: 'AI Available Always', icon: '🤖' },
    { value: '48 hrs', label: 'Setup Time', icon: '⚡' },
  ];

  return (
    <section className="py-14 border-y border-slate-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-display text-[2.8rem] font-black mb-1 gradient-text">{s.value}</div>
              <div className="text-[0.82rem] font-semibold text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
