import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import BackgroundDecor from "@/components/BackgroundDecor";
import Problem from "@/components/Problem";
import Marquee from "@/components/Marquee";
import WhatsAppDemo from "@/components/WhatsAppDemo";
import DashboardShowcase from "@/components/DashboardShowcase";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#F4F1EA', position: 'relative' }}>
      <BackgroundDecor />
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Problem />
      <Features />
      <DashboardShowcase />
      <HowItWorks />
      <WhatsAppDemo />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
