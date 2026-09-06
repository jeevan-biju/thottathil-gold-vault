import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));
const svg = readFileSync(new URL("../app/icon.svg", import.meta.url), "utf8");
mkdirSync(`${root}/public/icons`, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [size, scale] of [
  [192, 1],
  [512, 1],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><body style="margin:0;width:${size}px;height:${size}px">${
      // icon.svg is authored at 512; scale via width attr
      svg.replace('viewBox="0 0 512 512"', `viewBox="0 0 512 512" width="${size}" height="${size}"`)
    }</body>`,
  );
  await page.screenshot({ path: `${root}/public/icons/icon-${size}.png` });
  console.log(`icon-${size}.png`);
}

// maskable: shrink the safe zone (logo occupies center ~60%)
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(
  `<!doctype html><body style="margin:0;width:512px;height:512px;background:#04070E;display:grid;place-items:center">${
    svg.replace('viewBox="0 0 512 512"', 'viewBox="100 100 312 312" width="340" height="340"')
  }</body>`,
);
await page.screenshot({ path: `${root}/public/icons/icon-512-maskable.png` });
console.log("icon-512-maskable.png");

await browser.close();
