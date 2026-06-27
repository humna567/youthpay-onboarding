'use client';
import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { sendOtp } from '@/lib/api';
import { ProgressBar } from '@/components/ui/ProgressBar';

const PHONE_REGEX = /^3[0-9]{9}$/;

function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0,4)} ${digits.slice(4)}`;
  return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
}

export function PhoneScreen() {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { setPhone, nextStep } = useOnboardingStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setRaw(digits);
    setReady(PHONE_REGEX.test(digits));
    if (error) setError('');
  };

  const handleContinue = async () => {
    if (!PHONE_REGEX.test(raw)) { setError('Enter a valid Pakistani mobile number (e.g. 0300 123 4567)'); return; }
    setLoading(true);
    const res = await sendOtp(raw);
    setLoading(false);
    if (res.success) { setPhone(raw); nextStep(); }
    else setError('Connection hiccup. Check your signal and try again. 📡');
  };

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={1} />

      <div className="animate-fade-up">
        <p className="label-caps" style={{ color:'var(--yp-violet)', marginBottom:'var(--space-3)' }}>Step 2 of 9</p>
        <h1 className="heading-lg" style={{ marginBottom:'var(--space-2)' }}>What's your number?</h1>
        <p className="body-md" style={{ marginBottom:'var(--space-8)' }}>
          We'll send a one-time code. No spam. Ever.
        </p>

        <div className="input-group">
          <label className="input-label" htmlFor="phone">Mobile number</label>
          <div className="phone-input-wrapper">
            <div className="country-code" aria-label="Pakistan +92">🇵🇰 +92</div>
            <input
              id="phone" type="tel"
              className={`input-field${error?' error':''}`}
              placeholder="0300 123 4567"
              value={formatPhone(raw)}
              onChange={handleChange}
              onKeyDown={(e) => e.key==='Enter' && handleContinue()}
              autoFocus inputMode="numeric"
              style={{ flex:1, transition:'all 0.2s', borderColor: ready ? 'var(--yp-emerald)' : undefined, background: ready ? 'rgba(0,212,160,0.04)' : undefined }}
            />
            {ready && (
              <div style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="var(--yp-emerald)"/><path d="M6 10l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          {error && <p className="input-error">⚠️ {error}</p>}
          {!error && <p className="input-hint" style={{ marginTop:6 }}>e.g. 0300 123 4567 — 10 digits, no country code</p>}
        </div>

        {/* Privacy note */}
        <div className="animate-fade-up delay-2" style={{ marginTop:'var(--space-6)', padding:'var(--space-4)', background:'var(--yp-violet-lt)', borderRadius:'var(--radius-md)', display:'flex', gap:'var(--space-3)' }}>
          <span style={{ fontSize:18, flexShrink:0 }}>🔒</span>
          <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-violet-dk)', lineHeight:1.55 }}>
            Your number is only used for verification and will never be shared, sold, or used for marketing.
          </p>
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleContinue} disabled={loading || !ready} aria-busy={loading}>
          {loading
            ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span className="spinner"/>Sending your code...</span>
            : 'Send my code →'}
        </button>
      </div>
    </div>
  );
}
