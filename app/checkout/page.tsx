"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Confetti from "@/components/Confetti";
import CopyButton from "@/components/CopyButton";
import RequireAuth from "@/components/RequireAuth";
import {
  IconBank,
  IconCheck,
  IconChevronLeft,
  IconInfo,
  IconLock,
  IconShield,
  LogoBars,
} from "@/components/icons";
import { grams, inr, inrPlain } from "@/lib/format";
import { paidMonths, useGRS } from "@/lib/store";

type Phase = "idle" | "redirecting" | "awaiting" | "success";

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", chip: "G", chipClass: "bg-white text-[#4285F4]" },
  { id: "phonepe", name: "PhonePe", chip: "Pe", chipClass: "bg-[#5F259F] text-white" },
  { id: "paytm", name: "Paytm", chip: "P", chipClass: "bg-[#002E6E] text-[#00B9F1]" },
] as const;

const VA = { number: "5020 0041 8899 2211", ifsc: "PYSH0002211", name: "THOTTATHIL FASHION JEWELLERY" };

export default function Checkout() {
  const router = useRouter();
  const { rates, scheme, ledger, createOrder, settleOrder, failOrder } = useGRS();

  const months = paidMonths(ledger);
  const monthNo = Math.min(months + 1, scheme.totalMonths);
  const amount = scheme.installment;
  const estGrams = amount / rates.r22;

  const [phase, setPhase] = useState<Phase>("idle");
  const [app, setApp] = useState<string>("");
  // Credited values frozen at settlement time — after this the component's
  // derived `monthNo`/`estGrams` shift as the ledger re-renders.
  const [credited, setCredited] = useState<{ grams: number; month: number } | null>(null);
  const orderRef = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const payWith = (name: string) => {
    setApp(name);
    // POST /api/payments/create-order -> Paysharp /order/intent
    const orderId = createOrder("UPI");
    orderRef.current = orderId;
    setPhase("redirecting");
    // window.location.href = gpayUrl  (deep link into the UPI app)
    timers.current.push(setTimeout(() => setPhase("awaiting"), 1600));
    // Paysharp webhook -> Supabase update (simulated settlement)
    timers.current.push(
      setTimeout(() => {
        // Freeze display values BEFORE settlement — once settleOrder runs,
        // the ledger shifts and derived monthNo jumps +1 in the next render.
        setCredited({ grams: estGrams, month: months + 1 });
        settleOrder(orderId);
        setPhase("success");
        timers.current.push(setTimeout(() => router.push("/dashboard"), 2600));
      }, 4600),
    );
  };
  const cancel = () => {
    timers.current.forEach(clearTimeout);
    if (orderRef.current) failOrder(orderRef.current);
    setPhase("idle");
  };

  return (
    <RequireAuth>
      <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-32">
        <header className="flex items-center gap-3 pt-6">
          <button
            onClick={() => router.back()}
            className="card flex h-10 w-10 items-center justify-center rounded-full text-muted"
          >
            <IconChevronLeft width={18} height={18} />
          </button>
          <h1 className="font-display text-[19px] tracking-tight">Pay Installment</h1>
        </header>

        {/* order summary */}
        <section className="card card-gold-edge animate-rise mt-5 rounded-[28px] p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              {scheme.name} · Month {monthNo}
            </p>
            <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint">
              On track
            </span>
          </div>
          <p className="tabular mt-3 text-[38px] font-extrabold leading-none tracking-tight">
            {inr(amount)}
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gold-3/20 bg-gold-3/8 px-4 py-3">
            <div className="gold-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <LogoBars size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-muted">Estimated gold credit today</p>
              <p className="tabular text-[14px] font-bold text-gold-2">
                ≈ {grams(estGrams)}
              </p>
            </div>
            <p className="tabular text-right text-[10px] leading-relaxed text-faint">
              @ {inr(rates.r22)}/g
              <br />
              22K board rate
            </p>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-faint">
            <IconInfo width={12} height={12} className="mt-0.5 shrink-0" />
            Grams are locked at the board rate the moment your payment clears —
            the amount above never changes.
          </p>
        </section>

        {/* UPI one-tap */}
        <section className="animate-rise mt-6" style={{ animationDelay: "70ms" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
              UPI One-Tap
            </h2>
            <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint">
              Zero fees
            </span>
          </div>
          <div className="card mt-3 divide-y divide-white/6 rounded-[24px]">
            {UPI_APPS.map((a) => (
              <button
                key={a.id}
                onClick={() => payWith(a.name)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-white/4"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-extrabold ${a.chipClass}`}
                >
                  {a.chip}
                </span>
                <span className="flex-1 text-[14px] font-semibold">{a.name}</span>
                <span className="tabular text-[13px] font-semibold text-muted">
                  {inr(amount)}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-faint">
            <IconLock width={11} height={11} /> Amount pre-filled & locked · opens your UPI app
          </p>
        </section>

        {/* bank transfer */}
        <section className="animate-rise mt-6" style={{ animationDelay: "140ms" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
              Bank Transfer
            </h2>
            <span className="text-[10px] font-medium text-faint">Best above ₹1 lakh</span>
          </div>
          <div className="card mt-3 rounded-[24px] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-3/70">
                <IconBank width={20} height={20} className="text-gold-2" />
              </div>
              <div>
                <p className="text-[12px] font-semibold">Your dedicated virtual account</p>
                <p className="text-[10.5px] text-faint">NEFT · IMPS · RTGS — credited in ~30 min</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/4 px-4 py-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-faint">Account number</p>
                  <p className="tabular mt-0.5 text-[14px] font-bold tracking-wider">{VA.number}</p>
                </div>
                <CopyButton text={VA.number.replace(/\s/g, "")} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/4 px-4 py-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-faint">IFSC</p>
                  <p className="tabular mt-0.5 text-[14px] font-bold tracking-wider">{VA.ifsc}</p>
                </div>
                <CopyButton text={VA.ifsc} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/4 px-4 py-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-faint">Beneficiary</p>
                  <p className="mt-0.5 text-[12px] font-bold">{VA.name}</p>
                </div>
                <CopyButton text={VA.name} />
              </div>
            </div>
          </div>
        </section>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[10.5px] text-faint">
          <IconShield width={12} height={12} className="text-gold-2" />
          Payments processed by Paysharp · PCI-DSS compliant
        </p>
      </main>

      <BottomNav />

      {/* payment overlay */}
      {phase !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-0/85 px-6 backdrop-blur-md">
          <div className="card card-gold-edge relative w-full max-w-sm overflow-hidden rounded-[28px] p-8 text-center">
            {phase === "success" && <Confetti />}

            {phase === "redirecting" && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/6">
                  <span className="animate-pulse-soft text-[22px] font-extrabold text-gold-2">
                    {UPI_APPS.find((a) => a.name === app)?.chip}
                  </span>
                </div>
                <p className="mt-5 text-[16px] font-bold">Opening {app}…</p>
                <p className="mt-2 text-[12px] text-muted">
                  Approve the collect request of <span className="tabular font-semibold text-ink">{inr(amount)}</span> in your UPI app
                </p>
              </>
            )}

            {phase === "awaiting" && (
              <>
                <div className="mx-auto h-16 w-16 animate-spin rounded-full border-[3px] border-gold-3 border-t-transparent" />
                <p className="mt-5 text-[16px] font-bold">Confirming with your bank…</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                  Gold is credited the instant Paysharp confirms.
                  <br />
                  Please don&apos;t close this screen.
                </p>
                <button
                  onClick={cancel}
                  className="mt-5 text-[12px] font-semibold text-faint underline underline-offset-4"
                >
                  Cancel payment
                </button>
              </>
            )}

            {phase === "success" && (
              <>
                <div className="gold-bg animate-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-gold">
                  <IconCheck width={36} height={36} strokeWidth={2.4} className="text-night-0" />
                </div>
                <p className="gold-text mt-5 font-display text-[24px] tracking-tight">
                  Gold credited!
                </p>
                <p className="tabular mt-2 text-[30px] font-extrabold">
                  +{inrPlain(credited?.grams ?? estGrams, 3)} <span className="text-lg text-muted">g</span>
                </p>
                <p className="tabular mt-1.5 text-[12px] text-muted">
                  Rate locked at {inr(rates.r22)}/g · Month {credited?.month ?? monthNo} complete
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="gold-bg shadow-gold mt-6 w-full rounded-2xl py-3.5 text-[14px] font-bold text-night-0"
                >
                  Back to Vault
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
