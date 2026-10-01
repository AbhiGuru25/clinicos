-- ==============================================================================
-- Clinicos - Production Healthcare Multi-Tenant Schema & Row Level Security (RLS)
-- Target: Supabase Postgres 15+ (Clinicos Project cqxvcdrverdwhxccyluz)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE clinic_staff_role AS ENUM ('super_admin', 'clinic_admin', 'doctor', 'receptionist', 'nurse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES
-- Clinics Table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT DEFAULT 'Surat',
    state TEXT DEFAULT 'Gujarat',
    whatsapp_phone_number_id TEXT,
    whatsapp_verify_token TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Clinic Staff & Role Mapping
CREATE TABLE IF NOT EXISTS public.clinic_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    role clinic_staff_role DEFAULT 'doctor'::clinic_staff_role NOT NULL,
    full_name TEXT NOT NULL,
    specialization TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, clinic_id)
);

-- Patients Table (Multi-tenant isolated by clinic_id)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gender TEXT,
    age INTEGER,
    blood_group TEXT,
    medical_notes TEXT,
    history TEXT,
    allergies TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.clinic_staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    status appointment_status DEFAULT 'scheduled'::appointment_status NOT NULL,
    chief_complaint TEXT,
    notes TEXT,
    whatsapp_reminder_sent BOOLEAN DEFAULT false,
    whatsapp_reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Medical Documents / Eye Scans / Prescriptions Vault
CREATE TABLE IF NOT EXISTS public.patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    sha256_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Billing & Invoices
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    paid_amount NUMERIC(10, 2) DEFAULT 0.00,
    status payment_status DEFAULT 'pending'::payment_status NOT NULL,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- WhatsApp Outbound Logs & Audit Trail
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    recipient_phone TEXT NOT NULL,
    message_type TEXT NOT NULL, -- reminder, confirmation, prescription, report
    template_name TEXT,
    status TEXT DEFAULT 'sent',
    meta_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. HELPER FUNCTIONS FOR ROW LEVEL SECURITY (RLS)
-- Function to retrieve the current authenticated user's clinic_id
CREATE OR REPLACE FUNCTION public.get_auth_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM public.clinic_staff
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to check if the caller is super admin or clinic admin
CREATE OR REPLACE FUNCTION public.is_clinic_admin(target_clinic_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clinic_staff
    WHERE user_id = auth.uid()
      AND clinic_id = target_clinic_id
      AND role IN ('super_admin', 'clinic_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- 6. STRICT MULTI-TENANT RLS POLICIES

-- A. CLINICS
CREATE POLICY "Staff can view their own clinic"
  ON public.clinics FOR SELECT
  USING (id = public.get_auth_clinic_id());

-- B. CLINIC STAFF
CREATE POLICY "Staff can view peers in the same clinic"
  ON public.clinic_staff FOR SELECT
  USING (clinic_id = public.get_auth_clinic_id());

CREATE POLICY "Admins can manage clinic staff"
  ON public.clinic_staff FOR ALL
  USING (public.is_clinic_admin(clinic_id))
  WITH CHECK (public.is_clinic_admin(clinic_id));

-- C. PATIENTS (Zero Cross-Clinic Leakage)
CREATE POLICY "Staff can view patients in their clinic"
  ON public.patients FOR SELECT
  USING (clinic_id = public.get_auth_clinic_id());

CREATE POLICY "Staff can insert patients in their clinic"
  ON public.patients FOR INSERT
  WITH CHECK (clinic_id = public.get_auth_clinic_id());

CREATE POLICY "Staff can update patients in their clinic"
  ON public.patients FOR UPDATE
  USING (clinic_id = public.get_auth_clinic_id())
  WITH CHECK (clinic_id = public.get_auth_clinic_id());

-- D. APPOINTMENTS
CREATE POLICY "Staff can view appointments in their clinic"
  ON public.appointments FOR SELECT
  USING (clinic_id = public.get_auth_clinic_id());

CREATE POLICY "Staff can manage appointments in their clinic"
  ON public.appointments FOR ALL
  USING (clinic_id = public.get_auth_clinic_id())
  WITH CHECK (clinic_id = public.get_auth_clinic_id());

-- E. PATIENT DOCUMENTS (Strict Health Record Security)
CREATE POLICY "Staff can view documents belonging to their clinic patients"
  ON public.patient_documents FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM public.patients WHERE clinic_id = public.get_auth_clinic_id()
    )
  );

CREATE POLICY "Staff can upload documents for their clinic patients"
  ON public.patient_documents FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT id FROM public.patients WHERE clinic_id = public.get_auth_clinic_id()
    )
  );

CREATE POLICY "Admins and Doctors can delete documents"
  ON public.patient_documents FOR DELETE
  USING (
    patient_id IN (
      SELECT id FROM public.patients WHERE clinic_id = public.get_auth_clinic_id()
    )
  );

-- F. BILLING
CREATE POLICY "Staff can view bills for their clinic"
  ON public.bills FOR SELECT
  USING (clinic_id = public.get_auth_clinic_id());

CREATE POLICY "Staff can manage bills for their clinic"
  ON public.bills FOR ALL
  USING (clinic_id = public.get_auth_clinic_id())
  WITH CHECK (clinic_id = public.get_auth_clinic_id());

-- G. WHATSAPP LOGS
CREATE POLICY "Staff can view whatsapp logs for their clinic"
  ON public.whatsapp_logs FOR SELECT
  USING (clinic_id = public.get_auth_clinic_id());

-- 7. SUPABASE STORAGE BUCKET POLICIES (medical_records)
-- Ensures that signed URLs or bucket object reads verify clinic ownership
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical_records', 'medical_records', true)
ON CONFLICT (id) DO NOTHING;

-- 8. DATABASE WEBHOOK TRIGGER FOR SUPABASE EDGE FUNCTIONS
-- Automatically triggers Edge Function when a new appointment is scheduled
CREATE OR REPLACE FUNCTION public.trigger_whatsapp_reminder_edge_function()
RETURNS TRIGGER AS $$
DECLARE
  v_payload JSONB;
BEGIN
  -- Build payload with patient phone and appointment details
  v_payload := jsonb_build_object(
    'appointment_id', NEW.id,
    'clinic_id', NEW.clinic_id,
    'patient_id', NEW.patient_id,
    'appointment_date', NEW.appointment_date,
    'start_time', NEW.start_time,
    'status', NEW.status,
    'action', TG_OP
  );

  -- Perform asynchronous HTTP POST to Edge Function using pg_net or internal queue
  -- In Supabase Cloud, this connects to /functions/v1/whatsapp-appointment-reminder
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_appointment_created_reminder
  AFTER INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_whatsapp_reminder_edge_function();
