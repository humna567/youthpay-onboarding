'use client';
import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import type { UserRole } from '@/types';

export function RoleSelectScreen() {
  const [selected, setSelected] = useState<UserRole | null>('teen');
  const { setRole, nextStep } = useOnboardingStore();

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    nextStep();
  };

  return (
    <div className="screen screen-padded">
      <div className="animate-fade-up" style={{ paddingTop:'var(--space-6)' }}>
        <p className="label-caps" style={{ color:'var(--yp-violet)', marginBottom:'var(--space-3)' }}>Step 1 of 9</p>
        <h1 className="heading-lg" style={{ marginBottom:'var(--space-2)' }}>This is your app.</h1>
        <p className="body-md" style={{ marginBottom:'var(--space-8)', color:'var(--yp-mist)' }}>
          Tell us who's here so we get it right from the start.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          {/* Teen card — primary */}
          <button
            className={`role-card animate-fade-up delay-1${selected==='teen'?' selected':''}`}
            onClick={() => setSelected('teen')}
            aria-pressed={selected==='teen'}
          >
            <div style={{ width:56, height:56, borderRadius:16, background: selected==='teen' ? 'var(--yp-violet)' : 'var(--yp-fog)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, transition:'all 0.24s var(--ease-spring)' }}>
              🎒
            </div>
            <div style={{ textAlign:'left', flex:1 }}>
              <p style={{ fontWeight:800, fontSize:'var(--text-lg)', color:'var(--yp-ink)', marginBottom:3 }}>I'm the teenager</p>
              <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-mist)', lineHeight:1.5 }}>My money. My decisions. My future.</p>
            </div>
            <div style={{ width:24, height:24, borderRadius:'50%', border:`2px solid ${selected==='teen'?'var(--yp-violet)':'var(--yp-cloud)'}`, background:selected==='teen'?'var(--yp-violet)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}>
              {selected==='teen' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </button>

          {/* Parent card — secondary */}
          <button
            className={`role-card animate-fade-up delay-2${selected==='parent'?' selected':''}`}
            onClick={() => setSelected('parent')}
            aria-pressed={selected==='parent'}
            style={{ opacity: selected==='teen' ? 0.7 : 1, transition:'opacity 0.2s' }}
          >
            <div style={{ width:56, height:56, borderRadius:16, background: selected==='parent' ? 'var(--yp-violet)' : 'var(--yp-fog)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, transition:'all 0.24s var(--ease-spring)' }}>
              👨‍👩‍👦
            </div>
            <div style={{ textAlign:'left', flex:1 }}>
              <p style={{ fontWeight:800, fontSize:'var(--text-lg)', color:'var(--yp-ink)', marginBottom:3 }}>I'm the parent</p>
              <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-mist)', lineHeight:1.5 }}>I want to support without hovering.</p>
            </div>
            <div style={{ width:24, height:24, borderRadius:'50%', border:`2px solid ${selected==='parent'?'var(--yp-violet)':'var(--yp-cloud)'}`, background:selected==='parent'?'var(--yp-violet)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}>
              {selected==='parent' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </button>
        </div>

        {/* Reassurance */}
        <div className="animate-fade-up delay-3" style={{ marginTop:'var(--space-5)', padding:'var(--space-4)', background:'var(--yp-violet-lt)', borderRadius:'var(--radius-md)', display:'flex', gap:'var(--space-3)', alignItems:'flex-start' }}>
          <span style={{ fontSize:18, flexShrink:0 }}>🛡️</span>
          <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-violet-dk)', lineHeight:1.55 }}>
            Teen accounts need a parent's nod before going live. It's how we keep everyone safe — and it only takes 30 seconds.
          </p>
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleContinue} disabled={!selected}>
          Continue
        </button>
      </div>
    </div>
  );
}
