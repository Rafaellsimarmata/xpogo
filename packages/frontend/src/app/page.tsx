import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Statistics from "@/src/components/landing/Statistics";
import CTA from "@/src/components/landing/CTA";

const LandingPage = () => (
  <div className="bg-background">
    <Hero />
    <Features />
    <HowItWorks />
    <Statistics />
    <CTA />
  </div>
);

export default LandingPage;
