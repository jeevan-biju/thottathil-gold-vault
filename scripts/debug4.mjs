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

// freeze Math.random so the next Math.random()-based timestamp is traceable
await page.click("text=Google Pay");
await page.waitForTimeout(2000); // during "awaiting" — order created, not settled

const probe = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("tfj-grs-v1")).state;
  const top = s.ledger[0];
  const success = s.ledger.filter((x) => x.status === "SUCCESS").length;
  const bodyText = document.body.innerText;
  return {
    success,
    top: { monthNo: top.monthNo, status: top.status, ref: top.gatewayRef },
    headerText: bodyText.match(/Month \d+/)?.[0],
  };
});
console.log("DURING:", JSON.stringify(probe));

await page.waitForTimeout(2800);
const after = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("tfj-grs-v1")).state;
  return {
    success: s.ledger.filter((x) => x.status === "SUCCESS").length,
    top: { monthNo: s.ledger[0].monthNo, status: s.ledger[0].status },
    second: { monthNo: s.ledger[1].monthNo, status: s.ledger[1].status },
    text: document.body.innerText.match(/Month (\d+) complete/)?.[1],
  };
});
console.log("AFTER:", JSON.stringify(after));
await browser.close();
