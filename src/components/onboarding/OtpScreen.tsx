'use client';
import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { verifyOtp } from '@/lib/api';
import { ProgressBar } from '@/components/ui/ProgressBar';

const OTP_LENGTH = 6;

export function OtpScreen() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { phone, setOtpVerified, nextStep } = useOnboardingStore();
  const focus = (i: number) => refs.current[i]?.focus();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const iv = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(iv);
  }, [resendTimer]);

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next); setError('');
    if (digit && i < OTP_LENGTH - 1) focus(i + 1);
    if (next.every(Boolean)) handleVerify(next.join(''));
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp]; next[i-1] = ''; setOtp(next); focus(i-1);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (paste.length === OTP_LENGTH) { setOtp(paste.split('')); handleVerify(paste); }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    const res = await verifyOtp(phone, code);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setOtpVerified(true);
      setTimeout(nextStep, 700);
    } else {
      setError("That's not quite right. Try again.");
      setOtp(Array(OTP_LENGTH).fill('')); focus(0);
    }
  };

  const maskedPhone = phone ? `${phone.slice(0,3)} ••• ${phone.slice(-4)}` : '';

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={2} />

      <div className="animate-fade-up">
        <p className="label-caps" style={{ color:'var(--yp-violet)', marginBottom:'var(--space-3)' }}>Step 3 of 9</p>
        <h1 className="heading-lg" style={{ marginBottom:'var(--space-2)' }}>Check your messages 📱</h1>
        <p className="body-md" style={{ marginBottom:'var(--space-8)' }}>
          We just texted a 6-digit code to{' '}
          <span style={{ fontWeight:700, color:'var(--yp-ink)' }}>+92 {maskedPhone}</span>
        </p>

        {/* OTP inputs */}
        <div className="otp-container" role="group" aria-label="One-time password">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`otp-input${success?' success':digit?' filled':''}${error?' error':''}`}
              aria-label={`Digit ${i+1}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className="animate-fade-in" style={{ textAlign:'center', marginTop:'var(--space-4)', fontSize:'var(--text-sm)', color:'var(--yp-rose)', fontWeight:500 }}>⚠️ {error}</p>}
        {success && <p className="animate-fade-in" style={{ textAlign:'center', marginTop:'var(--space-4)', fontSize:'var(--text-sm)', color:'var(--yp-emerald)', fontWeight:700 }}>✓ Got it! Let's keep going.</p>}
        {loading && !success && <div className="animate-fade-in" style={{ display:'flex', justifyContent:'center', marginTop:'var(--space-4)', gap:8, alignItems:'center' }}><div className="spinner spinner-brand"/><span className="body-sm">Verifying...</span></div>}

        {/* Resend */}
        <p className="body-sm" style={{ textAlign:'center', marginTop:'var(--space-6)' }}>
          Didn't get it?{' '}
          {resendTimer > 0
            ? <span style={{ color:'var(--yp-mist)' }}>Resend in 0:{String(resendTimer).padStart(2,'0')}</span>
            : <button className="btn btn-ghost" onClick={() => { setResendTimer(30); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }} style={{ display:'inline', padding:0, fontSize:'var(--text-sm)', fontWeight:700, color:'var(--yp-violet)' }}>Resend code</button>}
        </p>

        {/* Demo hint */}
        <div style={{ marginTop:'var(--space-6)', padding:'var(--space-3)', background:'var(--yp-fog)', borderRadius:'var(--radius-md)', textAlign:'center' }}>
          <p className="body-sm" style={{ color:'var(--yp-mist)' }}>✨ Demo: any 6 digits work</p>
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={() => handleVerify(otp.join(''))} disabled={!otp.every(Boolean) || loading || success} aria-busy={loading}>
          {loading ? <span className="spinner"/> : success ? '✓ Verified!' : 'Verify code'}
        </button>
      </div>
    </div>
  );
}
