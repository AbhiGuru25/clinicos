'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const STORAGE_KEY = 'clinicos-sidebar-collapsed';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setCollapsed(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '[' && !/input|textarea|select/i.test((e.target as HTMLElement)?.tagName || '')) {
        setCollapsed(c => {
          try {
            localStorage.setItem(STORAGE_KEY, c ? '0' : '1');
          } catch { /* ignore */ }
          return !c;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggle = () => {
    setCollapsed(c => {
      try {
        localStorage.setItem(STORAGE_KEY, c ? '0' : '1');
      } catch { /* ignore */ }
      return !c;
    });
  };

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      {/* Padding follows the rail explicitly so content always moves with it */}
      <main
        className={`min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? 'lg:pl-[78px]' : 'lg:pl-[264px]'
        }`}
      >
        <div className="p-4 pt-20 pb-24 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
