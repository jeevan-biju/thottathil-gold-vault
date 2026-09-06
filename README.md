# Thottathil Gold Vault — GRS PWA

Gold Recurring Savings platform for **Thottathil Fashion Jewellery**, built as a Progressive Web App that feels like native fintech (think Zerodha/Groww, but for gold savings).

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (mobile-first, dark luxury theme)
- **State:** Zustand (persisted to localStorage)
- **Backend (prod):** Supabase (PostgreSQL + RLS + Realtime)
- **Auth (prod):** Supabase Auth (Phone + SMS OTP)
- **Payments (prod):** Paysharp (UPI Intent + Virtual Accounts)
- **PWA:** Installable from browser, standalone display, offline-ready

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login/OTP | `/login` | Phone number + SMS OTP verification |
| Vault (Dashboard) | `/dashboard` | Gold grams, scheme progress, rate ticker, quick actions |
| Checkout | `/checkout` | UPI one-tap (GPay/PhonePe/Paytm) + bank transfer |
| Passbook | `/passbook` | Full transaction ledger + GST invoice sheets |
| Rates | `/rates` | Live 22K/24K board rate + 30-day trend chart |
| Account | `/account` | Profile, KYC, nominee, documents, sign out |

## Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000/login
```

Login: any 10-digit number → OTP: any 6 digits (demo mode).

## Architecture (Production)

The frontend **never** writes gold balances directly. The flow:

1. Client calls `POST /api/payments/create-order` → Paysharp `/order/intent`
2. Paysharp returns UPI deep links → client opens native UPI app
3. Payment success → Paysharp fires webhook → **server** locks board rate, mints grams in `scheme_ledgers`
4. Supabase Realtime pushes the update → PWA shows instant confetti

```
app/
├── api/payments/create-order/   # POST → Paysharp intent
├── api/webhooks/paysharp/       # POST → settle + mint gold (THE critical path)
├── login/page.tsx               # Phone + OTP
├── dashboard/page.tsx           # Vault hero + scheme tracker
├── checkout/page.tsx            # UPI / bank transfer
├── passbook/page.tsx            # Ledger + invoice sheets
├── rates/page.tsx               # Live board rate
└── account/page.tsx             # Profile + KYC
```

## Production Dependencies Needed

- **Supabase:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Paysharp:** `PAYSHARP_MERCHANT_ID`, `PAYSHARP_API_KEY`, `PAYSHARP_WEBHOOK_SECRET`
- **SMS:** Msg91 or similar for OTP delivery

Built for Thottathil Fashion Jewellery, Thrissur, Kerala.
