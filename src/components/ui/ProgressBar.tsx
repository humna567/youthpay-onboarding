'use client';
interface Props { total: number; current: number; }
export function ProgressBar({ total, current }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <div className="progress-liquid">
        <div className="progress-liquid-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
