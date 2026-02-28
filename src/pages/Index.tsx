import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LandingNarrative from "@/components/LandingNarrative";
import SeeingTheoryBackground from "@/components/SeeingTheoryBackground";

const Index = () => {
  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-background">
      {/* Absolute background directly inside the relative parent */}
      <SeeingTheoryBackground />

      {/* Page content sits above the ballpit */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <LandingNarrative />
          <HowItWorks />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
