"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Testimonials from "@/src/components/landing/Testimonials";
import FAQ from "@/src/components/landing/FAQ";
import { ROUTES } from "@/src/constants";

const LandingPage = () => {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login, redirect ke dashboard
    if (!loading && user && token) {
      console.log("[LandingPage] User already logged in. Redirecting to dashboard...");
      router.replace(ROUTES.workspace.dashboard);
    }
  }, [user, token, loading, router]);

  // Jika sedang loading auth, show nothing
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika sudah login, return null (akan redirect)
  if (user && token) {
    return null;
  }

  // Tampilkan landing page hanya untuk user yang belum login
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default LandingPage;