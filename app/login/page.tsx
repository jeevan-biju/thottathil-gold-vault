"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoBars, IconShield, IconLock, IconChevronLeft } from "@/components/icons";
import { useGRS } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useGRS((s) => s.login);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    boxes.current[0]?.focus();
    setResendIn(30);
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const sendOtp = () => {
    if (phone.length !== 10 || busy) return;
    setBusy(true);
    // Supabase Auth signInWithOtp({ phone: '+91' + phone })
    setTimeout(() => {
      setBusy(false);
      setStep("otp");
    }, 900);
  };

  const verify = (code: string) => {
    setBusy(true);
    // supabase.auth.verifyOtp({ phone, token: code, type: 'sms' })
    setTimeout(() => {
      login(`+91 ${phone.slice(0, 5)} ${phone.slice(5)}`);
      router.push("/dashboard");
    }, 900);
  };

  const onOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) boxes.current[i + 1]?.focus();
    if (digit && i === 5 && next.every((d) => d)) verify(next.join(""));
  };

  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) boxes.current[i - 1]?.focus();
  };

  const onOtpPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      e.preventDefault();
      setOtp(digits.split(""));
      verify(digits);
    }
  };

  const reject = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden px-6">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-3/20 blur-[100px]" />

      {/* brand block */}
      <div className="animate-rise flex flex-col items-center pt-16">
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-gold-3/25 blur-2xl" />
          <div className="card card-gold-edge relative flex h-20 w-20 items-center justify-center rounded-3xl">
            <LogoBars size={44} />
          </div>
        </div>
        <h1 className="mt-6 font-display text-[34px] leading-none tracking-tight">
          <span className="gold-text-animated">Thottathil</span>
        </h1>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-2/90">
          Fashion Jewellery
        </p>
        <p className="mt-5 text-center text-[15px] leading-relaxed text-muted">
          Save monthly. Watch your family&apos;s gold
          <br />
          grow <span className="text-ink">gram by gram</span>.
        </p>
      </div>

      {/* form */}
      <div className="flex flex-1 flex-col justify-center pb-10 pt-10">
        {step === "phone" ? (
          <div key="phone" className="animate-rise">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Mobile number
            </label>
            <div
              className={`card flex items-center gap-3 rounded-2xl px-4 py-4 ${
                shake ? "shake border-rose/50" : ""
              }`}
            >
              <span className="border-r hairline pr-3 text-[15px] font-semibold text-muted">
                +91
              </span>
              <input
                inputMode="numeric"
                autoFocus
                placeholder="98765 43210"
                value={phone.replace(/(\d{5})(?=\d)/g, "$1 ")}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                onKeyDown={(e) => e.key === "Enter" && (phone.length === 10 ? sendOtp() : reject())}
                className="tabular w-full bg-transparent text-lg font-semibold tracking-[0.14em] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-faint"
              />
            </div>
            <button
              onClick={() => (phone.length === 10 ? sendOtp() : reject())}
              disabled={busy}
              className="gold-bg shadow-gold mt-5 w-full rounded-2xl py-4 text-[15px] font-bold text-night-0 transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Sending OTP…" : "Get OTP"}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-faint">
              <IconLock width={12} height={12} />
              Secured by OTP · No password needed
            </p>
          </div>
        ) : (
          <div key="otp" className="animate-rise">
            <button
              onClick={() => {
                setStep("phone");
                setOtp(Array(6).fill(""));
              }}
              className="mb-5 flex items-center gap-1 text-xs font-medium text-muted"
            >
              <IconChevronLeft width={14} height={14} /> Change number
            </button>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Enter OTP sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
            </label>
            <div className="flex justify-between gap-2" onPaste={onOtpPaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKey(i, e)}
                  className="otp-box tabular h-14 w-full rounded-xl border hairline bg-night-2/60 text-center text-xl font-bold outline-none transition-all"
                />
              ))}
            </div>
            <button
              onClick={() => otp.every((d) => d) && verify(otp.join(""))}
              disabled={busy || !otp.every((d) => d)}
              className="gold-bg shadow-gold mt-5 w-full rounded-2xl py-4 text-[15px] font-bold text-night-0 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {busy ? "Verifying…" : "Verify & Open Vault"}
            </button>
            <p className="mt-4 text-center text-[11px] text-faint">
              {resendIn > 0 ? (
                <>Resend OTP in <span className="tabular text-muted">{resendIn}s</span></>
              ) : (
                <button className="font-semibold text-gold-2" onClick={sendOtp}>
                  Resend OTP
                </button>
              )}
              <span className="mx-2">·</span>Demo: any 6 digits work
            </p>
          </div>
        )}
      </div>

      {/* trust footer */}
      <div className="pb-[max(env(safe-area-inset-bottom),24px)]">
        <div className="card flex items-center justify-center gap-4 rounded-2xl px-4 py-3 text-[10px] font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <IconShield width={13} height={13} className="text-gold-2" /> BIS 916 Hallmarked
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>100% Secure</span>
          <span className="h-3 w-px bg-white/10" />
          <span>Since 1987</span>
        </div>
      </div>
    </main>
  );
}
