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
    // Redirect authenticated users to the workspace dashboard
    if (!loading && user && token) {
      router.replace(ROUTES.workspace.dashboard);
      return;
    }

    setHasCheckedAuth(true);
  }, [user, token, loading, router]);

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
