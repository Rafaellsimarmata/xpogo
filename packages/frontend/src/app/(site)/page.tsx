"use client";

import { useEffect, useState } from "react";
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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Immediate redirect for authenticated users
    if (!loading && user && token) {
      console.log("[LandingPage] User already logged in. Redirecting immediately to dashboard...");
      router.replace(ROUTES.workspace.dashboard);
      return;
    }

    setHasCheckedAuth(true);
  }, [user, token, loading, router]);

  // Show nothing while checking auth
  if (!hasCheckedAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Tampilkan landing page hanya untuk user yang belum login
  if (user && token) {
    return null;
  }

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