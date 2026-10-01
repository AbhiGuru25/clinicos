import DashboardShell from '@/components/DashboardShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-app)' }}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
