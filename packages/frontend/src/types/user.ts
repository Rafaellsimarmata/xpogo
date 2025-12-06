export type UserProfile = {
  fullName: string;
  username: string;
  company: string;
  businessName: string;
  businessType: string;
  onboardingComplete: boolean;
  focusProduct?: string;
  targetCountry?: string;
};

export type UserContextValue = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboardingComplete: (status: boolean) => void;
};
