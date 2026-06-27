'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Method = 'bform' | 'student-card' | 'selfie';

const METHODS = [
  { id: 'bform' as Method, icon: '🪪', title: 'B-Form number', desc: 'NADRA-issued ID for under-18s' },
  { id: 'student-card' as Method, icon: '🎓', title: 'Student card', desc: 'Upload a photo of your card' },
  { id: 'selfie' as Method, icon: '🤳', title: 'Selfie verification', desc: 'Quick selfie check' },
];

export function IdentityScreen() {
  const [method, setMethod] = useState<Method | null>(null);
  const [bform, setBform] = useState('');
  const [loading, setLoading] = useState(false);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const handleContinue = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    nextStep();
  };

  const isReady = method === 'bform' ? bform.length >= 13 : method !== null;

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={4} />

      <div className="animate-fade-up" style={{ paddingTop: 'var(--space-6)' }}>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)', color: 'var(--brand-primary)', fontWeight: 600 }}>
          STEP 5 OF 9
        </p>
        <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>
          Verify your identity
        </h1>
        <p className="body-md" style={{ marginBottom: 'var(--space-6)' }}>
          This keeps your account safe and helps us comply with regulations.
        </p>

        {/* Method selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {METHODS.map(({ id, icon, title, desc }, i) => (
            <button
              key={id}
              className={`role-card animate-fade-up delay-${i + 1}`}
              style={{
                ...(method === id ? { borderColor: 'var(--brand-primary)', background: 'var(--brand-primary-light)' } : {}),
                padding: 'var(--space-4)',
              }}
              onClick={() => setMethod(id)}
              aria-pressed={method === id}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%' }}>
                <span style={{ fontSize: 28 }}>{icon}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{title}</p>
                  <p className="body-sm">{desc}</p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${method === id ? 'var(--brand-primary)' : 'var(--gray-200)'}`,
                  background: method === id ? 'var(--brand-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {method === id && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* B-Form input */}
        {method === 'bform' && (
          <div className="input-group animate-fade-up">
            <label className="input-label" htmlFor="bform">B-Form number (13 digits)</label>
            <input
              id="bform"
              type="text"
              inputMode="numeric"
              className="input-field"
              placeholder="XXXXX-XXXXXXX-X"
              value={bform}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 13);
                const formatted = v.length > 12 ? `${v.slice(0,5)}-${v.slice(5,12)}-${v.slice(12)}` :
                                  v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v;
                setBform(formatted);
              }}
              autoFocus
            />
          </div>
        )}

        {/* Upload area for student card */}
        {method === 'student-card' && (
          <div
            className="animate-fade-up"
            style={{
              border: '2px dashed var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--gray-50)',
            }}
            role="button"
            aria-label="Upload student card photo"
            tabIndex={0}
          >
            <span style={{ fontSize: 32 }}>📷</span>
            <p style={{ fontWeight: 600, color: 'var(--gray-700)', marginTop: 'var(--space-2)' }}>Upload photo</p>
            <p className="body-sm">JPG or PNG, max 5MB</p>
          </div>
        )}

        {method === 'selfie' && (
          <div
            className="animate-fade-up"
            style={{
              border: '2px dashed var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--gray-50)',
            }}
          >
            <span style={{ fontSize: 32 }}>🤳</span>
            <p style={{ fontWeight: 600, color: 'var(--gray-700)', marginTop: 'var(--space-2)' }}>Take a selfie</p>
            <p className="body-sm">Look straight at the camera in good lighting</p>
          </div>
        )}
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleContinue} disabled={!isReady || loading} aria-busy={loading}>
          {loading ? <><span className="spinner" /> Verifying…</> : 'Continue'}
        </button>
        <p className="body-sm" style={{ textAlign: 'center' }}>
          🔒 Your ID is encrypted and never shared
        </p>
      </div>
    </div>
  );
}
