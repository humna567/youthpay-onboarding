'use client';

import { useOnboardingStore } from '@/store/onboarding';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Interest } from '@/types';

const INTERESTS: { id: Interest; emoji: string; label: string }[] = [
  { id: 'food', emoji: '🍔', label: 'Food' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping' },
  { id: 'sports', emoji: '⚽', label: 'Sports' },
  { id: 'movies', emoji: '🎬', label: 'Movies' },
  { id: 'books', emoji: '📚', label: 'Books' },
  { id: 'travel', emoji: '✈️', label: 'Travel' },
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
];

export function InterestsScreen() {
  const { interests, toggleInterest, nextStep } = useOnboardingStore();

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={8} />

      <div className="animate-fade-up" style={{ paddingTop: 'var(--space-6)' }}>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)', color: 'var(--brand-primary)', fontWeight: 600 }}>
          STEP 9 OF 9
        </p>
        <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>
          What do you spend on?
        </h1>
        <p className="body-md" style={{ marginBottom: 'var(--space-2)' }}>
          Choose at least 2. We'll use this to make your insights more relevant.
        </p>
        <p className="body-sm" style={{ marginBottom: 'var(--space-6)', color: 'var(--brand-primary)' }}>
          {interests.length} selected
        </p>

        {/* Interest chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
          {INTERESTS.map(({ id, emoji, label }, i) => {
            const sel = interests.includes(id);
            return (
              <button
                key={id}
                className={`chip animate-fade-up delay-${(i % 4) + 1}`}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: 'var(--text-base)',
                  gap: 'var(--space-2)',
                  ...(sel ? { background: 'var(--brand-primary-light)', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' } : {}),
                }}
                onClick={() => toggleInterest(id)}
                aria-pressed={sel}
              >
                <span>{emoji}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Why this matters */}
        <div style={{
          padding: 'var(--space-4)',
          background: 'var(--brand-accent-light)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--brand-accent)',
        }}>
          <p className="body-sm" style={{ color: '#007a5c' }}>
            💡 Your AI insights will be personalised based on what you actually spend on — not generic advice.
          </p>
        </div>
      </div>

      <div className="bottom-action">
        <button
          className="btn btn-primary"
          onClick={nextStep}
          disabled={interests.length < 2}
        >
          {interests.length < 2 ? `Select ${2 - interests.length} more` : 'Almost done!'}
        </button>
      </div>
    </div>
  );
}
