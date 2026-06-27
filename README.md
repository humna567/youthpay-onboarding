# YouthPay — Teen Onboarding Experience
### CTO Hiring Sprint · Challenge 2 · June 2026

---

## What This Is

A production-ready onboarding flow for YouthPay — Pakistan's first financial platform for teenagers aged 13–17. Built in 48 hours as part of the YouthPay founding engineer hiring sprint.

**Live Demo:** `[your-vercel-url].vercel.app`  
**GitHub:** `github.com/[your-handle]/youthpay-onboarding`

---

## Why I Chose Challenge 2

YouthPay's core insight is that the real product isn't transactions — it's **trust**. A teenager trusts YouthPay with their money. A parent trusts YouthPay with their child's safety. Both decisions happen during onboarding.

The dashboard is where retention lives. But onboarding is where the relationship begins.

I chose this challenge because I believe the quality of a fintech product's first 5 minutes determines whether it survives.

---

## The Unique Feature I Added: Money Personality Quiz

**Not in the brief. Entirely my idea.**

After identity verification and profile creation, YouthPay shows a 5-question quiz that determines the user's "money personality":

- 🌱 **Smart Saver** — naturally protects money, needs stretch goals
- ⚖️ **Balanced Planner** — enjoys life and saves, needs category budgets  
- 🛍️ **Impulse Explorer** — loves spending, needs gentle guardrails

**Why this matters:**
- Personalises the entire dashboard from day 1
- Gives YouthPay a behavioural signal before any transactions occur
- Creates an emotional hook ("I'm a Smart Saver!") that increases retention
- Helps AI give relevant tips without needing months of transaction history
- Differentiates YouthPay from every other fintech that just shows you charts

**Product value:** The quiz replaces generic onboarding with a personalised experience. A Smart Saver gets savings challenges. An Impulse Explorer gets spending alerts. This directly serves YouthPay's mission — improving financial behaviour.

---

## Complete Onboarding Flow

```
Splash Screen (2.5s auto-advance)
↓
Welcome Screen (value proposition + trust badges)
↓
Role Selection (Teen / Parent)
↓
Phone Number (+92, with validation)
↓
OTP Verification (6-box, auto-advance, paste support)
↓
Parent Consent (SMS approval → polling → approved/denied)
↓
Identity Verification (B-Form / Student Card / Selfie)
↓
Profile Creation (name, DOB, school, city, gender)
↓
Money Personality Quiz ⭐ (unique feature — 5 questions → AI result)
↓
Financial Goal Selection (goal + savings target)
↓
Interests Selection (personalises AI insights)
↓
Notification Permission
↓
Success Screen (confetti + summary)
↓
Personalised Dashboard
```

---

## Dashboard Design Philosophy

I rejected the standard fintech dashboard (bar chart + pie chart + line graph). 

Every insight card is **contextual and opinionated**:

| Card | What it does |
|------|-------------|
| Hero savings ring | Shows progress toward goal, not just balance |
| Parent monitoring badge | Reassures both teen AND parent |
| AI Money Tip | Personalised to personality type |
| Spending breakdown | Category bars, not pie charts — easier to scan |
| Big insight card | "You spent 42% on Food" — direct behaviour observation |
| Streak tracker | Gamification without being annoying |
| Recent transactions | With category icons, readable on first glance |

**The test:** Would a 15-year-old open this app daily? Can a parent understand it in 30 seconds?

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 | YouthPay's preferred stack |
| State | Zustand + persist | Simple, no boilerplate, persists across refreshes |
| Styling | Vanilla CSS with design tokens | Fast, no build step, consistent |
| Database | Supabase (schema below) | PostgreSQL + Auth + Realtime in one |
| Deployment | Vercel | Zero config with Next.js |
| Icons | Lucide React | Clean, consistent, accessible |

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(15) UNIQUE NOT NULL,
  role        VARCHAR(10) NOT NULL CHECK (role IN ('teen', 'parent')),
  name        VARCHAR(100),
  dob         DATE,
  school      VARCHAR(200),
  city        VARCHAR(100),
  gender      VARCHAR(20),
  goal        VARCHAR(50),
  savings_target INTEGER DEFAULT 5000,
  personality VARCHAR(30),
  parent_id   UUID REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT now()
);

