'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ReceiptIndianRupee,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'OPD Desk', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', href: '/dashboard/appointments', icon: CalendarDays },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Billing', href: '/dashboard/billing', icon: ReceiptIndianRupee },
  { name: 'Setup', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    try {
      supabase.auth.signOut().catch(console.error);
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/login';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`${collapsed ? 'p-4 pb-3 flex justify-center' : 'p-5 pb-4'}`}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-lg bg-[#0E7C6B] border border-[#0A5C4F] flex items-center justify-center shrink-0">
            <Stethoscope size={20} className="text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0E7C6B] border border-[#0A5C4F] flex items-center justify-center shrink-0">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-[19px] leading-none text-white tracking-tight">
                ClinicOS
              </p>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7FB3A6] mt-1">
                KK Neuro Vision
              </p>
            </div>
          </div>
        )}
      </div>

      <nav className={`${collapsed ? 'px-2.5' : 'px-3'} flex-1 space-y-1`}>
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E9A8E]">
            Clinic
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center ${collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg transition-all duration-150 border ${
                isActive
                  ? 'bg-[#FFFDF8] text-[#0B3530] border-[#FFFDF8]'
                  : 'text-[#9DBFAC] border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={19} className={`shrink-0 ${isActive ? 'text-[#0E7C6B]' : ''}`} />
              {!collapsed && <span className="text-[13.5px] font-bold">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`${collapsed ? 'p-2.5' : 'p-3'} mt-auto space-y-2`}>
        {!collapsed && (
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2.5 hover:bg-emerald-300/20 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
            <span className="text-[12px] font-bold text-emerald-100">WhatsApp AI • On</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'} w-full rounded-lg font-semibold text-[13px] text-[#9DBFAC] hover:text-white hover:bg-white/5 transition-all cursor-pointer`}
        >
          <LogOut size={17} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop rail ─── */}
      <div className={`hidden lg:flex flex-col sidebar-rail fixed left-0 top-0 h-screen z-50 bg-[#0B3530] border-r border-[#155E54] ${collapsed ? 'w-[78px]' : 'w-[264px]'}`}>
        <SidebarContent />
        {/* Collapse toggle on the edge */}
        <button
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand ( [ )' : 'Collapse ( [ )'}
          className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#C9C0AC] text-[#0B3530] flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* ─── Mobile top bar ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0B3530] border-b border-[#155E54]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E7C6B] flex items-center justify-center">
            <Stethoscope size={17} className="text-white" />
          </div>
          <span className="font-display font-semibold text-white text-lg">ClinicOS</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-white hover:bg-white/10" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-[70] bg-[#0B3530]"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg text-slate-200 hover:bg-white/10 z-10" aria-label="Close menu">
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Mobile bottom tabs ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 bg-[#0B3530]/95 backdrop-blur border-t border-[#155E54]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg touch-target justify-center">
              <item.icon size={20} className={isActive ? 'text-emerald-200' : 'text-[#6E9A8E]'} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-100' : 'text-[#6E9A8E]'}`}>
                {item.name === 'OPD Desk' ? 'Desk' : item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
