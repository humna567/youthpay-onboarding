export type UserRole = 'teen' | 'parent';

export type MoneyPersonality = 'smart-saver' | 'impulse-explorer' | 'balanced-planner';

export type FinancialGoal =
  | 'save-money'
  | 'pocket-money'
  | 'shopping'
  | 'gaming'
  | 'education'
  | 'travel';

export type Interest =
  | 'coffee'
  | 'shopping'
  | 'sports'
  | 'gaming'
  | 'food'
  | 'books'
  | 'movies'
  | 'travel';

export interface OnboardingState {
  step: number;
  role: UserRole | null;
  phone: string;
  otpVerified: boolean;
  parentApproved: boolean;
  name: string;
  dob: string;
  school: string;
  city: string;
  gender: string;
  profilePicture: string | null;
  goal: FinancialGoal | null;
  savingsTarget: number;
  interests: Interest[];
  personality: MoneyPersonality | null;
  notificationsEnabled: boolean;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  type: 'debit' | 'credit';
}

export interface DashboardData {
  userName: string;
  balance: number;
  savingsGoal: number;
  savedAmount: number;
  todaySpent: number;
  weeklySpent: number;
  streakDays: number;
  personality: MoneyPersonality;
  transactions: Transaction[];
  parentApprovalActive: boolean;
  topCategory: string;
  topCategoryPercent: number;
  aiTip: string;
}
