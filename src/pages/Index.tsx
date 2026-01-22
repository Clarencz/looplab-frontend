import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import StreakPreview from "@/components/StreakPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LandingNarrative from "@/components/LandingNarrative";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <LandingNarrative />
        <HowItWorks />
        <Features />
        <StreakPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
