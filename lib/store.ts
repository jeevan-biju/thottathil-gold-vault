"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LEDGER_SEED, PROFILE, RATES, SCHEME } from "./data";
import type { LedgerEntry, Profile, Rates, Scheme } from "./types";

interface GRSState {
  phone: string | null;
  profile: Profile;
  rates: Rates;
  scheme: Scheme;
  ledger: LedgerEntry[];

  login: (phone: string) => void;
  logout: () => void;
  /** Mirrors POST /api/payments/create-order -> Paysharp /order/intent.
   *  Returns the gateway order id; a PENDING row lands in the ledger. */
  createOrder: (method: LedgerEntry["method"]) => string;
  /** Mirrors the Paysharp webhook: locks the board rate, mints grams. */
  settleOrder: (orderId: string) => void;
  failOrder: (orderId: string) => void;
}

export const useGRS = create<GRSState>()(
  persist(
    (set, get) => ({
      phone: null,
      profile: PROFILE,
      rates: RATES,
      scheme: SCHEME,
      ledger: LEDGER_SEED,

      login: (phone) => set({ phone }),
      logout: () => set({ phone: null }),

      createOrder: (method) => {
        const orderId = `PS${Date.now().toString(36).toUpperCase()}${Math.floor(
          Math.random() * 900 + 100,
        )}`;
        const paid = paidMonths(get().ledger);
        const entry: LedgerEntry = {
          id: `txn_${orderId.toLowerCase()}`,
          gatewayRef: orderId,
          date: new Date().toISOString(),
          monthNo: Math.min(paid + 1, get().scheme.totalMonths),
          amountInr: get().scheme.installment,
          goldRate: null,
          grams: null,
          status: "PENDING",
          method,
        };
        set({ ledger: [entry, ...get().ledger] });
        return orderId;
      },

      settleOrder: (orderId) =>
        set({
          ledger: get().ledger.map((t) =>
            t.gatewayRef === orderId && t.status === "PENDING"
              ? {
                  ...t,
                  status: "SUCCESS",
                  goldRate: get().rates.r22,
                  grams:
                    Math.round((t.amountInr / get().rates.r22) * 1000) / 1000,
                }
              : t,
          ),
        }),

      failOrder: (orderId) =>
        set({
          ledger: get().ledger.map((t) =>
            t.gatewayRef === orderId && t.status === "PENDING"
              ? { ...t, status: "FAILED", note: "Payment failed · auto-refunded" }
              : t,
          ),
        }),
    }),
    { name: "tfj-grs-v1" },
  ),
);

/* ---------- derived selectors (the "aggregated ledger" reads) ---------- */

export const successTxns = (l: LedgerEntry[]) =>
  l.filter((t) => t.status === "SUCCESS");

export const totalGrams = (l: LedgerEntry[]) =>
  successTxns(l).reduce((s, t) => s + (t.grams ?? 0), 0);

export const totalPaid = (l: LedgerEntry[]) =>
  successTxns(l).reduce((s, t) => s + t.amountInr, 0);

export const paidMonths = (l: LedgerEntry[]) =>
  successTxns(l).filter((t) => t.monthNo > 0).length;

/** True once zustand has rehydrated from localStorage (avoids SSR mismatch). */
export const useHydrated = () => useGRS((s) => s !== undefined) && useHasHydrated();

import { useEffect, useState } from "react";
function useHasHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
