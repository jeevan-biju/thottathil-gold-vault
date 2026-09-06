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
await page.waitForSelector(".otp-box");
const boxes = page.locator(".otp-box");
for (let i = 0; i < 6; i++) {
  await boxes.nth(i).click();
  await page.keyboard.type(String(i + 1), { delay: 60 });
}
await page.waitForURL("**/dashboard", { timeout: 15000 });
await page.waitForTimeout(800);

const m = await page.evaluate(() => {
  const nav = document.querySelector("nav");
  const navRect = nav.getBoundingClientRect();
  const center = nav.querySelectorAll("div.grid > div")[2];
  const cRect = center.getBoundingClientRect();
  const link = center.querySelector("a");
  const lRect = link.getBoundingClientRect();
  const label = [...center.querySelectorAll("span")].map((s) => {
    const r = s.getBoundingClientRect();
    return { cls: s.className.slice(0, 40), top: r.top, bottom: r.bottom, h: r.height };
  });
  const vault = nav.querySelectorAll("div.grid > div")[0].querySelector("a");
  const vRect = vault.getBoundingClientRect();
  return {
    viewportH: innerHeight,
    nav: { top: navRect.top, bottom: navRect.bottom, h: navRect.height },
    centerCell: { top: cRect.top, bottom: cRect.bottom, h: cRect.height },
    payBtn: { top: lRect.top, bottom: lRect.bottom, h: lRect.height },
    centerSpans: label,
    vaultCell: { top: vRect.top, bottom: vRect.bottom, h: vRect.height },
  };
});
console.log(JSON.stringify(m, null, 1));
await browser.close();
