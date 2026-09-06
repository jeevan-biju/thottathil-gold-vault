"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import RequireAuth from "@/components/RequireAuth";
import ProgressRing from "@/components/ProgressRing";
import Sparkline from "@/components/Sparkline";
import {
  IconBell,
  IconChart,
  IconChevronRight,
  IconLock,
  IconReceipt,
  IconRupee,
  IconSparkle,
  IconTrendUp,
  LogoBars,
} from "@/components/icons";
import { daysUntil, fmtDate, grams, inr, inrPlain } from "@/lib/format";
import {
  paidMonths,
  successTxns,
  totalGrams,
  totalPaid,
  useGRS,
} from "@/lib/store";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { profile, rates, scheme, ledger } = useGRS();

  const g = totalGrams(ledger);
  const paid = totalPaid(ledger);
  const months = paidMonths(ledger);
  const value = g * rates.r22;
  const gain = value - paid;
  const avgRate = g > 0 ? paid / g : 0;
  const dueIn = daysUntil(scheme.nextDueDate);
  const recent = successTxns(ledger).slice(0, 2);
  const pending = ledger.find((t) => t.status === "PENDING");

  return (
    <RequireAuth>
      <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-32">
        {/* header */}
        <header className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2.5">
            <LogoBars size={30} />
            <div className="leading-tight">
              <p className="font-display text-[17px] tracking-tight">Thottathil</p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.34em] text-gold-2/80">
                Gold Vault
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="card relative flex h-10 w-10 items-center justify-center rounded-full text-muted">
              <IconBell width={18} height={18} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold-2" />
            </button>
            <Link
              href="/account"
              className="gold-bg flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-night-0"
            >
              {profile.initials}
            </Link>
          </div>
        </header>

        {/* greeting + live board rate ticker */}
        <p className="mt-5 text-[13px] text-muted">
          {greeting()}, <span className="font-semibold text-ink">{profile.name.split(" ")[0]}</span>
        </p>
        <div className="card mt-3 overflow-hidden rounded-full py-2">
          <div className="flex w-max animate-ticker gap-8 whitespace-nowrap px-4 text-[11px] font-medium text-muted">
            {[0, 1].map((n) => (
              <span key={n} className="flex gap-8">
                <span>
                  22K <span className="tabular font-bold text-gold-2">{inr(rates.r22)}/g</span>
                  <span className="text-mint"> ▲{rates.changePct}%</span>
                </span>
                <span>
                  24K <span className="tabular font-bold text-gold-2">{inr(rates.r24)}/g</span>
                  <span className="text-mint"> ▲0.38%</span>
                </span>
                <span>
                  1 PAVAN (8g) <span className="tabular font-bold text-gold-2">{inr(rates.r22 * 8)}</span>
                </span>
                <span className="text-faint">Board rate · updated 10:30 AM</span>
              </span>
            ))}
          </div>
        </div>

        {/* HERO — the vault */}
        <section className="card card-gold-edge animate-rise relative mt-4 overflow-hidden rounded-[28px] p-6">
          <div className="vault-sweep" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold-3/15 blur-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                <IconLock width={11} height={11} className="text-gold-2" />
                Your Gold Vault · 22K
              </p>
              <p className="tabular mt-3 text-[46px] font-extrabold leading-none tracking-tight">
                <span className="gold-text-animated">{inrPlain(g, 3)}</span>
                <span className="ml-1.5 text-xl font-bold text-muted">g</span>
              </p>
              <p className="tabular mt-2.5 text-[15px] text-muted">
                ≈ <span className="font-semibold text-ink">{inr(value)}</span> today
              </p>
            </div>
            <div className="relative -mr-1 -mt-1">
              <ProgressRing value={months} total={scheme.totalMonths} size={92} stroke={8} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="tabular text-[15px] font-bold text-gold-2">{months}/{scheme.totalMonths}</span>
                <span className="text-[8px] uppercase tracking-widest text-faint">months</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-[11px] font-semibold text-mint">
              <IconTrendUp width={12} height={12} /> +{inr(gain)} all-time
            </span>
            <span className="tabular rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-muted">
              +{inr(24)} today
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t hairline pt-4 text-[12px]">
            <span className="text-muted">
              Deposited <span className="tabular font-semibold text-ink">{inr(paid)}</span>
            </span>
            <span className="text-muted">
              Avg buy <span className="tabular font-semibold text-gold-2">{inr(avgRate)}/g</span>
            </span>
          </div>
        </section>

        {/* quick actions */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <Link
            href="/checkout"
            className="gold-bg gold-sheen shadow-gold flex flex-col items-center gap-2 rounded-2xl py-4 text-night-0 transition-transform active:scale-95"
          >
            <IconRupee width={22} height={22} strokeWidth={2.2} />
            <span className="text-[12px] font-bold">Pay Now</span>
          </Link>
          <Link
            href="/passbook"
            className="card flex flex-col items-center gap-2 rounded-2xl py-4 text-ink transition-transform active:scale-95"
          >
            <IconReceipt width={22} height={22} className="text-gold-2" />
            <span className="text-[12px] font-semibold">Passbook</span>
          </Link>
          <Link
            href="/rates"
            className="card flex flex-col items-center gap-2 rounded-2xl py-4 text-ink transition-transform active:scale-95"
          >
            <IconChart width={22} height={22} className="text-gold-2" />
            <span className="text-[12px] font-semibold">Live Rate</span>
          </Link>
        </section>

        {/* active scheme */}
        <section className="card animate-rise mt-4 rounded-[24px] p-5" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-2">
                Active Scheme
              </p>
              <h2 className="font-display mt-1 text-[19px] tracking-tight">{scheme.name}</h2>
            </div>
            <span className="tabular rounded-full bg-gold-3/15 px-3 py-1 text-[11px] font-bold text-gold-2">
              Month {months} of {scheme.totalMonths}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="gold-bg h-full rounded-full transition-all duration-1000"
              style={{ width: `${(months / scheme.totalMonths) * 100}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="tabular text-[15px] font-bold">{inr(scheme.installment)}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                due {fmtDate(scheme.nextDueDate)}
                <span className={dueIn <= 5 ? "text-saffron" : "text-faint"}> · {dueIn} days left</span>
              </p>
            </div>
            {pending ? (
              <span className="flex items-center gap-1.5 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-[12px] font-bold text-saffron">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-saffron" />
                Confirming…
              </span>
            ) : (
              <Link
                href="/checkout"
                className="flex items-center gap-1 rounded-full border border-gold-3/40 bg-gold-3/10 px-4 py-2 text-[12px] font-bold text-gold-2 transition-transform active:scale-95"
              >
                Pay <IconChevronRight width={13} height={13} />
              </Link>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-gold-3/20 bg-gold-3/8 px-3 py-2.5">
            <IconSparkle width={15} height={15} className="mt-0.5 shrink-0 text-gold-2" />
            <p className="text-[11px] leading-relaxed text-gold-1/90">
              Complete all {scheme.totalMonths} months — {scheme.bonus}.
            </p>
          </div>
        </section>

        {/* board rate card */}
        <section className="card animate-rise mt-4 rounded-[24px] p-5" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              30-Day Gold Trend
            </p>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-mint">
              <IconTrendUp width={12} height={12} /> +5.1%
            </span>
          </div>
          <div className="mt-3">
            <Sparkline data={rates.history30d} id="dash" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/4 px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-faint">22K / gram</p>
              <p className="tabular mt-1 text-[17px] font-bold text-gold-2">{inr(rates.r22)}</p>
            </div>
            <div className="rounded-xl bg-white/4 px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-faint">24K / gram</p>
              <p className="tabular mt-1 text-[17px] font-bold text-gold-2">{inr(rates.r24)}</p>
            </div>
          </div>
        </section>

        {/* recent activity */}
        <section className="animate-rise mt-5" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[14px] font-semibold">Recent credits</h3>
            <Link href="/passbook" className="text-[12px] font-semibold text-gold-2">
              See all
            </Link>
          </div>
          <div className="card mt-3 divide-y divide-white/6 rounded-[24px]">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3.5 px-4.5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-3/12">
                  <LogoBars size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold">Month {t.monthNo} installment</p>
                  <p className="tabular mt-0.5 text-[11px] text-faint">
                    {fmtDate(t.date)} · locked {inr(t.goldRate ?? 0)}/g
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular text-[13px] font-bold text-gold-2">+{grams(t.grams ?? 0)}</p>
                  <p className="tabular mt-0.5 text-[11px] text-muted">{inr(t.amountInr)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
