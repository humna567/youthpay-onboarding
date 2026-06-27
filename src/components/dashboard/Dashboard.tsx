'use client';
import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { MOCK_DASHBOARD_DATA } from '@/lib/api';

type NavTab = 'home'|'insights'|'cards'|'profile';

function getGreeting() {
  const h = new Date().getHours();
  if (h<5)  return ['Good night','🌙'];
  if (h<12) return ['Good morning','☀️'];
  if (h<17) return ['Good afternoon','⛅'];
  return ['Good evening','🌆'];
}

function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const step = target / (duration/16);
    const iv = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(iv); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(iv);
  }, [target, duration]);
  return val;
}

function SavingsRing({ saved, goal }: { saved:number; goal:number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);
  const pct = Math.min(Math.round((saved/goal)*100), 100);
  const r = 54; const circ = 2*Math.PI*r;
  const dash = animated ? (pct/100)*circ : 0;
  return (
    <div style={{ position:'relative', width:130, height:130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="11"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="11"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:'stroke-dasharray 1.6s cubic-bezier(0.34,1.56,0.64,1)', filter:'drop-shadow(0 0 8px rgba(0,212,160,0.5))' }}/>
        <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7C5CFF"/><stop offset="100%" stopColor="#00D4A0"/></linearGradient></defs>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:-1, lineHeight:1 }}>{pct}%</span>
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, marginTop:2 }}>saved</span>
      </div>
    </div>
  );
}

function CategoryBar({ icon, label, amount, total, color, delay }: { icon:string; label:string; amount:number; total:number; color:string; delay:number }) {
  const [w, setW] = useState(0);
  const pct = Math.round((amount/total)*100);
  useEffect(() => { const t = setTimeout(() => setW(pct), delay+400); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:'var(--text-sm)', fontWeight:600, color:'var(--yp-ink)' }}>{label}</span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:'var(--text-xs)', color:'var(--yp-mist)', fontWeight:600 }}>{pct}%</span>
            <span style={{ fontSize:'var(--text-sm)', fontWeight:800, color:'var(--yp-ink)', fontVariantNumeric:'tabular-nums' }}>₨{amount.toLocaleString()}</span>
          </div>
        </div>
        <div style={{ height:6, background:'var(--yp-cloud)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${w}%`, background:color, borderRadius:3, transition:'width 1.1s cubic-bezier(0.34,1.56,0.64,1)' }}/>
        </div>
      </div>
    </div>
  );
}

