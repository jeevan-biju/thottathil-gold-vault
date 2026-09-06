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
await page.waitForTimeout(4800);

const probe = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("tfj-grs-v1")).state;
  const success = s.ledger.filter((x) => x.status === "SUCCESS").length;
  const text = document.body.innerText.match(/Month (\d+) complete/)?.[1];
  // find every text node containing "complete" and its computed color
  const hits = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.textContent.includes("complete")) {
      const el = n.parentElement;
      hits.push({
        text: n.textContent.trim().slice(0, 60),
        html: el.outerHTML.slice(0, 220),
      });
    }
  }
  return { success, text, hits };
});
console.log(JSON.stringify(probe, null, 1));
await browser.close();
