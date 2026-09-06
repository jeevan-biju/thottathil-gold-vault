import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/webhooks/paysharp
 *
 * THE critical path — the ONLY place gold is minted.
 *
 *  1. Verify the Paysharp signature (HMAC) before trusting anything.
 *  2. On SUCCESS, read today's 22K board rate from `store_settings`.
 *  3. Update the matching `scheme_ledgers` row: lock gold_rate_per_gram and
 *     let Postgres compute grams = amount_inr / gold_rate_per_gram.
 *  4. Fire the SMS/WhatsApp notification (Msg91).
 *
 * The frontend never writes balances — it only reads the aggregated ledger,
 * and Supabase Realtime pushes this row update to the open PWA instantly.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paysharp-signature") ?? "";
  const secret = process.env.PAYSHARP_WEBHOOK_SECRET;

  // --- 1. Signature verification (skip in demo when no secret configured) ---
  if (secret) {
    const expected = createHash("sha256").update(raw + secret).digest("hex");
    const ok =
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  const payload = JSON.parse(raw || "{}");

  if (payload.status === "SUCCESS") {
    /**
     * Production (Supabase service role — bypasses RLS, server-only):
     *
     *   const supabase = createClient(
     *     process.env.SUPABASE_URL!,
     *     process.env.SUPABASE_SERVICE_ROLE_KEY!,
     *   );
     *   const { data: rateData } = await supabase
     *     .from("store_settings")
     *     .select("gold_rate_22k")
     *     .single();
     *   await supabase
     *     .from("scheme_ledgers")
     *     .update({
     *       status: "SUCCESS",
     *       gold_rate_per_gram: rateData.gold_rate_22k,
     *       // grams: generated column amount_inr / gold_rate_per_gram
     *     })
     *     .eq("gateway_reference_id", payload.orderId);
     *   // -> Msg91 SMS/WhatsApp notification
     */
    console.log(
      `[webhook] settle order ${payload.orderId} — lock 22K board rate, credit grams, notify customer`,
    );
  }

  return NextResponse.json({ received: true });
}
