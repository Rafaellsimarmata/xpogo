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

const createDefaultProfile = (userName?: string, company?: string): UserProfile => ({
  fullName: userName || "Alya Pratama",
  username: userName || "alya",
  company: company || "Nusantara Craft",
  businessName: company || "Nusantara Craft",
  businessType: "Kerajinan Kayu",
  onboardingComplete: false,
});

const STORAGE_PREFIX = "xpogo_profile_";

const getStorageKey = (userId?: string | null) => `${STORAGE_PREFIX}${userId ?? "guest"}`;

const parseProfile = (raw: string | null): UserProfile | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch (error) {
    console.warn("Failed to parse stored profile", error);
    return null;
  }
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const storageKey = getStorageKey(user?.id);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const persistProfile = useCallback(
    (nextProfile: UserProfile) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextProfile));
      } catch (error) {
        console.warn("Failed to persist profile", error);
      }
    },
    [storageKey],
  );

  // Sync user data from AuthContext to UserProfile / load from storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Tunggu sampai auth selesai loading
    if (authLoading) return;

    // Jika tidak ada user, set profile ke null
    if (!user) {
      setProfile(null);
      return;
    }

    const storedProfile = parseProfile(localStorage.getItem(storageKey));
    if (storedProfile) {
      startTransition(() => {
        setProfile(storedProfile);
      });
      return;
    }

    // Create profile from auth user
    const newProfile = createDefaultProfile(user.name, user.company);
    startTransition(() => {
      setProfile(newProfile);
    });
    persistProfile(newProfile);
  }, [storageKey, user, authLoading, persistProfile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return null;
      const nextProfile = { ...prev, ...updates };
      persistProfile(nextProfile);
      return nextProfile;
    });
  }, [persistProfile]);

  const setOnboardingComplete = useCallback((status: boolean) => {
    setProfile((prev) => {
      if (!prev) return null;
      const nextProfile = { ...prev, onboardingComplete: status };
      persistProfile(nextProfile);
      return nextProfile;
    });
  }, [persistProfile]);

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
