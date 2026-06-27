import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, UserRole, FinancialGoal, Interest, MoneyPersonality } from '@/types';

interface OnboardingStore extends OnboardingState {
  setStep: (step: number) => void;
  nextStep: () => void;
  setRole: (role: UserRole) => void;
  setPhone: (phone: string) => void;
  setOtpVerified: (v: boolean) => void;
  setParentApproved: (v: boolean) => void;
  setProfile: (data: Partial<Pick<OnboardingState, 'name' | 'dob' | 'school' | 'city' | 'gender' | 'profilePicture'>>) => void;
  setGoal: (goal: FinancialGoal) => void;
  setSavingsTarget: (amount: number) => void;
  toggleInterest: (interest: Interest) => void;
  setPersonality: (p: MoneyPersonality) => void;
  setNotifications: (v: boolean) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  step: 0,
  role: null,
  phone: '',
  otpVerified: false,
  parentApproved: false,
  name: '',
  dob: '',
  school: '',
  city: '',
  gender: '',
  profilePicture: null,
  goal: null,
  savingsTarget: 5000,
  interests: [],
  personality: null,
  notificationsEnabled: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      nextStep: () => set((s) => ({ step: s.step + 1 })),
      setRole: (role) => set({ role }),
      setPhone: (phone) => set({ phone }),
      setOtpVerified: (v) => set({ otpVerified: v }),
      setParentApproved: (v) => set({ parentApproved: v }),
      setProfile: (data) => set((s) => ({ ...s, ...data })),
      setGoal: (goal) => set({ goal }),
      setSavingsTarget: (savingsTarget) => set({ savingsTarget }),
      toggleInterest: (interest) =>
        set((s) => ({
          interests: s.interests.includes(interest)
            ? s.interests.filter((i) => i !== interest)
            : [...s.interests, interest],
        })),
      setPersonality: (personality) => set({ personality }),
      setNotifications: (v) => set({ notificationsEnabled: v }),
      reset: () => set(initialState),
    }),
    { name: 'youthpay-onboarding' }
  )
);