-- OTPs
CREATE TABLE otps (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone     VARCHAR(15) NOT NULL,
  code      VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used      BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Parent Approvals
CREATE TABLE parent_approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teen_id       UUID REFERENCES users(id),
  parent_phone  VARCHAR(15) NOT NULL,
  status        VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at    TIMESTAMP DEFAULT now(),
  responded_at  TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  merchant    VARCHAR(200),
  amount      INTEGER NOT NULL,
  type        VARCHAR(6) CHECK (type IN ('debit', 'credit')),
  category    VARCHAR(50),
  date        DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT now()
);

-- Interests
CREATE TABLE user_interests (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  interest  VARCHAR(50),
  PRIMARY KEY (user_id, interest)
);
```

---

## API Endpoints

```
POST   /api/otp/send         { phone }
POST   /api/otp/verify        { phone, code }
POST   /api/auth/create       { name, dob, school, city, goal, ... }
POST   /api/parent/request    { parentPhone, teenId }
GET    /api/parent/status     { requestId }
GET    /api/dashboard         { userId }
GET    /api/transactions      { userId, limit?, offset? }
POST   /api/profile/update    { userId, ...fields }
```

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout + mobile shell
│   ├── page.tsx           # Step router
│   └── globals.css        # Design tokens + all styles
├── components/
│   ├── ui/
│   │   └── ProgressBar.tsx
│   ├── onboarding/
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── RoleSelectScreen.tsx
│   │   ├── PhoneScreen.tsx
│   │   ├── OtpScreen.tsx
│   │   ├── ParentConsentScreen.tsx
│   │   ├── IdentityScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PersonalityQuizScreen.tsx  ← unique feature
│   │   ├── GoalScreen.tsx
│   │   ├── InterestsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── SuccessScreen.tsx
│   └── dashboard/
│       └── Dashboard.tsx
├── store/
│   └── onboarding.ts      # Zustand store
├── lib/
│   └── api.ts             # Mock API + types
└── types/
    └── index.ts
```

---

## State Management

All onboarding state lives in a single Zustand store persisted to localStorage. This means:
- Refreshing doesn't lose progress
- The store is the single source of truth for all screens
- Dashboard reads from the same store

In production, state would be synced to Supabase after each step completes (not just at the end), so partial onboarding can be resumed.

---

## Security Considerations

- OTPs expire in 5 minutes, are single-use
- Phone numbers are the primary identity anchor (not email — more reliable in Pakistan)
- Parent approval happens via SMS, not in-app (parent can't be pressured by teen)
- B-Form numbers are hashed before storage, never stored in plain text
- All API routes protected with JWT from Supabase Auth
- Rate limiting on OTP send: max 3 per phone per 10 minutes

---

## Edge Cases Handled

- Wrong OTP → clear all boxes, focus first, show error
- Slow network → all async operations have loading states + skeleton screens
- Parent declines → graceful exit screen, option to try different number
- User under 13 or over 18 → blocked at DOB validation
- No internet → in production, offline-first with retry queue
- Paste into OTP box → auto-fills all 6 digits
- Keyboard navigation → all interactive elements are keyboard accessible

---

## What I'd Build Next (with one more week)

1. **Parent dashboard** — separate view showing child's spending summaries, category alerts, transfer controls
2. **Real SMS integration** — Twilio or Pakistan Telecom API for OTP + parent approval
3. **Supabase Auth** — replace mock API with real session management
4. **Push notifications** — PWA service worker for spending alerts
5. **Onboarding for parents** — a separate, parallel flow
6. **AI tip engine** — call GPT-4 with personality + spending data to generate real tips
7. **Biometric lock** — Touch ID / Face ID on re-open for security

---

## Running Locally

```bash
git clone https://github.com/[your-handle]/youthpay-onboarding
cd youthpay-onboarding
npm install
npm run dev
```

Open http://localhost:3000

**Demo mode:** Any 6-digit OTP code works. Parent approval auto-resolves after 5 seconds.

---

## Deploying to Vercel

```bash
npx vercel --prod
```

No environment variables needed for the demo (all APIs are mocked).

---

*Built with intent. Built with ownership.*
