import { NextResponse } from "next/server";

/**
 * POST /api/payments/create-order
 *
 * Production flow:
 *  1. Validate the Supabase session (JWT from the HTTP-only cookie).
 *  2. Call Paysharp `/order/intent` with { amount, scheme_id } to mint
 *     UPI deep links (gpayUrl / phonepeUrl / paytmUrl).
 *  3. Insert a PENDING row into `scheme_ledgers` keyed by Paysharp's orderId.
 *  4. Return the deep links — the client redirects into the UPI app.
 *
 * This demo build has no live Paysharp/Supabase credentials, so it returns
 * a realistic stub payload; the client store simulates the PENDING insert.
 */
export async function POST(req: Request) {
  const { amount, method } = await req.json().catch(() => ({}));

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  }

  const orderId = `PS${Date.now().toString(36).toUpperCase()}`;

  // Shape mirrors Paysharp's /order/intent response.
  return NextResponse.json({
    orderId,
    amount,
    currency: "INR",
    method: method ?? "UPI",
    intent: {
      gpayUrl: `upi://pay?pa=tfj@paysharp&pn=Thottathil%20Fashion%20Jewellery&am=${amount}&cu=INR&tr=${orderId}`,
      phonepeUrl: `upi://pay?pa=tfj@paysharp&pn=Thottathil%20Fashion%20Jewellery&am=${amount}&cu=INR&tr=${orderId}`,
      paytmUrl: `upi://pay?pa=tfj@paysharp&pn=Thottathil%20Fashion%20Jewellery&am=${amount}&cu=INR&tr=${orderId}`,
    },
    expiresInSec: 300,
  });
}
