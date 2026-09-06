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

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());
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
await page.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.click("text=Google Pay");

for (const t of [4500, 4600, 4700, 4800, 5000]) {
  await page.waitForTimeout(t === 4500 ? 4500 : t - prev);
  var prev = t;
  const state = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("tfj-grs-v1")).state;
    const success = s.ledger.filter((x) => x.status === "SUCCESS").length;
    const m = document.body.innerText.match(/Month (\d+) complete/);
    return { success, text: m ? m[1] : null };
  });
  console.log(`t=${t}ms`, JSON.stringify(state));
}
await browser.close();
