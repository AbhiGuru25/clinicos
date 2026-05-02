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
  X
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
        style={{ background: 'linear-gradient(135deg, #6C5CE7, #4F46E5)' }}>
        <span className="text-white font-black text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Z</span>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 70% 30%, white, transparent)' }} />
      </div>
      {/* Wordmark */}
      <div>
        <p className="text-white font-black text-lg leading-none tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Clinic<span style={{ color: '#A29BFE' }}>OS</span>
        </p>
        <p className="text-[9px] font-bold tracking-[0.15em] uppercase mt-0.5" style={{ color: '#6C5CE7' }}>by Zynteq</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
                  ? 'text-white'
                  : 'text-[#A0A0B8] hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.4), rgba(79,70,229,0.3))' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <item.icon
                size={18}
                className={`relative z-10 transition-colors ${isActive ? 'text-[#A29BFE]' : 'text-[#606080] group-hover:text-[#A0A0B8]'}`}
              />
              <span className="relative z-10 text-sm font-semibold">{item.name}</span>
              {isActive && (
                <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full pulse-purple" style={{ background: '#A29BFE' }} />
              )}
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
          style={{ background: 'rgba(108,92,231,0.08)', borderColor: 'rgba(108,92,231,0.2)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A29BFE]">Live Engine Sync</span>
            </div>
            <MessageSquare size={12} style={{ color: '#6C5CE7' }} />
          </div>
          <p className="text-[10px] font-medium leading-relaxed" style={{ color: '#606080' }}>
            WhatsApp AI is active. Click to configure.
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
          style={{ color: '#606080' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#EF4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#606080'; }}
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
        style={{ background: '#0F0F1A', borderRight: '1px solid rgba(108,92,231,0.12)' }}
      >
        <SidebarContent />
      </div>

      {/* ─── Mobile Top Bar ─── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: '#0F0F1A', borderBottom: '1px solid rgba(108,92,231,0.15)' }}
      >
        <ZynteqLogo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
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
              className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-[70] flex flex-col overflow-hidden"
              style={{ background: '#0F0F1A', borderRight: '1px solid rgba(108,92,231,0.15)' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-white/50 hover:bg-white/10 transition-colors z-10"
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
          background: 'rgba(15,15,26,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(108,92,231,0.15)'
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
                style={{ color: isActive ? '#A29BFE' : '#505070' }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: isActive ? '#A29BFE' : '#505070' }}
              >
                {item.name === 'Appointments' ? 'Appts' : item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute bottom-0 w-6 h-0.5 rounded-full"
                  style={{ background: '#6C5CE7' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
