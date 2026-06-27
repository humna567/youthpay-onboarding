'use client';
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';

interface Confetti { id:number; x:number; color:string; size:number; delay:number; rotate:number; shape:string; }
const COLORS = ['#7C5CFF','#00D4A0','#F7B731','#F43F5E','#5A3DD4','#00A87E','#F59E0B'];

export function SuccessScreen() {
  const { nextStep, name, goal, personality, savingsTarget } = useOnboardingStore();
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setConfetti(Array.from({length:32}, (_,i) => ({
      id:i, x:Math.random()*100, color:COLORS[Math.floor(Math.random()*COLORS.length)],
      size:6+Math.random()*10, delay:Math.random()*1.5, rotate:Math.random()*360, shape:Math.random()>0.5?'circle':'rect'
    })));
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const firstName = name.split(' ')[0] || 'there';
  const PERS = { 'smart-saver':'🌱 Smart Saver', 'balanced-planner':'⚖️ Balanced Planner', 'impulse-explorer':'🛍️ Impulse Explorer' };
  const GOALS = { 'save-money':'💰 Saving money', 'pocket-money':'🧾 Pocket money', 'shopping':'🛍️ Shopping fund', 'gaming':'🎮 Gaming fund', 'education':'📚 Education', 'travel':'✈️ Travel' };

  const chips = [
    goal && GOALS[goal],
    savingsTarget && `₨${savingsTarget.toLocaleString()} target`,
    personality && PERS[personality],
    '✅ Identity verified',
  ].filter(Boolean) as string[];

  return (
    <div className="screen" style={{ alignItems:'center', justifyContent:'space-between', textAlign:'center', overflow:'hidden', position:'relative', padding:'var(--space-8) var(--space-6)' }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{ position:'absolute', left:`${c.x}%`, top:-20, width:c.size, height:c.size, background:c.color, borderRadius:c.shape==='circle'?'50%':'2px', animation:`confetti-fall ${1.8+Math.random()}s ease-in ${c.delay}s both`, transform:`rotate(${c.rotate}deg)`, zIndex:0 }} />
      ))}

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--space-6)', zIndex:1 }}>
        {/* Animated checkmark */}
        <div className="animate-bounce-in" style={{ width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg, var(--yp-emerald), var(--yp-emerald-dk))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-emerald)' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 25l9 9 15-15" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="50" strokeDashoffset={phase >= 1 ? 0 : 50}
              style={{ transition:'stroke-dashoffset 0.6s var(--ease-out)' }} />
          </svg>
        </div>

        <div className={phase>=1?'animate-fade-up':''} style={{ opacity:phase>=1?1:0, transition:'opacity 0.4s' }}>
          <p style={{ fontSize:'var(--text-sm)', fontWeight:700, color:'var(--yp-emerald)', textTransform:'uppercase', letterSpacing:1, marginBottom:'var(--space-2)' }}>You're in.</p>
          <h1 className="heading-lg" style={{ marginBottom:'var(--space-3)' }}>Welcome, {firstName}.</h1>
          <p className="body-md" style={{ maxWidth:280, margin:'0 auto' }}>
            Pakistan's smartest teenagers manage their money here. Now you're one of them.
          </p>
        </div>

        {/* Summary chips */}
        {phase >= 2 && (
          <div className="animate-fade-up" style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)', justifyContent:'center' }}>
            {chips.map(c => (
              <div key={c} style={{ padding:'7px 14px', background:'var(--yp-fog)', border:'1px solid var(--yp-cloud)', borderRadius:'var(--radius-full)', fontSize:'var(--text-sm)', fontWeight:600, color:'var(--yp-slate)' }}>{c}</div>
            ))}
          </div>
        )}

        {/* Parent note */}
        {phase >= 2 && (
          <div className="animate-fade-up delay-1" style={{ padding:'var(--space-4)', background:'var(--yp-emerald-lt)', borderRadius:'var(--radius-md)', width:'100%', textAlign:'left', display:'flex', gap:'var(--space-3)' }}>
            <span style={{ fontSize:22, flexShrink:0 }}>👨‍👩‍👦</span>
            <p style={{ fontSize:'var(--text-sm)', color:'#006b4f', lineHeight:1.55 }}>
              <strong>Your parent has been notified.</strong> They'll receive weekly spending summaries — you're in control of the rest.
            </p>
          </div>
        )}
      </div>

      <button className="btn btn-primary animate-fade-up delay-3" onClick={nextStep} style={{ width:'100%', zIndex:1, marginTop:'var(--space-6)' }}>
        Let's see my dashboard →
      </button>
    </div>
  );
}
