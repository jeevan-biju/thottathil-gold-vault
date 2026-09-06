import type { LedgerEntry, Profile, Rates, Scheme } from "./types";

/**
 * Seed data standing in for Supabase rows.
 * In production these come from `scheme_ledgers`, `store_settings`
 * and `profiles` tables over PostgREST with RLS.
 */

export const PROFILE: Profile = {
  name: "Anjali Menon",
  initials: "AM",
  phone: "98470 12345",
  memberSince: "March 2026",
  nominee: "Rahul Menon",
  kyc: "VERIFIED",
};

export const SCHEME: Scheme = {
  id: "sch_swaranidhi_11plus1",
  name: "Swarna Nidhi 11+1",
  totalMonths: 11,
  installment: 20_000,
  nextDueDate: "2026-09-15T00:00:00+05:30",
  bonus: "100% making-charge waiver on your 12th-month purchase",
};

export const RATES: Rates = {
  r22: 7245,
  r24: 7904,
  changePct: 0.42,
  updatedAt: "2026-09-06T10:30:00+05:30",
  history30d: [
    6890, 6912, 6905, 6938, 6952, 6941, 6968, 6985, 6972, 6990, 7012, 7005,
    7032, 7058, 7044, 7071, 7062, 7090, 7118, 7102, 7126, 7140, 7131, 7158,
    7180, 7168, 7196, 7212, 7228, 7245,
  ],
};

const e = (
  id: string,
  monthNo: number,
  iso: string,
  rate: number | null,
  status: LedgerEntry["status"],
  method: LedgerEntry["method"],
  note?: string,
): LedgerEntry => ({
  id,
  gatewayRef: `PS2026${id.toUpperCase()}`,
  date: iso,
  monthNo,
  amountInr: 20_000,
  goldRate: rate,
  grams: rate ? Math.round((20_000 / rate) * 1000) / 1000 : null,
  status,
  method,
  note,
});

// Newest first — mirrors `select * from scheme_ledgers order by created_at desc`
export const LEDGER_SEED: LedgerEntry[] = [
  e("a8f41", 6, "2026-08-14T11:12:00+05:30", 7245, "SUCCESS", "UPI"),
  e("j2c97", 5, "2026-07-15T10:04:00+05:30", 7180, "SUCCESS", "UPI"),
  e("k5d21", 4, "2026-06-15T09:48:00+05:30", 7032, "SUCCESS", "UPI"),
  e("m9e04", 3, "2026-05-15T12:31:00+05:30", 7118, "SUCCESS", "NEFT"),
  e("p3f62", 2, "2026-04-15T10:15:00+05:30", 6985, "SUCCESS", "UPI"),
  e("q1r88", 0, "2026-04-02T18:20:00+05:30", null, "FAILED", "UPI", "Bank declined · auto-refunded"),
  e("w4n19", 1, "2026-03-15T09:02:00+05:30", 6910, "SUCCESS", "UPI"),
];
