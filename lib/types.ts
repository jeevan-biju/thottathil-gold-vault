export type TxnStatus = "SUCCESS" | "PENDING" | "FAILED";
export type PayMethod = "UPI" | "NEFT" | "IMPS" | "RTGS";

export interface LedgerEntry {
  id: string;
  gatewayRef: string;
  date: string; // ISO
  monthNo: number; // installment number in the scheme
  amountInr: number;
  goldRate: number | null; // locked 22K rate per gram at settlement
  grams: number | null; // credited at settlement
  status: TxnStatus;
  method: PayMethod;
  note?: string;
}

export interface Scheme {
  id: string;
  name: string;
  totalMonths: number;
  installment: number;
  nextDueDate: string; // ISO
  bonus: string;
}

export interface Rates {
  r22: number; // per gram
  r24: number; // per gram
  changePct: number; // vs yesterday, 22K
  updatedAt: string;
  history30d: number[]; // 22K per gram, oldest -> newest
}

export interface Profile {
  name: string;
  initials: string;
  phone: string;
  memberSince: string;
  nominee: string;
  kyc: "VERIFIED" | "PENDING";
}
