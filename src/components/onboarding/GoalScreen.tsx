'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { FinancialGoal } from '@/types';

const GOALS: { id: FinancialGoal; emoji: string; label: string }[] = [
  { id: 'save-money', emoji: '🐷', label: 'Save money' },
  { id: 'pocket-money', emoji: '💵', label: 'Track pocket money' },
  { id: 'shopping', emoji: '🛍️', label: 'Budget for shopping' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming & entertainment' },
  { id: 'education', emoji: '📚', label: 'Books & courses' },
  { id: 'travel', emoji: '✈️', label: 'Travel & trips' },
];

const SAVINGS_TARGETS = [
  { label: '₨ 500', value: 500 },
  { label: '₨ 1,000', value: 1000 },
  { label: '₨ 3,000', value: 3000 },
  { label: '₨ 5,000', value: 5000 },
  { label: '₨ 10,000', value: 10000 },
];

export function GoalScreen() {
  const { goal, savingsTarget, setGoal, setSavingsTarget, nextStep } = useOnboardingStore();
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={7} />

      <div className="animate-fade-up" style={{ paddingTop: 'var(--space-6)' }}>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)', color: 'var(--brand-primary)', fontWeight: 600 }}>
          STEP 8 OF 9
        </p>
        <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>
          What's your main goal?
        </h1>
        <p className="body-md" style={{ marginBottom: 'var(--space-5)' }}>
          We'll personalise your dashboard around this.
        </p>

        {/* Goal grid */}
        <div className="goal-grid" style={{ marginBottom: 'var(--space-6)' }}>
          {GOALS.map(({ id, emoji, label }, i) => (
            <button
              key={id}
              className={`goal-card animate-fade-up delay-${(i % 3) + 1}`}
              onClick={() => setGoal(id)}
              aria-pressed={goal === id}
            >
              <div className="goal-icon">{emoji}</div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: goal === id ? 'var(--brand-primary)' : 'var(--gray-700)' }}>
                {label}
              </p>
            </button>
          ))}
        </div>

        {/* Savings target */}
        <div>
          <p style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
            How much do you want to save first?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            {SAVINGS_TARGETS.map(({ label, value }) => (
              <button
                key={value}
                className={`chip${savingsTarget === value && !showCustom ? ' selected' : ''}`}
                onClick={() => { setSavingsTarget(value); setShowCustom(false); }}
              >
                {label}
              </button>
            ))}
            <button
              className={`chip${showCustom ? ' selected' : ''}`}
              onClick={() => setShowCustom(true)}
            >
              Custom
            </button>
          </div>

          {showCustom && (
            <div className="input-group animate-fade-up">
              <label className="input-label" htmlFor="custom-amount">Custom amount (₨)</label>
              <input
                id="custom-amount"
                type="number"
                className="input-field"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSavingsTarget(Number(e.target.value)); }}
                min={100}
                max={100000}
                autoFocus
                inputMode="numeric"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={nextStep} disabled={!goal}>
          Continue
        </button>
      </div>
    </div>
  );
}
