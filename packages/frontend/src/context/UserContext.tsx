"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";

export type UserProfile = {
  fullName: string;
  username: string;
  company: string;
  businessType: string;
  onboardingComplete: boolean;
  focusProduct?: string;
  targetCountry?: string;
};

type UserContextValue = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboardingComplete: (status: boolean) => void;
};

const defaultProfile: UserProfile = {
  fullName: "Alya Pratama",
  username: "alya",
  company: "Nusantara Craft",
  businessType: "Kerajinan Kayu",
  onboardingComplete: false,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const setOnboardingComplete = useCallback((status: boolean) => {
    setProfile((prev) => ({ ...prev, onboardingComplete: status }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      setOnboardingComplete,
    }),
    [profile, updateProfile, setOnboardingComplete],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
