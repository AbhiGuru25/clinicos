'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ReceiptIndianRupee,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Billing', href: '/dashboard/billing', icon: ReceiptIndianRupee },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function ZynteqLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Z Icon Mark */}
      <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
        style={{ background: 'var(--brand-primary)' }}>
        <Activity size={22} className="text-white z-10" />
      </div>
      {/* Wordmark */}
      <div>
        <p className="font-black text-lg leading-none tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
          Clinic<span style={{ color: 'var(--brand-primary)' }}>OS</span>
        </p>
        <p className="text-[9px] font-bold tracking-[0.15em] uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>by Zynteq</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Glow Effect */}
      <div className="sidebar-glow" />

      {/* Logo */}
      <div className="p-6 pb-8">
        <ZynteqLogo />
      </div>

      {/* Nav */}
      <nav className="px-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-brand-primary font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
              style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: '#EFF6FF' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <item.icon
                size={18}
                className={`relative z-10 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-900'}`}
                style={{ color: isActive ? 'var(--brand-primary)' : 'currentColor' }}
              />
              <span className="relative z-10 text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto space-y-3">
        {/* WhatsApp Status */}
        <Link
          href="/dashboard/settings"
          className="block p-4 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer"
          style={{ background: 'var(--success-bg)', borderColor: 'rgba(22, 163, 74, 0.1)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--success-text)' }}>Live Engine Sync</span>
            </div>
            <MessageSquare size={12} style={{ color: 'var(--success-text)' }} />
          </div>
          <p className="text-[10px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            WhatsApp AI is active.<br/>
            <span className="font-bold my-1 block" style={{ color: 'var(--success-text)' }}>47 messages handled today</span>
            Click to configure.
          </p>
        </Link>

        {/* Zynteq Badge */}
        <div className="flex items-center justify-center py-2">
          <span className="zynteq-badge">Powered by Zynteq AI</span>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-semibold text-sm group"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--error-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--error-text)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <div
        className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-screen z-50 overflow-hidden"
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      >
        <SidebarContent />
      </div>

      {/* ─── Mobile Top Bar ─── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <ZynteqLogo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl transition-colors hover:bg-slate-100"
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-[70] flex flex-col overflow-hidden"
              style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors z-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--sidebar-border)'
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all touch-target"
              style={{ minHeight: '52px', justifyContent: 'center' }}
            >
              <item.icon
                size={20}
                style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)' }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)' }}
              >
                {item.name === 'Appointments' ? 'Appts' : item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute bottom-0 w-6 h-0.5 rounded-full"
                  style={{ background: 'var(--brand-primary)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
