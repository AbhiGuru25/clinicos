# ClinicOS Architecture & Workflow Guide

This document provides an A-to-Z breakdown of the **ClinicOS** application. It serves as a master reference for understanding the tech stack, database schema, frontend architecture, and the automated AI Receptionist workflow.

---

## 1. Tech Stack Overview
- **Frontend Framework:** Next.js 16.2.4 (App Router) with React 19
- **Styling:** TailwindCSS v4 with global CSS variables (`globals.css`)
- **Animations:** Framer Motion (`framer-motion`)
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Realtime WebSockets)
- **Icons & UI:** Lucide React (`lucide-react`)
- **PDF Generation:** jsPDF & jsPDF-AutoTable (`jspdf`)
- **AI Automation:** n8n (Local instance)
- **WhatsApp Gateway:** Evolution API (Local instance running on port 8081)

---

## 2. Database Schema (Supabase)
The application heavily relies on relational data linking patients to their appointments and billing.

1. **`clinics`**
   - Core tenant table (for multi-tenancy). 
   - Contains `id` (UUID), `doctor_name`, etc.
2. **`patients`**
   - `id` (UUID, Primary Key)
   - `clinic_id` (UUID, Foreign Key)
   - `name`, `phone`, `department`, `priority`
3. **`appointments`**
   - `id` (UUID, Primary Key)
   - `patient_id` (UUID, Foreign Key -> patients.id)
   - `appointment_date` (Date string: YYYY-MM-DD)
   - `appointment_time` (Time string: HH:MM)
   - `status` (Enum/String: 'confirmed', 'completed', 'cancelled')
   - `notes` (Text)
4. **`invoices`**
   - `id` (UUID, Primary Key)
   - `appointment_id` (UUID, Foreign Key -> appointments.id)
   - `amount` (Base consultation fee)
   - `gst_amount` (Tax amount)
   - `total` (Grand total)
5. **`whatsapp_messages`**
   - Stores the chat history between the AI bot and the patient.
   - `id`, `patient_id`, `sender_number`, `content`, `type` ('incoming' | 'outgoing').

---

## 3. Web App Workflow (Next.js Dashboard)
The website is located in `src/app/dashboard/` and acts as the central hub for the doctor.

### A. Dashboard Home (`/dashboard/page.tsx`)
- Displays top-level metrics (Total Patients, Revenue Today, Appointments).
- **Realtime Sync:** Uses `supabase.channel` to listen for live `INSERT` events on the `patients` and `whatsapp_messages` tables, updating the UI instantly without page reloads.
- Shows a list of today's appointments and recent WhatsApp activity.

### B. Appointments Management (`/dashboard/appointments/page.tsx`)
- Fetches all appointments joined with patient data: `.select('*, patients(name, phone)')`.
- **Booking Modal:** Allows manual creation of new appointments. It handles searching for existing patients or inserting a new row into the `patients` table before inserting the `appointments` row.
- **Completion Flow:** Clicking "Complete & Bill" opens a modal to generate an invoice. Upon submission:
  1. Updates appointment status to `completed`.
  2. Inserts a new row into the `invoices` table.

### C. Patients Directory (`/dashboard/patients/page.tsx` & `[id]/page.tsx`)
- Lists all registered patients.
- Includes a live search feature (filters by name or phone).
- **Export:** Can export the filtered list directly to a local CSV file.
- **Detailed View:** Clicking a patient routes to `[id]/page.tsx` where it fetches their specific `patients` record and a list of all their historical `appointments`.

### D. Billing & Invoices (`/dashboard/billing/page.tsx`)
- Displays a ledger of all generated invoices joined with patient data.
- **PDF Generation:** Generates a highly formatted, branded PDF invoice using `jsPDF`.
- **WhatsApp Integration:** The "Send WhatsApp" button triggers a `fetch` request directly to the local Evolution API (`http://localhost:8081/message/sendText/ClinicBot1`) to send a text summary of the invoice directly to the patient's phone.

---

## 4. AI Receptionist Workflow (n8n + Evolution API)
The true power of ClinicOS is the automated WhatsApp bot running in the background.

1. **Incoming Message:** A patient sends a WhatsApp message to the clinic's number.
2. **Evolution API:** The local Evolution API instance receives the message and fires a Webhook to the local n8n instance.
3. **n8n Webhook Node:** Captures the payload (extracting the sender's `remoteJid` (phone number) and the message text).
4. **AI Agent (ReAct):** The message is passed into an AI Agent node (powered by Groq/LLama3 or similar) equipped with Window Buffer Memory to remember the conversation context.
5. **Custom Database Tools:** 
   - **Check Availability:** The AI can query the Supabase `appointments` table to check if a specific date/time is free.
   - **Book Appointment:** If the patient wants to book, the AI uses this tool to `INSERT` a row directly into the Supabase `appointments` table (mapping patient name, phone, date, and time).
6. **Outgoing Message:** The AI formulates a natural language response (e.g., "Your appointment is booked for tomorrow at 2 PM!").
7. **Evolution API (Reply):** n8n sends an HTTP POST request back to Evolution API (`/message/sendText/ClinicBot1`), which delivers the final WhatsApp message back to the patient's phone.

---

## 5. Known Quirks & Developer Notes for Claude
- **Timezones:** When filtering dates (like "Today" vs "Tomorrow"), JavaScript `Date` objects are used natively. Be careful of UTC vs IST timezone shifts when querying Supabase.
- **Patient IDs in AI Booking:** Currently, the AI tool inserts the patient's name and phone number directly into the `notes` column of the `appointments` table (or creates a pseudo-record) because the AI doesn't dynamically resolve the UUID foreign keys yet. A future improvement is having the AI first look up or create the `patients` UUID before creating the appointment.
- **UI State:** Modals in Next.js use `framer-motion` for smooth entrance/exit animations wrapped in `<AnimatePresence>`. Ensure `isModalOpen` boolean states are toggled correctly.
