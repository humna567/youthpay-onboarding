'use client';

import { useOnboardingStore } from '@/store/onboarding';
import { SplashScreen } from '@/components/onboarding/SplashScreen';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { RoleSelectScreen } from '@/components/onboarding/RoleSelectScreen';
import { PhoneScreen } from '@/components/onboarding/PhoneScreen';
import { OtpScreen } from '@/components/onboarding/OtpScreen';
import { ParentConsentScreen } from '@/components/onboarding/ParentConsentScreen';
import { IdentityScreen } from '@/components/onboarding/IdentityScreen';
import { ProfileScreen } from '@/components/onboarding/ProfileScreen';
import { PersonalityQuizScreen } from '@/components/onboarding/PersonalityQuizScreen';
import { GoalScreen } from '@/components/onboarding/GoalScreen';
import { InterestsScreen } from '@/components/onboarding/InterestsScreen';
import { NotificationsScreen } from '@/components/onboarding/NotificationsScreen';
import { SuccessScreen } from '@/components/onboarding/SuccessScreen';
import { Dashboard } from '@/components/dashboard/Dashboard';

const TOTAL_STEPS = 11;

const SCREENS = [
  SplashScreen,        // 0
  WelcomeScreen,       // 1
  RoleSelectScreen,    // 2
  PhoneScreen,         // 3
  OtpScreen,           // 4
  ParentConsentScreen, // 5
  IdentityScreen,      // 6
  ProfileScreen,       // 7
  PersonalityQuizScreen, // 8 — unique feature
  GoalScreen,          // 9
  InterestsScreen,     // 10
  NotificationsScreen, // 11
  SuccessScreen,       // 12
  Dashboard,           // 13
];

// Steps that show progress bar (steps 3-12)
const PROGRESS_STEPS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function OnboardingPage() {
  const step = useOnboardingStore((s) => s.step);
  const Screen = SCREENS[step] ?? SCREENS[0];

  return <Screen />;
}
