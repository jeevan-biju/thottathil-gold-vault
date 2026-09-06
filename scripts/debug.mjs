import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  colorScheme: "dark",
});
const page = await ctx.newPage();
page.on("console", (m) => console.log("[console]", m.type(), m.text().slice(0, 200)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());

// login
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
await page.fill('input[inputmode="numeric"]', "9847012345");
await page.click("text=Get OTP");
await page.waitForTimeout(1300);
const boxes = page.locator(".otp-box");
for (let i = 0; i < 6; i++) {
  await boxes.nth(i).click();
  await boxes.nth(i).pressSequentially(String(i + 1));
}
await page.waitForURL("**/dashboard", { timeout: 9000 });

// state before payment
const before = await page.evaluate(() => {
  const raw = localStorage.getItem("tfj-grs-v1");
  const s = JSON.parse(raw).state;
  return { phone: s.phone, months: s.ledger.filter((t) => t.status === "SUCCESS").length };
});
console.log("BEFORE:", JSON.stringify(before));

await page.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const header = await page.locator("section p").first().textContent();
console.log("CHECKOUT HEADER:", header);

await page.click("text=Google Pay");
await page.waitForTimeout(5000);

const after = await page.evaluate(() => {
  const raw = localStorage.getItem("tfj-grs-v1");
  const s = JSON.parse(raw).state;
  return {
    months: s.ledger.filter((t) => t.status === "SUCCESS").length,
    top: s.ledger[0],
  };
});
console.log("AFTER:", JSON.stringify(after, null, 1));

const successText = await page.locator("text=/Month \\d+ complete/").textContent().catch(() => "not found");
console.log("SUCCESS TEXT:", successText);

// confetti color probe
const conf = await page.evaluate(() => {
  const el = document.querySelector(".confetti-piece");
  if (!el) return "none";
  const cs = getComputedStyle(el);
  return { bg: cs.backgroundColor, w: cs.width, anim: cs.animationName };
});
console.log("CONFETTI:", JSON.stringify(conf));

await page.screenshot({ path: "/tmp/grs-shots/debug-success.png" });
await browser.close();
