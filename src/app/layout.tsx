import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicOS — AI-Powered Clinic Management System",
  description: "Automate appointments, patient reminders, billing and daily reports for your clinic. WhatsApp-first. No complex software. Built for Indian clinics.",
  keywords: "clinic management software india, ai appointment booking, whatsapp clinic bot, clinic automation ahmedabad, doctor appointment system",
  openGraph: {
    title: "ClinicOS — AI-Powered Clinic Management",
    description: "Save 4 hours daily. Automate appointments, reminders, billing via WhatsApp AI.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
