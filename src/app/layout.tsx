import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicOS by Zynteq — AI-Powered Clinic Management",
  description: "Automate appointments, patient reminders, billing and daily reports for your clinic. WhatsApp-first. No complex software. Built for Indian clinics by Zynteq.",
  keywords: "clinic management software india, ai appointment booking, whatsapp clinic bot, clinic automation ahmedabad, zynteq clinicos",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  themeColor: "#0B3530",
  openGraph: {
    title: "ClinicOS by Zynteq — AI-Powered Clinic Management",
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
