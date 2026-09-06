import { useMemo } from "react";

const COLORS = ["#F9E7A8", "#EAC85F", "#C9962E", "#35D99A", "#F4F6FB", "#B4841F", "#F5DD90", "#8B6914"];

export default function Confetti({ count = 32 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 100 + Math.random() * 160;
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 30}px`,
          rot: `${Math.random() * 540 - 270}deg`,
          bg: COLORS[i % COLORS.length],
          shadow: `0 0 8px ${COLORS[i % COLORS.length]}, 0 0 2px ${COLORS[i % COLORS.length]}`,
          delay: `${Math.random() * 0.08}s`,
          w: 9 + Math.random() * 6,
          h: 12 + Math.random() * 10,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              "--dx": p.dx,
              "--dy": p.dy,
              "--rot": p.rot,
              background: p.bg,
              boxShadow: p.shadow,
              animationDelay: p.delay,
              width: p.w,
              height: p.h,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
