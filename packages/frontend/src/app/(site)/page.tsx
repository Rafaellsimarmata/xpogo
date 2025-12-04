import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Testimonials from "@/src/components/landing/Testimonials";
import FAQ from "@/src/components/landing/FAQ";

const LandingPage = () => (
  <div className="bg-gradient-to-b from-blue-50/20 via-white to-blue-50/10">
    <Hero />
    <Features />
    <HowItWorks />
    <Testimonials />
    <FAQ />
  </div>
);

export default LandingPage;
