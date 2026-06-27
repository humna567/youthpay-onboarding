'use client';
import { useState, useEffect, useRef } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { requestParentApproval, pollParentApproval } from '@/lib/api';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Phase = 'enter' | 'waiting' | 'approved' | 'denied';
const PHONE_REGEX = /^3[0-9]{9}$/;

export function ParentConsentScreen() {
  const [phase, setPhase] = useState<Phase>('enter');
  const [parentPhone, setParentPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dots, setDots] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const { nextStep, setParentApproved } = useOnboardingStore();

  useEffect(() => {
    if (phase !== 'waiting') return;
    const dotsIv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    const pollIv = setInterval(async () => {
      const r = await pollParentApproval();
      if (r.status === 'approved') { clearInterval(dotsIv); clearInterval(pollIv); setPhase('approved'); setParentApproved(true); }
      else if (r.status === 'denied') { clearInterval(dotsIv); clearInterval(pollIv); setPhase('denied'); }
    }, 3000);
    pollRef.current = pollIv;
    return () => { clearInterval(dotsIv); clearInterval(pollIv); };
  }, [phase, setParentApproved]);

  const handleSend = async () => {
    if (!PHONE_REGEX.test(parentPhone)) { setError('Enter a valid Pakistani mobile number'); return; }
    setLoading(true);
    const teenPhone = useOnboardingStore.getState().phone;
    await requestParentApproval(teenPhone, parentPhone);
    setLoading(false);
    setPhase('waiting');
  };

  if (phase === 'approved') return (
    <div className="screen" style={{ alignItems:'center', justifyContent:'center', textAlign:'center', gap:'var(--space-6)', padding:'var(--space-10) var(--space-6)' }}>
      <div className="animate-bounce-in" style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg, var(--yp-emerald), var(--yp-emerald-dk))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-emerald)' }}>
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none"><path d="M10 22l8 8 14-14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div className="animate-fade-up delay-1">
        <p style={{ fontSize:'var(--text-sm)', fontWeight:700, color:'var(--yp-emerald)', textTransform:'uppercase', letterSpacing:1, marginBottom:'var(--space-2)' }}>They said yes! 🎉</p>
        <h1 className="heading-md" style={{ marginBottom:'var(--space-3)' }}>You're approved.</h1>
        <p className="body-md">Your parent gave the green light. Let's build your profile.</p>
      </div>
      <button className="btn btn-primary animate-fade-up delay-2" onClick={nextStep} style={{ width:'100%', maxWidth:320 }}>Build my profile →</button>
    </div>
  );

  if (phase === 'denied') return (
    <div className="screen" style={{ alignItems:'center', justifyContent:'center', textAlign:'center', gap:'var(--space-6)', padding:'var(--space-10) var(--space-6)' }}>
      <div className="animate-bounce-in" style={{ width:80, height:80, borderRadius:'50%', background:'var(--yp-rose-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>😕</div>
      <div className="animate-fade-up delay-1">
        <h1 className="heading-md" style={{ marginBottom:'var(--space-3)' }}>Not yet.</h1>
        <p className="body-md">Your parent said not yet. You can ask again in 24 hours — sometimes they just need a little time.</p>
      </div>
      <button className="btn btn-secondary animate-fade-up delay-2" onClick={() => setPhase('enter')} style={{ width:'100%', maxWidth:320 }}>Try a different number</button>
    </div>
  );

  if (phase === 'waiting') return (
    <div className="screen screen-padded" style={{ alignItems:'center' }}>
      <ProgressBar total={9} current={3} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--space-8)', textAlign:'center' }}>
        {/* Two-phone illustration */}
        <div style={{ position:'relative', width:200, height:100 }}>
          {/* Teen phone */}
          <div style={{ position:'absolute', left:0, top:10, width:70, height:80, background:'linear-gradient(135deg, var(--yp-violet), var(--yp-violet-dk))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)' }}>
            <span style={{ fontSize:28 }}>📱</span>
          </div>
          {/* Arrow with animation */}
          <div style={{ position:'absolute', left:72, top:42, right:72, height:2, background:'linear-gradient(90deg, var(--yp-violet), var(--yp-emerald))', borderRadius:99 }}>
            <div style={{ position:'absolute', right:-6, top:-5, fontSize:14 }}>💬</div>
          </div>
          {/* Parent phone */}
          <div style={{ position:'absolute', right:0, top:10, width:70, height:80, background:'linear-gradient(135deg, var(--yp-emerald-dk), var(--yp-emerald))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-emerald)', animation:'waiting-pulse 2s ease-in-out infinite' }}>
            <span style={{ fontSize:28 }}>📲</span>
          </div>
        </div>

        <div>
          <p style={{ fontSize:32, marginBottom:'var(--space-3)' }}>⏳</p>
          <h2 className="heading-sm" style={{ marginBottom:'var(--space-2)' }}>Waiting for your parent{dots}</h2>
          <p className="body-md">We texted them at +92 {parentPhone.slice(0,3)} ••• {parentPhone.slice(-4)}. It'll only take a second.</p>
        </div>

        <div style={{ padding:'var(--space-4) var(--space-5)', background:'var(--yp-violet-lt)', borderRadius:'var(--radius-md)', width:'100%', textAlign:'left', display:'flex', gap:'var(--space-3)' }}>
          <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
          <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-violet-dk)', lineHeight:1.55 }}>
            Wrong number? <button onClick={() => setPhase('enter')} style={{ background:'none', border:'none', color:'var(--yp-violet)', fontWeight:700, cursor:'pointer', fontSize:'var(--text-sm)' }}>Go back and fix it</button>
          </p>
        </div>
      </div>
      <style>{`@keyframes waiting-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>
    </div>
  );

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={3} />
      <div className="animate-fade-up">
        <p className="label-caps" style={{ color:'var(--yp-violet)', marginBottom:'var(--space-3)' }}>Step 4 of 9</p>
        <h1 className="heading-lg" style={{ marginBottom:'var(--space-2)' }}>One quick nod from your parent and you're in.</h1>
        <p className="body-md" style={{ marginBottom:'var(--space-8)' }}>
          YouthPay requires a parent's approval for anyone under 18. It's how we keep you protected.
        </p>

        <div className="input-group">
          <label className="input-label" htmlFor="parent-phone">Parent or guardian's mobile number</label>
          <div className="phone-input-wrapper">
            <div className="country-code">🇵🇰 +92</div>
            <input
              id="parent-phone" type="tel"
              className={`input-field${error?' error':''}`}
              placeholder="0300 123 4567"
              value={parentPhone}
              onChange={e => { setParentPhone(e.target.value.replace(/\D/g,'').slice(0,10)); setError(''); }}
              inputMode="numeric"
            />
          </div>
          {error && <p className="input-error">⚠️ {error}</p>}
        </div>

        <div style={{ marginTop:'var(--space-5)', padding:'var(--space-4)', background:'var(--yp-fog)', borderRadius:'var(--radius-md)', display:'flex', gap:'var(--space-3)' }}>
          <span style={{ fontSize:16, flexShrink:0 }}>📩</span>
          <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-mist)', lineHeight:1.55 }}>
            We'll send them a text explaining exactly what they're approving. Simple, clear, no surprises.
          </p>
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleSend} disabled={loading || parentPhone.length < 10} aria-busy={loading}>
          {loading ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span className="spinner"/>Texting your parent...</span> : 'Send approval request →'}
        </button>
      </div>
    </div>
  );
}
