'use client';
import { useOnboardingStore } from '@/store/onboarding';

export function WelcomeScreen() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const setStep  = useOnboardingStore((s) => s.setStep);

  return (
    <div className="screen screen-padded" style={{ justifyContent:'space-between', background:'#fff' }}>
      {/* Hero */}
      <div className="animate-fade-up" style={{ marginTop:'var(--space-4)' }}>
        <div style={{ width:'100%', height:240, borderRadius:'var(--radius-xl)', background:'linear-gradient(145deg, #F0ECFF 0%, #E0FFF8 100%)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {/* Decorative bg */}
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(124,92,255,0.08)' }} />
          <div style={{ position:'absolute', bottom:-30, left:10, width:110, height:110, borderRadius:'50%', background:'rgba(0,212,160,0.12)' }} />
          <div style={{ position:'absolute', top:'20%', left:'8%', width:10, height:10, borderRadius:'50%', background:'rgba(247,183,49,0.7)', animation:'float 3s ease-in-out infinite' }} />

          <svg width="280" height="210" viewBox="0 0 280 210" fill="none" aria-label="YouthPay app preview">
            {/* Main phone */}
            <rect x="90" y="12" width="80" height="140" rx="16" fill="white" filter="url(#ws)"/>
            <rect x="90" y="12" width="80" height="140" rx="16" stroke="var(--yp-violet)" strokeWidth="1.5" strokeOpacity="0.2"/>
            {/* Status bar */}
            <rect x="100" y="22" width="60" height="12" rx="4" fill="var(--yp-fog)"/>
            <circle cx="150" cy="28" r="4" fill="var(--yp-violet-lt)"/>
            {/* Hero card in phone */}
            <rect x="98" y="40" width="64" height="36" rx="8" fill="var(--yp-violet)"/>
            <rect x="104" y="46" width="28" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
            <text x="104" y="68" fontSize="11" fontWeight="800" fill="white">₨4,500</text>
            {/* Savings bar */}
            <rect x="98" y="82" width="64" height="5" rx="2.5" fill="var(--yp-fog)"/>
            <rect x="98" y="82" width="42" height="5" rx="2.5" fill="var(--yp-emerald)"/>
            {/* Mini transactions */}
            <rect x="98" y="96" width="24" height="4" rx="2" fill="var(--yp-cloud)"/>
            <rect x="138" y="96" width="24" height="4" rx="2" fill="var(--yp-violet-lt)"/>
            <rect x="98" y="108" width="30" height="4" rx="2" fill="var(--yp-cloud)"/>
            <rect x="134" y="108" width="28" height="4" rx="2" fill="var(--yp-emerald-lt)"/>
            <rect x="98" y="120" width="26" height="4" rx="2" fill="var(--yp-cloud)"/>
            <rect x="136" y="120" width="26" height="4" rx="2" fill="var(--yp-violet-lt)"/>
            {/* Home indicator */}
            <rect x="120" y="142" width="20" height="3" rx="1.5" fill="var(--yp-cloud)"/>
            {/* Floating card */}
            <rect x="168" y="30" width="76" height="48" rx="10" fill="var(--yp-emerald)" opacity="0.9" filter="url(#ws)" className="animate-float"/>
            <rect x="174" y="38" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/>
            <text x="174" y="58" fontSize="10" fontWeight="800" fill="white">₨ Saved</text>
            <text x="174" y="70" fontSize="8" fill="rgba(255,255,255,0.7)">Goal 45%</text>
            {/* Floating coin */}
            <circle cx="55" cy="80" r="22" fill="rgba(247,183,49,0.15)" className="animate-float"/>
            <circle cx="55" cy="80" r="15" fill="rgba(247,183,49,0.3)"/>
            <text x="55" y="85" textAnchor="middle" fontSize="13" fill="var(--yp-amber)" fontWeight="900">₨</text>
            {/* Stars */}
            <path d="M210 85l2 4.5 5 0.6-3.6 3.5 0.9 5-4.3-2.3-4.3 2.3 0.9-5-3.6-3.5 5-0.6z" fill="var(--yp-gold)" opacity="0.8"/>
            <path d="M38 45l1.3 2.8 3 0.4-2.2 2.1 0.5 3-2.6-1.4-2.6 1.4 0.5-3-2.2-2.1 3-0.4z" fill="var(--yp-violet)" opacity="0.5"/>
            <defs>
              <filter id="ws" x="-15%" y="-15%" width="130%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="var(--yp-violet)" floodOpacity="0.12"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Copy */}
      <div style={{ marginTop:'var(--space-6)' }}>
        <h1 className="heading-xl animate-fade-up delay-1" style={{ marginBottom:'var(--space-3)' }}>
          Finally. Money<br/>
          <span style={{ color:'var(--yp-violet)' }}>that gets you.</span>
        </h1>
        <p className="body-lg animate-fade-up delay-2" style={{ color:'var(--yp-slate)', lineHeight:1.65 }}>
          Built for the way you actually live — not the way adults think you do.
        </p>

        {/* Trust badges */}
        <div className="animate-fade-up delay-3" style={{ display:'flex', gap:'var(--space-2)', marginTop:'var(--space-5)', flexWrap:'wrap' }}>
          {[
            { icon:'🔒', label:'Your money is safer here than under your mattress' },
            { icon:'👨‍👩‍👦', label:'Parents trust it. You\'ll love it.' },
            { icon:'🇵🇰', label:'Proudly Pakistani' },
          ].map(({ icon, label }) => (
            <div key={label} className="trust-pill">
              <span style={{ fontSize:14 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bottom-action animate-fade-up delay-4">
        <button className="btn btn-primary animate-breathe" onClick={nextStep} style={{ letterSpacing:0.2 }}>
          Start for free →
        </button>
        <button className="btn btn-ghost" onClick={() => setStep(13)} style={{ textAlign:'center' }}>
          Welcome back →{' '}
          <span style={{ color:'var(--yp-violet)', fontWeight:700 }}>Log in</span>
        </button>
      </div>
    </div>
  );
}
