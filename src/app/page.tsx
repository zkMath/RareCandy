"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGateModal } from "@/components/auth/AgeGateModal";
import { Hero } from "@/components/landing/Hero";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PoolOddsPreview } from "@/components/landing/PoolOddsPreview";
import { TrustSection } from "@/components/landing/TrustSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background — warm gradient + grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top right, #ebe4f3 0%, #f0ecf5 35%, #f6f3f0 65%, #faf6f3 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <Header />
      <Hero />
      <DashboardPreview />
      <HowItWorks />
      <PoolOddsPreview />
      <TrustSection />
      <CTASection />
      <Footer />
      <AgeGateModal />
    </div>
  );
}
