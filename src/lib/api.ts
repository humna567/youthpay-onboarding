// ── YouthPay Mock API ──────────────────────────────────────────
// In production: replace with real Supabase calls

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
  savedAmount: number;
  savingsGoal: number;
  todaySpent: number;
  weeklySpent: number;
  topCategory: string;
  topCategoryPercent: number;
  streakDays: number;
  parentApprovalActive: boolean;
  aiTip: string;
  transactions: Transaction[];
}

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── OTP ──────────────────────────────────────────────────────
export async function sendOtp(phone: string): Promise<{ success: boolean }> {
  await delay(900);
  console.log(`[MOCK] OTP sent to +92${phone}`);
  return { success: true };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1100);
  // In demo, code 123456 always works, or any 6-digit code after 2s
  if (code === '000000') return { success: false, error: 'Invalid code. Please try again.' };
  return { success: true };
}

// ── Parent approval ──────────────────────────────────────────
export async function requestParentApproval(
  teenPhone: string,
  parentPhone: string
): Promise<{ success: boolean }> {
  await delay(1200);
  console.log(`[MOCK] Approval SMS sent to +92${parentPhone} for teen +92${teenPhone}`);
  return { success: true };
}

let _approvalGranted = false;

export async function pollParentApproval(): Promise<{
  status: 'pending' | 'approved' | 'denied';
}> {
  await delay(800);
  // For demo: auto-approve after the first poll
  if (!_approvalGranted) {
    _approvalGranted = true;
    return { status: 'pending' };
  }
  return { status: 'approved' };
}

// ── Dashboard ─────────────────────────────────────────────────
export const MOCK_DASHBOARD_DATA: DashboardData = {
  userName:             'Humna',
  savedAmount:          4500,
  savingsGoal:          10000,
  todaySpent:           380,
  weeklySpent:          3240,
  topCategory:          'Food & Drinks',
  topCategoryPercent:   48,
  streakDays:           5,
  parentApprovalActive: true,
  aiTip:                'Skip one fast-food visit this weekend and you\'ll add ₨800 to your savings goal — you\'re only ₨5,500 away! 💪',
  transactions: [
    { id: '1', merchant: 'KFC Gulshan',     amount: 750,  category: 'Food',     date: '2026-06-27', type: 'debit'  },
    { id: '2', merchant: 'Pocket Money',    amount: 3000, category: 'Income',   date: '2026-06-26', type: 'credit' },
    { id: '3', merchant: 'Daraz.pk',        amount: 1200, category: 'Shopping', date: '2026-06-25', type: 'debit'  },
    { id: '4', merchant: 'Foodpanda',       amount: 480,  category: 'Food',     date: '2026-06-24', type: 'debit'  },
    { id: '5', merchant: 'Steam Games',     amount: 300,  category: 'Gaming',   date: '2026-06-23', type: 'debit'  },
    { id: '6', merchant: 'LUMS Canteen',    amount: 310,  category: 'Food',     date: '2026-06-22', type: 'debit'  },
  ],
};
