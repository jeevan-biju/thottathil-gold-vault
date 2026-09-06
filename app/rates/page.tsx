"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import RequireAuth from "@/components/RequireAuth";
import Sparkline from "@/components/Sparkline";
import { IconTrendUp } from "@/components/icons";
import { inr } from "@/lib/format";
import { useGRS } from "@/lib/store";

export default function Rates() {
  const { rates } = useGRS();
  const [unit, setUnit] = useState<1 | 8>(1);

  const f = (perGram: number) => inr(perGram * unit);

  return (
    <RequireAuth>
      <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-32">
        <header className="flex items-center justify-between pt-6">
          <div>
            <h1 className="font-display text-[22px] tracking-tight">Today&apos;s Board Rate</h1>
            <p className="mt-0.5 text-[11px] text-faint">Updated 10:30 AM · Kerala board</p>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/4 p-1 text-[11px] font-bold">
            {([1, 8] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-full px-3.5 py-1.5 transition-all ${
                  unit === u ? "gold-bg text-night-0" : "text-muted"
                }`}
              >
                {u === 1 ? "1 g" : "Pavan"}
              </button>
            ))}
          </div>
        </header>

        <section className="card card-gold-edge animate-rise mt-5 rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                22K · 916 Hallmark {unit === 8 && "· 8 g"}
              </p>
              <p className="tabular gold-text-animated mt-2 text-[40px] font-extrabold leading-none tracking-tight">
                {f(rates.r22)}
              </p>
              <p className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-mint">
                <IconTrendUp width={13} height={13} /> +{rates.changePct}% vs yesterday
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">24K</p>
              <p className="tabular mt-2 text-[20px] font-bold">{f(rates.r24)}</p>
              <p className="mt-2 text-[12px] font-semibold text-mint">+0.38%</p>
            </div>
          </div>
          <div className="mt-5">
            <Sparkline data={rates.history30d} id="rates" height={110} />
          </div>
          <div className="tabular mt-2 flex justify-between text-[10px] text-faint">
            <span>Aug 8</span>
            <span>30-day trend</span>
            <span>Today</span>
          </div>
        </section>

        <section className="card animate-rise mt-4 rounded-[24px] p-5" style={{ animationDelay: "80ms" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-2">
            Why it matters
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Your installments buy gold at the{" "}
            <span className="font-semibold text-ink">board rate on the day your payment clears</span>.
            When rates rise, gold you already locked in keeps its edge — your vault is
            up <span className="font-semibold text-mint">+2.4%</span> overall.
          </p>
        </section>

        <section className="animate-rise mt-4 grid grid-cols-2 gap-3" style={{ animationDelay: "140ms" }}>
          <div className="card rounded-[20px] p-4">
            <p className="text-[10px] uppercase tracking-widest text-faint">Your avg buy</p>
            <p className="tabular mt-1 text-[17px] font-bold text-gold-2">{inr(7077)}/g</p>
          </div>
          <div className="card rounded-[20px] p-4">
            <p className="text-[10px] uppercase tracking-widest text-faint">Today&apos;s rate</p>
            <p className="tabular mt-1 text-[17px] font-bold">{inr(rates.r22)}/g</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
