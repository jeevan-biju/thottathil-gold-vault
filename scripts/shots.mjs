import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "/tmp/grs-shots";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  colorScheme: "dark",
});
const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && console.log("[console.error]", m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

// clean slate so seeded state is deterministic
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot:", name);
};

// 1. login
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await shot("01-login");

await page.fill('input[inputmode="numeric"]', "9847012345");
await page.click("text=Get OTP");
await page.waitForSelector(".otp-box", { timeout: 5000 });
await shot("02-otp");

const boxes = page.locator(".otp-box");
for (let i = 0; i < 6; i++) {
  await boxes.nth(i).click();
  await page.keyboard.type(String(i + 1), { delay: 80 });
}
await page.waitForURL("**/dashboard", { timeout: 15000 });
await page.waitForTimeout(1100);
await shot("03-dashboard-top");

await page.evaluate(() => window.scrollTo({ top: 620, behavior: "instant" }));
await page.waitForTimeout(400);
await shot("04-dashboard-mid");

// 2. checkout
await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("05-checkout");

await page.click("text=Google Pay");
await page.waitForTimeout(700);
await shot("06-pay-opening");
await page.waitForTimeout(1800);
await shot("07-pay-awaiting");
await page.waitForTimeout(2400);
await shot("08-pay-success");
await page.waitForURL("**/dashboard", { timeout: 9000 });
await page.waitForTimeout(900);
await shot("09-dashboard-after-pay");

// 3. passbook
await page.goto(`${BASE}/passbook`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("10-passbook");
await page.locator("section button.w-full").first().click();
await page.waitForTimeout(600);
await shot("11-invoice");
await page.keyboard.press("Escape");
await page.click("div.fixed.inset-0", { position: { x: 20, y: 100 } });

// 4. rates + account
await page.goto(`${BASE}/rates`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("12-rates");
await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("13-account");

await browser.close();
console.log("done");