function TxRow({ merchant, amount, category, date, type }: { merchant:string; amount:number; category:string; date:string; type:'debit'|'credit' }) {
  const META: Record<string, { icon:string; bg:string }> = {
    Food:{icon:'🍔',bg:'#FFF7E6'}, Shopping:{icon:'🛍️',bg:'#F0ECFF'}, Income:{icon:'💵',bg:'var(--yp-emerald-lt)'}, Utilities:{icon:'⚡',bg:'#FFF0F3'}, Gaming:{icon:'🎮',bg:'#F0ECFF'}, Other:{icon:'📦',bg:'var(--yp-fog)'}
  };
  const m = META[category] ?? META.Other;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid var(--yp-cloud)' }}>
      <div style={{ width:44, height:44, borderRadius:12, background:type==='credit'?'var(--yp-emerald-lt)':m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{m.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, fontSize:'var(--text-sm)', color:'var(--yp-ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{merchant}</p>
        <p style={{ fontSize:'var(--text-xs)', color:'var(--yp-mist)', marginTop:2 }}>
          {new Date(date).toLocaleDateString('en-PK',{weekday:'short',month:'short',day:'numeric'})} · {category}
        </p>
      </div>
      <p style={{ fontWeight:800, fontSize:'var(--text-sm)', color:type==='credit'?'var(--yp-emerald)':'var(--yp-ink)', fontVariantNumeric:'tabular-nums', flexShrink:0 }}>
        {type==='credit'?'+':'−'}₨{amount.toLocaleString()}
      </p>
    </div>
  );
}

const NAV = {
  home:(a:boolean)=><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill={a?'var(--yp-violet-lt)':'none'}/><path d="M8 20v-8h6v8" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  insights:(a:boolean)=><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="12" width="4" height="8" rx="1.5" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.6" fill={a?'var(--yp-violet-lt)':'none'}/><rect x="9" y="7" width="4" height="13" rx="1.5" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.6" fill={a?'var(--yp-violet-lt)':'none'} opacity="0.8"/><rect x="15" y="2" width="4" height="18" rx="1.5" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.6" fill={a?'var(--yp-violet-lt)':'none'} opacity="0.6"/></svg>,
  cards:(a:boolean)=><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="5" width="18" height="14" rx="3" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8" fill={a?'var(--yp-violet-lt)':'none'}/><path d="M2 9h18" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8"/><rect x="5" y="13" width="5" height="3" rx="1" fill={a?'var(--yp-violet)':'var(--yp-mist)'}/></svg>,
  profile:(a:boolean)=><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7.5" r="3.5" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8" fill={a?'var(--yp-violet-lt)':'none'}/><path d="M4 18.5c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke={a?'var(--yp-violet)':'var(--yp-mist)'} strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

export function Dashboard() {
  const [tab, setTab] = useState<NavTab>('home');
  const store = useOnboardingStore();
  const data = MOCK_DASHBOARD_DATA;
  const [greeting, greetIcon] = getGreeting();
  const firstName = store.name.split(' ')[0] || data.userName;
  const personality = store.personality;
  const savedDisplay = useCountUp(data.savedAmount, 1200);
  const todayDisplay = useCountUp(data.todaySpent, 800);
  const weekDisplay  = useCountUp(data.weeklySpent, 900);

  const AI_TIPS: Record<string, string> = {
    'smart-saver': `You're saving better than 78% of YouthPay users your age. Skip one ₨300 snack per week and you'll add ₨1,200 to your goal this month. 🌱`,
    'balanced-planner': `Great balance this week! You spent ₨380 less than last week. Move that directly to savings for a quick win. ⚖️`,
    'impulse-explorer': `Food is 48% of your spending this week. One mindful skip per day saves you ₨3,000 this month. Small changes, big results. 🎯`,
  };
  const aiTip = personality ? AI_TIPS[personality] : data.aiTip;

  const CATS = [
    { icon:'🍔', label:'Food & Drinks', amount:1540, color:'#7C5CFF' },
    { icon:'🛍️', label:'Shopping',       amount:1200, color:'#00D4A0' },
    { icon:'🎮', label:'Gaming',          amount:300,  color:'#F59E0B' },
    { icon:'⚡',  label:'Utilities',       amount:200,  color:'#F43F5E' },
  ];
  const totalCat = CATS.reduce((s,c)=>s+c.amount,0);
  const PERS_LABEL: Record<string,{emoji:string;label:string}> = {
    'smart-saver':      {emoji:'🌱',label:'Smart Saver'},
    'balanced-planner': {emoji:'⚖️', label:'Balanced Planner'},
    'impulse-explorer': {emoji:'🛍️',label:'Impulse Explorer'},
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--yp-fog)' }}>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>

        {/* ── Hero ── */}
        <div style={{ background:'linear-gradient(160deg, #1A0A4E 0%, #3D2AAB 50%, #5A3DD4 100%)', padding:'var(--space-6) var(--space-6) 52px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,92,255,0.3) 0%, transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-50, left:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,160,0.12) 0%, transparent 70%)', pointerEvents:'none' }}/>

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-6)' }}>
            <div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'var(--text-sm)', fontWeight:500 }}>{greeting} {greetIcon}</p>
              <h1 style={{ color:'#fff', fontSize:'var(--text-2xl)', fontWeight:900, letterSpacing:-0.5, lineHeight:1.1 }}>{firstName}</h1>
            </div>
            <div style={{ display:'flex', gap:'var(--space-2)' }}>
              <button aria-label="Notifications" style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(8px)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5 5 0 015 5v3l1.5 2.5H2.5L4 10V7a5 5 0 015-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg, var(--yp-emerald), var(--yp-emerald-dk))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff', border:'2px solid rgba(255,255,255,0.2)', cursor:'pointer' }}>
                {firstName[0]?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Savings ring + balance */}
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-6)' }}>
            <SavingsRing saved={data.savedAmount} goal={data.savingsGoal}/>
            <div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'var(--text-xs)', fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, marginBottom:4 }}>Savings goal</p>
              <p style={{ color:'#fff', fontSize:'var(--text-2xl)', fontWeight:900, letterSpacing:-0.8, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>₨{savedDisplay.toLocaleString()}</p>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'var(--text-sm)', marginTop:3 }}>of ₨{data.savingsGoal.toLocaleString()} target</p>
              <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', background:'rgba(0,212,160,0.18)', border:'1px solid rgba(0,212,160,0.3)', borderRadius:'var(--radius-full)' }}>
                <span style={{ fontSize:12 }}>🔥</span>
                <span style={{ fontSize:'var(--text-xs)', fontWeight:700, color:'#00E5B0' }}>{data.streakDays}-day saving streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body cards ── */}
        <div style={{ padding:'0 var(--space-4) var(--space-6)', marginTop:-28 }}>

          {/* Parent monitoring */}
          {data.parentApprovalActive && (
            <div className="animate-slide-up" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', background:'#fff', borderRadius:'var(--radius-md)', border:'1px solid var(--yp-cloud)', boxShadow:'var(--shadow-md)', marginBottom:'var(--space-4)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--yp-emerald)', flexShrink:0, boxShadow:'0 0 6px rgba(0,212,160,0.6)' }}/>
              <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-slate)', flex:1, lineHeight:1.4 }}>
                <strong>Parent monitoring active</strong> · Weekly summaries sent automatically
              </p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--yp-emerald)" strokeWidth="1.5"/><path d="M5 8l2.5 2.5L11 5" stroke="var(--yp-emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}

          {/* Stat cards */}
          <div className="animate-fade-up delay-1" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)', marginBottom:'var(--space-4)' }}>
            <div className="insight-card">
              <p className="insight-label">Today</p>
              <p className="insight-value" style={{ fontVariantNumeric:'tabular-nums' }}>₨{todayDisplay.toLocaleString()}</p>
              <p className="insight-sub">3 transactions</p>
            </div>
            <div className="insight-card">
              <p className="insight-label">This week</p>
              <p className="insight-value" style={{ fontVariantNumeric:'tabular-nums' }}>₨{weekDisplay.toLocaleString()}</p>
              <p className="insight-sub" style={{ color:'var(--yp-rose)', fontWeight:600 }}>↑ 12% vs last week</p>
            </div>
          </div>

          {/* AI Tip — conversation style */}
          <div className="animate-fade-up delay-2" style={{ background:'linear-gradient(135deg, #F0ECFF 0%, #E8F5FF 100%)', borderRadius:'var(--radius-lg)', border:'1px solid #DDD6FF', padding:'var(--space-5)', marginBottom:'var(--space-4)' }}>
            <div style={{ display:'flex', gap:'var(--space-3)', alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'var(--yp-violet)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, boxShadow:'0 4px 12px rgba(124,92,255,0.3)' }}>🤖</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, fontWeight:800, color:'var(--yp-violet)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>AI Money Tip</p>
                <p style={{ fontSize:'var(--text-sm)', color:'var(--yp-ink)', lineHeight:1.65, fontWeight:500 }}>{aiTip}</p>
                <div style={{ display:'flex', gap:'var(--space-2)', marginTop:'var(--space-3)' }}>
                  <button style={{ padding:'5px 12px', background:'var(--yp-violet)', borderRadius:'var(--radius-full)', border:'none', fontSize:'var(--text-xs)', fontWeight:700, color:'#fff', cursor:'pointer' }}>Got it 👍</button>
                  <button style={{ padding:'5px 12px', background:'transparent', borderRadius:'var(--radius-full)', border:'1px solid var(--yp-cloud)', fontSize:'var(--text-xs)', fontWeight:600, color:'var(--yp-mist)', cursor:'pointer' }}>Snooze</button>
                </div>
              </div>
            </div>
          </div>

          {/* Spending categories */}
          <div className="animate-fade-up delay-2" style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--yp-cloud)', padding:'var(--space-5)', marginBottom:'var(--space-4)' }}>
            <div className="section-header">
              <p className="section-title">Where money went</p>
              <button className="section-action">This week</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
              {CATS.map((c,i) => <CategoryBar key={c.label} {...c} total={totalCat} delay={i*100}/>)}
            </div>
            <div style={{ marginTop:'var(--space-4)', padding:'10px 12px', background:'var(--yp-amber-lt)', borderRadius:'var(--radius-sm)', borderLeft:'3px solid var(--yp-amber)', display:'flex', gap:'var(--space-2)' }}>
              <span style={{ fontSize:13 }}>🍔</span>
              <p style={{ fontSize:'var(--text-sm)', color:'#92400e', lineHeight:1.5 }}>
                You spent <strong>{data.topCategoryPercent}% on {data.topCategory}</strong> this week — higher than your goal.
              </p>
            </div>
          </div>

          {/* Streak */}
          <div className="animate-fade-up delay-3" style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--yp-cloud)', padding:'var(--space-5)', marginBottom:'var(--space-4)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-4)' }}>
              <div>
                <p className="insight-label" style={{ marginBottom:4 }}>Saving streak</p>
                <p style={{ fontSize:'var(--text-xl)', fontWeight:800, color:'var(--yp-ink)', letterSpacing:-0.5 }}>🔥 {data.streakDays} days in a row!</p>
              </div>
              <div style={{ padding:'6px 14px', background:'var(--yp-violet-lt)', borderRadius:'var(--radius-full)', fontSize:'var(--text-sm)', fontWeight:700, color:'var(--yp-violet)' }}>
                +{data.streakDays*5} pts
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['M','T','W','T','F','S','S'].map((d,i) => {
                const active = i < data.streakDays; const isToday = i === data.streakDays-1;
                return <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, flex:1 }}>
                  <div style={{ width:'100%', aspectRatio:'1', borderRadius:10, background:active?(isToday?'var(--yp-violet)':'var(--yp-violet-lt)'):'var(--yp-fog)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:active?14:11, color:active?(isToday?'#fff':'var(--yp-violet)'):'var(--yp-cloud)', fontWeight:700, boxShadow:isToday?'0 4px 12px rgba(124,92,255,0.35)':'none', transition:'all 0.3s' }}>
                    {active?'🔥':d}
                  </div>
                  <span style={{ fontSize:9, fontWeight:600, color:active?'var(--yp-violet)':'var(--yp-cloud)', letterSpacing:0.2 }}>{d}</span>
                </div>;
              })}
            </div>
            <p style={{ fontSize:'var(--text-xs)', color:'var(--yp-mist)', marginTop:'var(--space-3)', textAlign:'center' }}>
              {7-data.streakDays} more days to unlock the <strong>Week Warrior 🏆</strong> badge
            </p>
          </div>

          {/* Transactions */}
          <div className="animate-fade-up delay-4" style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--yp-cloud)', padding:'var(--space-5)', marginBottom:'var(--space-4)' }}>
            <div className="section-header">
              <p className="section-title">Recent transactions</p>
              <button className="section-action">See all</button>
            </div>
            {data.transactions.map(tx => <TxRow key={tx.id} {...tx}/>)}
          </div>

          {/* Personality card */}
          {personality && (
            <div className="animate-fade-up delay-5" style={{ background:'linear-gradient(135deg, #1A0A4E, #3D2AAB)', borderRadius:'var(--radius-lg)', padding:'var(--space-5)', marginBottom:'var(--space-4)' }}>
              <p style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Your money personality</p>
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
                <span style={{ fontSize:36 }}>{PERS_LABEL[personality]?.emoji}</span>
                <div>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:'var(--text-lg)', marginBottom:2 }}>{PERS_LABEL[personality]?.label}</p>
                  <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'var(--text-sm)' }}>AI tips personalised for you</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {(['home','insights','cards','profile'] as NavTab[]).map(id => {
          const labels: Record<NavTab,string> = {home:'Home',insights:'Insights',cards:'Cards',profile:'Profile'};
          const active = tab===id;
          return <button key={id} className={`nav-item${active?' active':''}`} onClick={() => setTab(id)} aria-label={labels[id]} aria-current={active?'page':undefined}>
            <div className="nav-icon-wrap">{NAV[id](active)}</div>
            <span>{labels[id]}</span>
          </button>;
        })}
      </nav>
    </div>
  );
}
