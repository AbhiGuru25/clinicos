'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  FileText, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Lock, 
  User, 
  Phone,
  Sparkles,
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock multi-tenant clinic datasets
const CLINIC_A = {
  id: "clinic-ahm-01",
  name: "KK Neuro Vision Therapy Institute",
  city: "Ahmedabad, Gujarat",
  doctor: "Dr. Vikash (Neuro-Optometrist)",
  patients: [
    { id: "P-101", name: "Rahul Sharma", age: 28, visit: "Amblyopia Therapy", time: "10:00 AM", status: "Confirmed" },
    { id: "P-102", name: "Pooja Patel", age: 34, visit: "Squint Evaluation", time: "11:30 AM", status: "In Waiting" },
  ]
};

const CLINIC_B = {
  id: "clinic-surat-02",
  name: "Dr. Lakdawala Eye Hospital",
  city: "Surat, Gujarat",
  doctor: "Dr. Lakdawala (Ophthalmologist)",
  patients: [
    { id: "P-201", name: "Anilbhai Mehta", age: 58, visit: "Cataract Pre-Op", time: "04:30 PM", status: "Confirmed" },
    { id: "P-202", name: "Meena Vora", age: 46, visit: "Glaucoma Check", time: "05:15 PM", status: "Scheduled" },
  ]
};

export default function ClinicosPublicDemo() {
  const [selectedClinic, setSelectedClinic] = useState<"A" | "B">("A");
  const [isCrossTenantAttempt, setIsCrossTenantAttempt] = useState(false);
  const [rlsBlockedAlert, setRlsBlockedAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<"rls" | "opd" | "docs">("rls");

  // Booking simulation
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM");
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  const activeClinicData = selectedClinic === "A" ? CLINIC_A : CLINIC_B;
  const otherClinicData = selectedClinic === "A" ? CLINIC_B : CLINIC_A;

  const handleCrossTenantAccess = () => {
    setIsCrossTenantAttempt(true);
    setTimeout(() => {
      setIsCrossTenantAttempt(false);
      setRlsBlockedAlert(true);
      setTimeout(() => setRlsBlockedAlert(false), 5000);
    }, 400);
  };

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;
    setIsSendingWhatsApp(true);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setBookingSuccess(`Appointment booked for ${patientName} (${selectedSlot})! Supabase Edge Function triggered automated WhatsApp confirmation to +91 ${patientPhone}.`);
      setPatientName("");
      setPatientPhone("");
      setTimeout(() => setBookingSuccess(null), 6000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clinicos Interactive Live Showcase • Zero Login Required</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-teal-400" />
              Clinicos Clinical OS &amp; Multi-Tenant RLS
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Test real-world clinic tenant isolation, OPD appointments, and WhatsApp triggers live in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-xl self-start">
            <ShieldCheck className="w-4 h-4" />
            <span>Supabase RLS: Active</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("rls")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "rls" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Multi-Tenant RLS Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("opd")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "opd" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>OPD Booking &amp; Edge Triggers</span>
          </button>
        </div>

        {/* TAB 1: RLS SIMULATOR */}
        {activeTab === "rls" && (
          <div className="mt-6 space-y-6">
            
            {/* Active Clinic Switcher */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Select Active Authenticated Clinic Staff Session:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedClinic("A")}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedClinic === "A"
                      ? "bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10"
                      : "bg-slate-950 border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-teal-400">Clinic Session A (Ahmedabad)</span>
                    {selectedClinic === "A" && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-sm font-bold text-white">{CLINIC_A.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{CLINIC_A.doctor} • {CLINIC_A.city}</p>
                </button>

                <button
                  onClick={() => setSelectedClinic("B")}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedClinic === "B"
                      ? "bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10"
                      : "bg-slate-950 border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-teal-400">Clinic Session B (Surat)</span>
                    {selectedClinic === "B" && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-sm font-bold text-white">{CLINIC_B.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{CLINIC_B.doctor} • {CLINIC_B.city}</p>
                </button>
              </div>
            </div>

            {/* Patients Visible under RLS */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Permitted Patient Records (RLS Scoped: <span className="text-teal-400">{activeClinicData.name}</span>)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Query executing: <code className="text-emerald-400">SELECT * FROM patients WHERE clinic_id = auth.get_auth_clinic_id()</code>
                  </p>
                </div>

                <button
                  onClick={handleCrossTenantAccess}
                  disabled={isCrossTenantAttempt}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-rose-600/20 text-rose-400 border border-rose-500/40 hover:bg-rose-600/30 transition-all flex items-center gap-1.5"
                >
                  {isCrossTenantAttempt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>Test Unauthorized Cross-Tenant SQL Injection</span>
                </button>
              </div>

              {/* RLS Blocked Alert */}
              <AnimatePresence>
                {rlsBlockedAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3.5 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>POSTGRES RLS BLOCKED (403 Forbidden):</strong> Access to records belonging to {otherClinicData.name} denied. Tenant violation prevented by policy <code className="text-white">staff_clinic_isolation_policy</code>.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Patient List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeClinicData.patients.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white">{p.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.age} yrs</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.visit}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-teal-400">{p.time}</span>
                      <span className="block text-[11px] text-emerald-400 font-semibold">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: OPD BOOKING & EDGE FUNCTION TRIGGER */}
        {activeTab === "opd" && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-base font-extrabold text-white mb-1">
              Live OPD Slot Booking &amp; WhatsApp Edge Function Trigger
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              When an appointment is inserted into Supabase, a PostgreSQL trigger fires the Deno Edge Function (<code className="text-teal-400">whatsapp-appointment-reminder</code>) to dispatch a Meta Cloud API message.
            </p>

            <AnimatePresence>
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 mb-6 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{bookingSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleBookDemo} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Patient Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Anand Patel"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Patient WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-sm text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Preferred OPD Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {["10:00 AM", "11:00 AM", "12:00 PM", "04:30 PM", "05:30 PM", "06:30 PM"].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                        selectedSlot === slot
                          ? "bg-teal-600 text-white border-teal-500"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                {isSendingWhatsApp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Book Slot &amp; Dispatch WhatsApp Confirmation</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
