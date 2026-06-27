'use client';
import { useEffect, useRef } from 'react';
import { useOnboardingStore } from '@/store/onboarding';

export function SplashScreen() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { timerRef.current = setTimeout(nextStep, 3000); return () => clearTimeout(timerRef.current); }, [nextStep]);

  return (
    <div role="status" aria-label="YouthPay loading" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(165deg, #1A0A4E 0%, #3D2AAB 45%, #5A3DD4 100%)', minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:-100, right:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,92,255,0.25) 0%, transparent 70%)' }} />
      <div style={{ position:'absolute', bottom:-80, left:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,160,0.15) 0%, transparent 70%)' }} />
      <div style={{ position:'absolute', top:'40%', left:'10%', width:8, height:8, borderRadius:'50%', background:'rgba(247,183,49,0.8)', animation:'star-twinkle 2s ease-in-out 0.5s infinite' }} />
      <div style={{ position:'absolute', top:'25%', right:'15%', width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.6)', animation:'star-twinkle 2s ease-in-out 1s infinite' }} />
      <div style={{ position:'absolute', top:'65%', right:'20%', width:6, height:6, borderRadius:'50%', background:'rgba(0,212,160,0.7)', animation:'star-twinkle 2s ease-in-out 0.2s infinite' }} />

      {/* Logo mark */}
      <div className="animate-bounce-in" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, zIndex:1 }}>
        <div style={{ width:100, height:100, background:'rgba(255,255,255,0.1)', borderRadius:30, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(20px)', border:'1.5px solid rgba(255,255,255,0.2)', boxShadow:'0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)', animation:'glow-pulse 3s ease-in-out infinite' }}>
          <svg width="58" height="58" viewBox="0 0 58 58" fill="none" aria-hidden="true">
            <path d="M14 9L29 32L44 9" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M29 32V52" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
            <circle cx="43" cy="43" r="10" fill="#00D4A0"/>
            <path d="M39 43h8M43 39v8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ textAlign:'center' }}>
          <h1 className="animate-fade-up delay-1" style={{ fontSize:36, fontWeight:900, color:'#fff', letterSpacing:-1.5, lineHeight:1 }}>YouthPay</h1>
          <p className="animate-fade-up delay-2" style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginTop:8, letterSpacing:0.5 }}>
            Finally. Money that gets you.
          </p>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="animate-fade-up delay-5" style={{ position:'absolute', bottom:52, display:'flex', alignItems:'center', gap:8, padding:'8px 18px', background:'rgba(255,255,255,0.08)', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}>
        <span style={{ fontSize:16 }}>🇵🇰</span>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:600 }}>Aapke liye. Pakistan se.</span>
      </div>

      {/* Loading dots */}
      <div className="animate-fade-in delay-4" style={{ position:'absolute', bottom:24, display:'flex', gap:6 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.4)', animation:`dot-pulse 1.4s ease-in-out ${i*0.18}s infinite` }} />)}
      </div>

      <style>{`
        @keyframes dot-pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.3)} }
        @keyframes star-twinkle { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 20px 60px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.25),0 0 20px rgba(124,92,255,0.3)} 50%{box-shadow:0 20px 60px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.25),0 0 40px rgba(124,92,255,0.6)} }
      `}</style>
    </div>
  );
}
