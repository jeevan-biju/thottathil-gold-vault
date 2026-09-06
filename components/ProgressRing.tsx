export default function ProgressRing({
  value,
  total,
  size = 116,
  stroke = 9,
}: {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, total === 0 ? 0 : value / total);
  // tick marks for each month
  const ticks = Array.from({ length: total }, (_, i) => {
    const angle = (i / total) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const r1 = r + stroke / 2 + 3;
    const r2 = r1 + 5;
    const cx = size / 2;
    const done = i < value;
    return {
      x1: cx + r1 * Math.cos(rad),
      y1: cx + r1 * Math.sin(rad),
      x2: cx + r2 * Math.cos(rad),
      y2: cx + r2 * Math.sin(rad),
      color: done ? "#EAC85F" : "rgba(148,163,205,0.25)",
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9E7A8" />
          <stop offset="55%" stopColor="#EAC85F" />
          <stop offset="100%" stopColor="#C9962E" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(148,163,205,0.16)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGold)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }}
      />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
