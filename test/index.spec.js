import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve } from "path";

const lib = readFileSync(
  resolve(__dirname, "../dist/circularProgressBar.js"),
  "utf-8",
);

const setup = async (page, html) => {
  await page.setContent(`<!DOCTYPE html><html><body>${html}</body></html>`);
  await page.addScriptTag({ content: lib });
};

const el = (percent, opts = "") =>
  `<div class="pie" data-pie='{"percent":${percent}${opts ? "," + opts : ""}}'></div>`;

const init = (page) =>
  page.evaluate(() => {
    const c = new window.CircularProgressBar("pie");
    c.initial();
  });

test("renders SVG element", async ({ page }) => {
  await setup(page, el(75));
  await init(page);
  await expect(page.locator(".pie svg")).toBeVisible();
});

test("SVG has role progressbar", async ({ page }) => {
  await setup(page, el(75));
  await init(page);
  expect(await page.locator(".pie svg").getAttribute("role")).toBe(
    "progressbar",
  );
});

test("SVG has correct dimensions", async ({ page }) => {
  await setup(page, el(75, '"size":150'));
  await init(page);
  const svg = page.locator(".pie svg");
  expect(await svg.getAttribute("width")).toBe("150");
  expect(await svg.getAttribute("height")).toBe("150");
});

test("progress circle class is set", async ({ page }) => {
  await setup(page, el(50));
  await init(page);
  await expect(page.locator(".pie-circle-1")).toBeAttached();
});

test("number:false hides text element", async ({ page }) => {
  await setup(page, el(50, '"number":false'));
  await init(page);
  await expect(page.locator(".pie text")).not.toBeAttached();
});

test("number:true shows percent text", async ({ page }) => {
  await setup(page, el(0, '"number":true,"animationOff":true'));
  await init(page);
  await expect(page.locator(".pie-percent-1")).toBeAttached();
});

test("animationOff sets percent immediately", async ({ page }) => {
  await setup(page, el(60, '"animationOff":true'));
  await init(page);
  const text = await page.locator(".pie-percent-1").textContent();
  expect(text).toBe("60");
});

test("gradient creates defs element", async ({ page }) => {
  await setup(page, el(75, '"lineargradient":["#f00","#00f"]'));
  await init(page);
  await expect(page.locator(".pie svg defs")).toBeAttached();
  await expect(page.locator(".pie svg linearGradient")).toBeAttached();
});

test("round option sets stroke-linecap to round", async ({ page }) => {
  await setup(page, el(50, '"round":true'));
  await init(page);
  const cap = await page
    .locator(".pie-circle-1")
    .getAttribute("stroke-linecap");
  expect(cap).toBe("round");
});

test("animationTo updates percent", async ({ page }) => {
  await setup(page, el(0, '"animationOff":true'));
  await init(page);
  await page.evaluate(() => {
    const c = new window.CircularProgressBar("pie");
    c.animationTo({ percent: 80, index: 1 });
  });
  const text = await page.locator(".pie-percent-1").textContent();
  expect(text).toBe("80");
});

test("multiple elements render independently", async ({ page }) => {
  await setup(
    page,
    `<div class="pie" data-pie='{"percent":25}'></div>
     <div class="pie" data-pie='{"percent":75}'></div>`,
  );
  await init(page);
  const svgs = page.locator(".pie svg");
  expect(await svgs.count()).toBe(2);
});

test("colorCircle adds background circle", async ({ page }) => {
  await setup(page, el(50, '"colorCircle":"#eee"'));
  await init(page);
  const circles = await page.locator(".pie svg circle").count();
  expect(circles).toBeGreaterThanOrEqual(2);
});

test("aria-valuemin and aria-valuemax are set", async ({ page }) => {
  await setup(page, el(50));
  await init(page);
  const svg = page.locator(".pie svg");
  expect(await svg.getAttribute("aria-valuemin")).toBe("0");
  expect(await svg.getAttribute("aria-valuemax")).toBe("100");
});
