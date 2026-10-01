'use client';
import { useState, useEffect, use } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Phone, Activity, Clock, Edit, FileText, Plus, X, Download, Send, MessageSquare, CheckCircle2, User } from 'lucide-react';
import MedicalDocuments from '@/components/MedicalDocuments';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPatientDocument } from '@/lib/patientDocuments';

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editHistory, setEditHistory] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Prescription Modal State
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<any>(null);
  const [medicines, setMedicines] = useState<{name: string, dosage: string, frequency: string, duration: string}[]>([]);
  const [newMedicine, setNewMedicine] = useState({name: '', dosage: '', frequency: '', duration: ''});
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  async function fetchPatientDetails() {
    try {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      if (data.success && data.patient) {
        setPatient(data.patient);
        setEditName(data.patient.name || '');
        setEditPhone(data.patient.phone || '');
        setEditHistory(data.patient.history || '');
        setAppointments(data.appointments || []);
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          history: editHistory
        })
      });
      const data = await res.json();
      if (data.success) {
        setPatient(data.patient);
        setIsEditModalOpen(false);
        alert('✅ Patient Profile Updated Successfully!');
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      alert(`Edit Error: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setMedicines([...medicines, newMedicine]);
      setNewMedicine({name: '', dosage: '', frequency: '', duration: ''});
    }
  };

  const generatePrescriptionPDF = async () => {
    const doc = new jsPDF();
    const patientName = patient.name || 'Valued Patient';
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(124, 58, 237); // Violet-600
    doc.text('ClinicOS  |  by Zynteq', 14, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Smart Medical Management', 14, 32);
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text('KK Neuro Vision Therapy Institute', 140, 20);
    doc.text('Dr. Vikash & Team', 140, 26);
    
    // Patient Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Medical Prescription', 14, 50);
    doc.setFontSize(10);
    doc.text(`Patient: ${patientName}`, 14, 60);
    doc.text(`Phone: ${patient.phone || 'N/A'}`, 14, 66);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 140, 60);

    // Medicines Table
    const tableData = medicines.map(m => [m.name, m.dosage, m.frequency, m.duration]);
    (doc as any).autoTable({
      startY: 75,
      head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] }
    });

    // Notes
    if (prescriptionNotes) {
      const finalY = (doc as any).lastAutoTable.finalY || 75;
      doc.text('Doctor Advice & Notes:', 14, finalY + 15);
      doc.text(prescriptionNotes, 14, finalY + 22, { maxWidth: 180 });
    }

    // Save
    const filename = `Prescription_${patientName.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);

    // Silently upload to Supabase medical_records
    try {
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      const { doc: uploadedDoc, error } = await uploadPatientDocument(id, pdfFile);
      if (!error && uploadedDoc) {
        setRefreshKey(prev => prev + 1);
      }
    } catch (uploadErr) {
      console.error('Failed to auto-upload prescription PDF:', uploadErr);
    }
  };

  const sendPrescriptionWhatsApp = async () => {
    if (!patient.phone) {
      alert("No phone number on file for this patient.");
      return;
    }
    
    const patientName = patient.name || 'Valued Patient';
    const medList = medicines.map(m => `• *${m.name}* (${m.dosage}) — ${m.frequency} for ${m.duration}`).join('\n');
    const message = `Hello *${patientName}*!\n\nYour prescription has been issued by Dr. Vikash at *KK Neuro Vision Therapy Institute*.\n\n💊 *Prescribed Medicines:*\n${medList}\n\n📝 *Doctor Advice:*\n${prescriptionNotes || 'Take medications as directed.'}\n\nGet well soon! 🙏\n- KK Neuro Vision Therapy Institute`;
    
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: patient.phone,
          message: message,
          patient_id: id
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.deliveredViaApi) {
          alert(`✅ Prescription sent via WhatsApp to ${patientName}!`);
        } else {
          window.open(data.waWebUrl, '_blank');
        }
      } else {
        alert(data.error || 'Failed to send prescription.');
      }
    } catch (e: any) {
      const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-400 font-bold">Loading patient file...</div>;
  }

  if (!patient) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Patient File Not Found</h2>
        <button onClick={() => router.back()} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      {/* ─── Back Button ─── */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Patients Directory
      </button>

      {/* ─── Profile Header & Quick Actions Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">{patient.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Phone size={15} className="text-blue-600" /> {patient.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-emerald-600" /> Registered: {new Date(patient.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {patient.phone && (
            <>
              <a 
                href={`tel:${patient.phone}`} 
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1.5"
                title="Call Patient"
              >
                <Phone size={15} className="text-blue-600" /> Call
              </a>
              <a 
                href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all font-bold text-xs flex items-center gap-1.5"
                title="WhatsApp Patient"
              >
                <MessageSquare size={15} className="text-emerald-600" /> WhatsApp
              </a>
            </>
          )}

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 shadow-sm"
          >
            <Edit size={16} className="text-blue-600" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ─── Grid Overview & History ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Patient Overview & Notes */}
        <div className="md:col-span-1 space-y-6">
          <div className="clinic-card p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Patient Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-blue-500" />
                  <span className="font-bold text-slate-700 text-sm">Total OPD Visits</span>
                </div>
                <span className="font-black text-slate-900 text-base">{appointments.length}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-emerald-500" />
                  <span className="font-bold text-slate-700 text-sm">Last Visit Date</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  {appointments.length > 0 ? new Date(appointments[0].appointment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                </span>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Medical Notes & History</h4>
                <button onClick={() => setIsEditModalOpen(true)} className="text-[11px] font-bold text-blue-600 hover:underline">Edit</button>
              </div>
              <p className="text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {patient.history || 'No medical notes added yet.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment History Queue */}
        <div className="md:col-span-2">
          <div className="clinic-card p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Appointment & OPD Visit History</h3>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl border-slate-200 bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-blue-500" />
                </div>
                <p className="text-slate-700 font-extrabold text-sm mb-1">No Appointments Found</p>
                <p className="text-xs text-slate-400">Visits booked via Omnidim Voice AI or Walk-in appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm mb-0.5">
                        {new Date(apt.appointment_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs font-medium text-slate-500">{apt.notes || 'Routine Consultation'}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      <span className="font-bold text-slate-700 text-sm">{apt.appointment_time}</span>
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                        apt.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {apt.status || 'Confirmed'}
                      </span>
                      <button 
                        onClick={() => { setActiveAppointment(apt); setIsPrescriptionModalOpen(true); }} 
                        className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
                        title="Create Medical Prescription"
                      >
                        <Plus size={13} />
                        <span>+ Rx</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Medical Documents & Reports Section ─── */}
      <div className="clinic-card p-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Medical Documents & Eye Scans</h3>
        <MedicalDocuments patientId={id} key={refreshKey} />
      </div>

      {/* ─── Edit Patient Profile Modal (React Portal) ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-5 md:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Edit Patient Profile</h2>
                      <p className="text-xs font-medium text-slate-500">Update medical record details</p>
                    </div>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={18} /></button>
                </div>

                {/* Form Content - Scrollable */}
                <form onSubmit={handleSaveProfile} className="p-5 md:p-6 space-y-4 overflow-y-auto flex-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Patient Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm outline-none bg-slate-50/50 focus:bg-white focus:border-blue-500 text-slate-900" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Mobile Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={editPhone} 
                      onChange={e => setEditPhone(e.target.value)} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm outline-none bg-slate-50/50 focus:bg-white focus:border-blue-500 text-slate-900" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Medical History & Clinical Notes</label>
                    <textarea 
                      rows={3} 
                      value={editHistory} 
                      onChange={e => setEditHistory(e.target.value)} 
                      placeholder="e.g. Amblyopia evaluation, vision therapy progress..." 
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-blue-500 text-slate-900 resize-none" 
                    />
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex items-center gap-3">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                    <button type="submit" disabled={savingProfile} className="w-1/2 btn-primary text-xs py-2.5 font-extrabold shadow-md shadow-blue-500/20">{savingProfile ? 'Saving...' : 'Save Profile'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── New Prescription Modal (React Portal) ─── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isPrescriptionModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrescriptionModalOpen(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[85vh]">
                <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/80 to-white shrink-0">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">New Prescription (+Rx)</h2>
                    <p className="text-xs font-semibold text-slate-500">Patient: {patient?.name}</p>
                  </div>
                  <button onClick={() => setIsPrescriptionModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Add Medication</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-2.5">
                      <input type="text" placeholder="Medicine Name" className="col-span-2 md:col-span-1 p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-purple-500 outline-none text-slate-900" value={newMedicine.name} onChange={e => setNewMedicine({...newMedicine, name: e.target.value})} />
                      <input type="text" placeholder="Dosage (500mg)" className="p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-purple-500 outline-none text-slate-900" value={newMedicine.dosage} onChange={e => setNewMedicine({...newMedicine, dosage: e.target.value})} />
                      <input type="text" placeholder="Freq (1-0-1)" className="p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-purple-500 outline-none text-slate-900" value={newMedicine.frequency} onChange={e => setNewMedicine({...newMedicine, frequency: e.target.value})} />
                      <input type="text" placeholder="Duration (5 Days)" className="p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-purple-500 outline-none text-slate-900" value={newMedicine.duration} onChange={e => setNewMedicine({...newMedicine, duration: e.target.value})} />
                    </div>
                    <button onClick={handleAddMedicine} className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors border border-purple-100">+ Add to Prescription</button>
                  </div>

                  {medicines.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <span>Medicine</span><span>Dosage</span><span>Frequency</span><span>Duration</span>
                      </div>
                      {medicines.map((m, i) => (
                        <div key={i} className="px-4 py-2.5 border-b last:border-b-0 border-slate-100 grid grid-cols-4 text-xs font-bold text-slate-900">
                          <span>{m.name}</span><span>{m.dosage}</span><span>{m.frequency}</span><span>{m.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Doctor Advice & Notes</label>
                    <textarea rows={3} className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-purple-500 outline-none resize-none text-slate-900" placeholder="e.g. Vision therapy exercises 20 mins daily..." value={prescriptionNotes} onChange={e => setPrescriptionNotes(e.target.value)}></textarea>
                  </div>
                </div>

                <div className="p-5 md:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <button onClick={() => setIsPrescriptionModalOpen(false)} className="px-4 py-2 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                  <div className="flex gap-2">
                    <button onClick={generatePrescriptionPDF} className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-md">
                      <Download size={14} /> Save PDF
                    </button>
                    <button onClick={sendPrescriptionWhatsApp} className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                      <Send size={14} /> Send WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
