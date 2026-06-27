'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { MoneyPersonality } from '@/types';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; points: Record<MoneyPersonality, number> }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'You just got ₨ 1,000 pocket money. What do you do first?',
    options: [
      { label: '💰 Save most of it', value: 'save', points: { 'smart-saver': 3, 'balanced-planner': 1, 'impulse-explorer': 0 } },
      { label: '🛍️ Buy something I\'ve been wanting', value: 'spend', points: { 'smart-saver': 0, 'balanced-planner': 1, 'impulse-explorer': 3 } },
      { label: '⚖️ Save half, spend half', value: 'both', points: { 'smart-saver': 1, 'balanced-planner': 3, 'impulse-explorer': 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Your favourite brand has a sale. What happens?',
    options: [
      { label: '🏃 I buy immediately — can\'t miss deals!', value: 'buy', points: { 'smart-saver': 0, 'balanced-planner': 1, 'impulse-explorer': 3 } },
      { label: '🤔 I check if I actually need it first', value: 'think', points: { 'smart-saver': 2, 'balanced-planner': 3, 'impulse-explorer': 0 } },
      { label: '🙈 Sales don\'t really tempt me', value: 'ignore', points: { 'smart-saver': 3, 'balanced-planner': 1, 'impulse-explorer': 0 } },
    ],
  },
  {
    id: 'q3',
    question: 'How long does your pocket money usually last?',
    options: [
      { label: '😅 Gone in a week', value: 'week', points: { 'smart-saver': 0, 'balanced-planner': 1, 'impulse-explorer': 3 } },
      { label: '👍 Lasts about two weeks', value: 'twoweeks', points: { 'smart-saver': 1, 'balanced-planner': 3, 'impulse-explorer': 1 } },
      { label: '🏆 I still have some at month end', value: 'month', points: { 'smart-saver': 3, 'balanced-planner': 2, 'impulse-explorer': 0 } },
    ],
  },
  {
    id: 'q4',
    question: 'What would you do with ₨ 5,000?',
    options: [
      { label: '📱 Upgrade something I use daily', value: 'upgrade', points: { 'smart-saver': 0, 'balanced-planner': 2, 'impulse-explorer': 3 } },
      { label: '🎯 Save it towards a bigger goal', value: 'goal', points: { 'smart-saver': 3, 'balanced-planner': 2, 'impulse-explorer': 0 } },
      { label: '🎉 Treat myself AND save some', value: 'mix', points: { 'smart-saver': 1, 'balanced-planner': 3, 'impulse-explorer': 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'A friend invites you to an expensive outing. You can\'t afford it without using your savings. You…',
    options: [
      { label: '💸 Dip into savings, YOLO', value: 'yolo', points: { 'smart-saver': 0, 'balanced-planner': 0, 'impulse-explorer': 3 } },
      { label: '🤝 Suggest a cheaper alternative', value: 'alternative', points: { 'smart-saver': 2, 'balanced-planner': 3, 'impulse-explorer': 0 } },
      { label: '🏠 Politely decline', value: 'decline', points: { 'smart-saver': 3, 'balanced-planner': 1, 'impulse-explorer': 0 } },
    ],
  },
];

const RESULTS: Record<MoneyPersonality, { emoji: string; title: string; desc: string; color: string; tips: string[] }> = {
  'smart-saver': {
    emoji: '🌱',
    title: 'Smart Saver',
    desc: 'You naturally protect your money and think before spending. You\'re building great habits.',
    color: '#00C896',
    tips: ['Set stretch savings goals', 'Try a 30-day challenge', 'Explore passive saving rules'],
  },
  'balanced-planner': {
    emoji: '⚖️',
    title: 'Balanced Planner',
    desc: 'You enjoy life AND save for the future. You\'re the most financially resilient type.',
    color: '#6C47FF',
    tips: ['Create category budgets', 'Track weekly vs monthly spend', 'Plan for special occasions'],
  },
  'impulse-explorer': {
    emoji: '🛍️',
    title: 'Impulse Explorer',
    desc: 'You love treating yourself — that\'s fun! YouthPay will help you enjoy spending AND build savings.',
    color: '#FF9A00',
    tips: ['Set spending alerts', 'Use a 24-hour wait rule', 'Start with a small savings jar'],
  },
};

export function PersonalityQuizScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<MoneyPersonality | null>(null);
  const { setPersonality, nextStep, name } = useOnboardingStore();

  const handleAnswer = (questionId: string, value: string, option: Question['options'][0]) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    } else {
      // Calculate personality
      const scores: Record<MoneyPersonality, number> = { 'smart-saver': 0, 'balanced-planner': 0, 'impulse-explorer': 0 };
      Object.entries(newAnswers).forEach(([qId, ansVal]) => {
        const q = QUESTIONS.find((q) => q.id === qId);
        const opt = q?.options.find((o) => o.value === ansVal);
        if (opt) {
          Object.entries(opt.points).forEach(([k, v]) => { scores[k as MoneyPersonality] += v; });
        }
      });
      const personality = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as MoneyPersonality;
      setResult(personality);
      setPersonality(personality);
    }
  };

  const question = QUESTIONS[currentQ];

  // Result screen
  if (result) {
    const r = RESULTS[result];
    return (
      <div className="screen screen-padded">
        <ProgressBar total={9} current={6} />
        <div className="animate-scale-in" style={{ paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <p className="body-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>STEP 7 OF 9 · PERSONALITY RESULT</p>

          {/* Result card */}
          <div style={{
            background: r.color,
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: '#fff',
          }}>
            <div style={{ fontSize: 56, marginBottom: 'var(--space-3)' }}>{r.emoji}</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              {name ? `${name.split(' ')[0]}, you're a` : "You're a"}
            </h2>
            <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{r.title}</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6, fontSize: 'var(--text-base)' }}>{r.desc}</p>
          </div>

          {/* Personalised tips */}
          <div>
            <p style={{ fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--gray-900)' }}>
              Based on your type, YouthPay will:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {r.tips.map((tip, i) => (
                <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: r.color, fontWeight: 700 }}>✓</span>
                  <p className="body-sm" style={{ color: 'var(--gray-700)' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-action">
          <button className="btn btn-primary" onClick={nextStep}>
            Set my first goal →
          </button>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={6} />

      <div style={{ paddingTop: 'var(--space-6)' }}>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)', color: 'var(--brand-primary)', fontWeight: 600 }}>
          STEP 7 OF 9 · {currentQ + 1} of {QUESTIONS.length}
        </p>

        {/* Quiz progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-6)' }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= currentQ ? 'var(--brand-primary)' : 'var(--gray-200)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        <div key={question.id} className="animate-fade-up">
          <h2 className="heading-md" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.4 }}>
            {question.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {question.options.map((opt, i) => (
              <button
                key={opt.value}
                className={`quiz-option animate-fade-up delay-${i + 1}`}
                style={answers[question.id] === opt.value ? { borderColor: 'var(--brand-primary)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary-dark)', fontWeight: 600 } : {}}
                onClick={() => handleAnswer(question.id, opt.value, opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
