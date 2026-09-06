"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import RequireAuth from "@/components/RequireAuth";
import {
  IconChevronRight,
  IconDownload,
  IconFile,
  IconInfo,
  IconLogout,
  IconShield,
  IconUser,
} from "@/components/icons";
import { useGRS } from "@/lib/store";

export default function Account() {
  const router = useRouter();
  const { profile, scheme, logout } = useGRS();

  const rows = [
    { Icon: IconFile, label: "Scheme agreement", sub: `${scheme.name} · PDF` },
    { Icon: IconDownload, label: "Statement of account", sub: "FY 2026–27" },
    { Icon: IconShield, label: "KYC & nominee", sub: `Verified · Nominee: ${profile.nominee}` },
    { Icon: IconInfo, label: "Help & support", sub: "Call 1800-425-1987" },
  ];

  return (
    <RequireAuth>
      <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-32">
        <header className="pt-6">
          <h1 className="font-display text-[22px] tracking-tight">Account</h1>
        </header>

        <section className="card card-gold-edge animate-rise mt-5 flex items-center gap-4 rounded-[28px] p-6">
          <div className="gold-bg flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[18px] font-extrabold text-night-0">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold">{profile.name}</p>
            <p className="tabular mt-0.5 text-[12px] text-muted">{profile.phone}</p>
            <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-mint">
              <IconShield width={10} height={10} /> KYC verified
            </p>
          </div>
        </section>

        <section className="card animate-rise mt-4 divide-y divide-white/6 rounded-[24px]" style={{ animationDelay: "80ms" }}>
          {rows.map(({ Icon, label, sub }) => (
            <button
              key={label}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-white/4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-3/70">
                <Icon width={18} height={18} className="text-gold-2" />
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold">{label}</p>
                <p className="mt-0.5 text-[11px] text-faint">{sub}</p>
              </div>
              <IconChevronRight width={16} height={16} className="text-faint" />
            </button>
          ))}
        </section>

        <section className="card animate-rise mt-4 rounded-[24px] p-5" style={{ animationDelay: "140ms" }}>
          <div className="flex items-center gap-3">
            <IconUser width={18} height={18} className="text-gold-2" />
            <p className="text-[12px] leading-relaxed text-muted">
              Member since <span className="font-semibold text-ink">{profile.memberSince}</span> ·
              Customer ID <span className="tabular font-semibold text-ink">TFJ-2026-08841</span>
            </p>
          </div>
        </section>

        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="animate-rise mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose/25 bg-rose/8 py-4 text-[13px] font-bold text-rose transition-transform active:scale-[0.98]"
          style={{ animationDelay: "200ms" }}
        >
          <IconLogout width={16} height={16} /> Sign out
        </button>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-faint">
          Thottathil Fashion Jewellery · Thrissur, Kerala
          <br />v1.0 · PWA
        </p>
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
