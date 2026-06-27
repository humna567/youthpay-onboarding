'use client';

import { useOnboardingStore } from '@/store/onboarding';

const NOTIFICATION_EXAMPLES = [
  { icon: '💰', text: 'You\'ve saved ₨ 500 this week!' },
  { icon: '⚠️', text: 'You\'re close to your food budget.' },
  { icon: '🎯', text: '3 days left to hit your goal!' },
];

export function NotificationsScreen() {
  const { setNotifications, nextStep } = useOnboardingStore();

  const handleAllow = () => { setNotifications(true); nextStep(); };
  const handleSkip = () => { setNotifications(false); nextStep(); };

  return (
    <div className="screen screen-padded" style={{ justifyContent: 'space-between' }}>
      <div className="animate-fade-up" style={{ paddingTop: 'var(--space-8)' }}>
        {/* Illustration */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 'var(--space-3)' }}>🔔</div>
          <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>Stay on track</h1>
          <p className="body-md">
            Smart notifications help you reach your goals faster — without spam.
          </p>
        </div>

        {/* Notification previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {NOTIFICATION_EXAMPLES.map(({ icon, text }, i) => (
            <div
              key={i}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 0.1 + 0.1}s`,
                display: 'flex',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-100)',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{
                width: 40, height: 40,
                borderRadius: 10,
                background: 'var(--brand-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-900)' }}>YouthPay</p>
                <p className="body-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="body-sm" style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
          You can change this anytime in Settings.
        </p>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleAllow}>
          Allow notifications
        </button>
        <button className="btn btn-ghost" onClick={handleSkip}>
          Not now
        </button>
      </div>
    </div>
  );
}
