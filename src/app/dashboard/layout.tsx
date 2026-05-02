import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-app)' }}>
      <Sidebar />
      {/* Desktop: offset by sidebar width. Mobile: offset by top bar + bottom nav */}
      <main className="lg:pl-64 min-h-screen">
        <div className="pt-[60px] lg:pt-0 pb-[72px] lg:pb-0 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
