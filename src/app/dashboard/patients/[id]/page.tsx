'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Phone, Activity, Clock, Edit } from 'lucide-react';

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  async function fetchPatientDetails() {
    try {
      // Fetch Patient
      const { data: pData, error: pError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (pError) throw pError;
      setPatient(pData);

      // Fetch Appointments
      const { data: aData, error: aError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', id)
        .order('appointment_date', { ascending: false });
      
      if (aError) throw aError;
      setAppointments(aData || []);

    } catch (err) {
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-20 text-center text-slate-400 font-bold">Loading patient records...</div>;
  }

  if (!patient) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Patient Not Found</h2>
        <button onClick={() => router.back()} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Patients
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">{patient.name}</h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Registered: {new Date(patient.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="clinic-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Patient Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-blue-500" />
                  <span className="font-bold text-slate-700">Total Visits</span>
                </div>
                <span className="font-black text-slate-900">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-emerald-500" />
                  <span className="font-bold text-slate-700">Last Visit</span>
                </div>
                <span className="font-bold text-slate-900">
                  {appointments.length > 0 ? new Date(appointments[0].appointment_date).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="clinic-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Appointment History</h3>
            
            {appointments.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 mb-1">{new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-xs font-medium text-slate-500">{apt.notes || 'Routine Checkup'}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                      <span className="font-bold text-slate-700">{apt.appointment_time}</span>
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                        apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
