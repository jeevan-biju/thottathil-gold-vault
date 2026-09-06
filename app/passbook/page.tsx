"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import RequireAuth from "@/components/RequireAuth";
import {
  IconCheck,
  IconClock,
  IconDownload,
  IconFile,
  LogoBars,
} from "@/components/icons";
import { fmtDate, fmtDateTime, fmtTime, grams, inr } from "@/lib/format";
import type { LedgerEntry } from "@/lib/types";
import { totalGrams, totalPaid, useGRS } from "@/lib/store";

const BADGE: Record<LedgerEntry["status"], { cls: string; label: string }> = {
  SUCCESS: { cls: "bg-mint/12 text-mint border-mint/25", label: "Success" },
  PENDING: { cls: "bg-saffron/12 text-saffron border-saffron/25", label: "Pending" },
  FAILED: { cls: "bg-rose/12 text-rose border-rose/25", label: "Failed" },
};

const FILTERS = ["All", "Success", "Pending", "Failed"] as const;

export default function Passbook() {
  const { ledger, profile, rates } = useGRS();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  const g = totalGrams(ledger);
  const paid = totalPaid(ledger);
  const shown = ledger.filter((t) =>
    filter === "All" ? true : t.status === filter.toUpperCase(),
  );

  return (
    <RequireAuth>
      <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-32">
        <header className="flex items-center justify-between pt-6">
          <div>
            <h1 className="font-display text-[22px] tracking-tight">Digital Passbook</h1>
            <p className="mt-0.5 text-[11px] text-faint">Every gram, accounted for</p>
          </div>
          <button className="card flex h-10 w-10 items-center justify-center rounded-full text-gold-2">
            <IconDownload width={17} height={17} />
          </button>
        </header>

        {/* summary strip */}
        <section className="card card-gold-edge animate-rise mt-5 grid grid-cols-3 divide-x divide-white/8 rounded-[24px] py-4">
          <div className="px-4 text-center">
            <p className="tabular text-[16px] font-extrabold text-gold-2">{grams(g)}</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-faint">Total gold</p>
          </div>
          <div className="px-4 text-center">
            <p className="tabular text-[16px] font-extrabold">{inr(paid)}</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-faint">Deposited</p>
          </div>
          <div className="px-4 text-center">
            <p className="tabular text-[16px] font-extrabold">{inr(g > 0 ? paid / g : 0)}</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-faint">Avg rate</p>
          </div>
        </section>

        {/* filters */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition-all active:scale-95 ${
                filter === f
                  ? "border-gold-3/50 bg-gold-3/15 text-gold-2"
                  : "border-white/10 bg-white/4 text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ledger */}
        <section className="animate-rise mt-4 space-y-3" style={{ animationDelay: "80ms" }}>
          {shown.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="card flex w-full items-center gap-3.5 rounded-[20px] px-4.5 py-4 text-left transition-transform active:scale-[0.985]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  t.status === "SUCCESS"
                    ? "bg-gold-3/12"
                    : t.status === "PENDING"
                      ? "bg-saffron/10"
                      : "bg-rose/10"
                }`}
              >
                {t.status === "SUCCESS" ? (
                  <LogoBars size={22} />
                ) : t.status === "PENDING" ? (
                  <IconClock width={19} height={19} className="text-saffron" />
                ) : (
                  <IconFile width={19} height={19} className="text-rose" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">
                  {t.monthNo > 0 ? `Month ${t.monthNo} installment` : "Payment attempt"}
                </p>
                <p className="tabular mt-0.5 truncate text-[11px] text-faint">
                  {fmtDateTime(t.date)} · {t.method}
                </p>
                {t.status === "SUCCESS" && (
                  <p className="tabular mt-0.5 text-[10.5px] text-muted">
                    Locked {inr(t.goldRate ?? 0)}/g
                  </p>
                )}
                {t.note && <p className="mt-0.5 text-[10.5px] text-rose/80">{t.note}</p>}
              </div>
              <div className="shrink-0 text-right">
                {t.status === "SUCCESS" && (
                  <p className="tabular text-[13px] font-bold text-gold-2">+{grams(t.grams ?? 0)}</p>
                )}
                <p className="tabular mt-0.5 text-[12px] font-semibold text-muted">
                  {inr(t.amountInr)}
                </p>
                <span
                  className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE[t.status].cls}`}
                >
                  {BADGE[t.status].label}
                </span>
              </div>
            </button>
          ))}
          {shown.length === 0 && (
            <p className="py-10 text-center text-[13px] text-faint">No {filter.toLowerCase()} transactions</p>
          )}
        </section>
      </main>

      {/* invoice sheet */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-night-0/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="card card-gold-edge animate-rise w-full max-w-md rounded-t-[28px] p-6 pb-[max(env(safe-area-inset-bottom),28px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-white/15" />
            <div className="mt-5 flex items-center justify-between">
              <h2 className="font-display text-[18px] tracking-tight">Tax Invoice</h2>
              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE[selected.status].cls}`}
              >
                {BADGE[selected.status].label}
              </span>
            </div>

            <div className="mt-5 space-y-3.5 text-[13px]">
              {[
                ["Invoice no.", `TFJ/2026/${selected.id.slice(-5).toUpperCase()}`],
                ["Date & time", fmtDateTime(selected.date)],
                ["Billed to", profile.name],
                ["Payment method", selected.method],
                ["Gateway ref", selected.gatewayRef],
                ["Amount paid", inr(selected.amountInr)],
                ...(selected.status === "SUCCESS"
                  ? [
                      ["Gold rate locked", `${inr(selected.goldRate ?? 0)} / gram (22K)`],
                      ["Gold credited", grams(selected.grams ?? 0)],
                      ["GST (3%)", "Included in board rate"],
                    ]
                  : []),
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <span className="text-muted">{k}</span>
                  <span className="tabular text-right font-semibold">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t hairline pt-4 text-center text-[10px] text-faint">
              Thottathil Fashion Jewellery · GSTIN 32AAACT1234F1ZP · BIS Licence CM/L-1987-0042
            </div>

            <button
              disabled={selected.status !== "SUCCESS"}
              className="gold-bg shadow-gold mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-night-0 transition-transform active:scale-[0.98] disabled:opacity-40"
            >
              <IconDownload width={16} height={16} />
              Download GST Invoice (PDF)
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </RequireAuth>
  );
}
