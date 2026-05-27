# ClinicOS Complete Feature List

Here is the master list of all functionality currently available and working in your ClinicOS system across both the AI automation backend and the Next.js Web Dashboard.

## 🤖 1. AI WhatsApp Receptionist (Automated Backend)
* **24/7 Automated Responses:** Powered by Groq/LLama3 via n8n, connected directly to your local Evolution API.
* **Conversational Memory:** Uses a window buffer to remember the context of the conversation with the patient.
* **Live Availability Checking:** The AI can securely query your Supabase database in real-time to check for open appointment slots.
* **Automated Booking:** The AI can take a patient's name and phone number and instantly insert a confirmed appointment into your database without any human intervention.

## 📊 2. Dashboard Home (`/dashboard`)
* **Real-time Live Sync:** Uses Supabase WebSockets to instantly update the screen when a new patient books via WhatsApp, without needing to refresh the page.
* **Key Metrics at a Glance:** Tracks Today's Visits, Total Patients, and Today's Revenue.
* **Live Activity Feed:** A scrolling feed showing the most recent WhatsApp messages exchanged between your patients and the AI.

## 📅 3. Appointments Management (`/dashboard/appointments`)
* **Interactive Schedule:** View all appointments, sortable by "Today", "Tomorrow", "This Week", and filterable by status (Pending, Confirmed, Completed).
* **Manual Booking Modal:** A fully functional UI to manually book appointments. It includes a live search dropdown to select existing patients, or a toggle to instantly register a new patient on the fly.
* **Visit Completion Workflow:** A "Complete & Bill" button that changes the appointment status to completed and immediately opens the invoice generation screen.

## 👥 4. Patient Directory (`/dashboard/patients`)
* **Centralized Database:** A complete, searchable ledger of every patient registered at the clinic.
* **Live Search:** Instantly filter patients by typing their name or phone number.
* **Detailed Medical Profiles:** Clicking on a patient opens their dedicated profile page (`[id]/page.tsx`), showing their total visits, registration date, and a complete history of every past appointment they've had.
* **Data Export:** A one-click "Export CSV" button to download your entire patient database to an Excel/CSV file.

## 💳 5. Billing & Invoices (`/dashboard/billing`)
* **Financial Analytics:** Tracks total clinic revenue and displays a visual 7-day revenue trend chart.
* **Automated Invoice Generation:** Completing an appointment generates an invoice. You can set the consultation fee and apply standard GST rates (0%, 5%, 12%, 18%).
* **Professional PDF Generation:** A "Download PDF" button that generates a beautiful, branded clinic invoice with the patient's details and the GST breakdown using `jsPDF`.
* **WhatsApp Invoice Delivery:** A "Send WhatsApp" button on each invoice that communicates directly with your Evolution API to text a professional summary of the bill straight to the patient's phone.
* **Ledger Export:** A search-filterable invoice ledger with its own CSV Export button for your accountant.
