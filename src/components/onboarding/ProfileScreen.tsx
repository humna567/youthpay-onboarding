'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { ProgressBar } from '@/components/ui/ProgressBar';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Quetta', 'Multan', 'Other'];
const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export function ProfileScreen() {
  const { name, dob, school, city, gender, setProfile, nextStep } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter your full name';
    if (!dob) e.dob = 'Enter your date of birth';
    else {
      const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (age < 10 || age > 18) e.dob = 'You must be between 10 and 18 to join YouthPay';
    }
    if (!city) e.city = 'Select your city';
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    nextStep();
  };

  const isReady = name.trim().length >= 2 && dob && city;

  return (
    <div className="screen screen-padded">
      <ProgressBar total={9} current={5} />

      <div className="animate-fade-up" style={{ paddingTop: 'var(--space-6)' }}>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)', color: 'var(--brand-primary)', fontWeight: 600 }}>
          STEP 6 OF 9
        </p>
        <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>
          Create your profile
        </h1>
        <p className="body-md" style={{ marginBottom: 'var(--space-6)' }}>
          Let's personalise your experience.
        </p>

        {/* Avatar picker */}
        <div className="animate-fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--brand-primary-light)',
              border: '3px solid var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
            }}>
              {name.trim() ? name.trim()[0].toUpperCase() : '🧑'}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid #fff',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9.5 1.5l1 1-8 8H1.5V9l8-7.5zM7.5 3l1.5 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Name */}
          <div className="input-group">
            <label className="input-label" htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              type="text"
              className={`input-field${errors.name ? ' error' : ''}`}
              placeholder="Your full name"
              value={name}
              onChange={(e) => { setProfile({ name: e.target.value }); setErrors((err) => ({ ...err, name: '' })); }}
              autoFocus
              autoComplete="name"
            />
            {errors.name && <p className="input-error">{errors.name}</p>}
          </div>

          {/* DOB */}
          <div className="input-group">
            <label className="input-label" htmlFor="dob">Date of birth</label>
            <input
              id="dob"
              type="date"
              className={`input-field${errors.dob ? ' error' : ''}`}
              value={dob}
              onChange={(e) => { setProfile({ dob: e.target.value }); setErrors((err) => ({ ...err, dob: '' })); }}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && <p className="input-error">{errors.dob}</p>}
          </div>

          {/* School (optional) */}
          <div className="input-group">
            <label className="input-label" htmlFor="school">School / College <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="school"
              type="text"
              className="input-field"
              placeholder="e.g. Aga Khan School"
              value={school}
              onChange={(e) => setProfile({ school: e.target.value })}
            />
          </div>

          {/* City */}
          <div className="input-group">
            <label className="input-label" htmlFor="city">City</label>
            <select
              id="city"
              className={`input-field${errors.city ? ' error' : ''}`}
              value={city}
              onChange={(e) => { setProfile({ city: e.target.value }); setErrors((err) => ({ ...err, city: '' })); }}
              style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236C47FF' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              <option value="">Select city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <p className="input-error">{errors.city}</p>}
          </div>

          {/* Gender (optional) */}
          <div className="input-group">
            <label className="input-label">Gender <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {GENDERS.map((g) => (
                <button
                  key={g}
                  className={`chip${gender === g ? ' selected' : ''}`}
                  onClick={() => setProfile({ gender: gender === g ? '' : g })}
                  aria-pressed={gender === g}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleContinue} disabled={!isReady}>
          Continue
        </button>
      </div>
    </div>
  );
}
