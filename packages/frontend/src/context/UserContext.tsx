"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import { useAuth } from "./AuthContext";
import type { UserContextValue, UserProfile } from "@/src/types/user";

const defaultProfile: UserProfile = {
  fullName: "Alya Pratama",
  username: "alya",
  company: "Nusantara Craft",
  businessName: "Nusantara Craft",
  businessType: "Kerajinan Kayu",
  onboardingComplete: false,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Sync user data from AuthContext to UserProfile
  useEffect(() => {
    if (user) {
      startTransition(() => {
        setProfile((prev) => ({
          ...prev,
          fullName: user.name,
          username: user.name,
          company: user.company,
          businessName: user.company,
        }));
      });
    }
  }, [user]);

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
