import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Testimonials from "@/src/components/landing/Testimonials";
import FAQ from "@/src/components/landing/FAQ";

const LandingPage = () => (
  <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
    <Hero />
    <Features />
    <HowItWorks />
    <Testimonials />
    <FAQ />
  </div>
);

export default LandingPage;