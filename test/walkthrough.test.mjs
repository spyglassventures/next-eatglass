import puppeteer from "puppeteer";
import fs from "fs";
import assert from "node:assert";

const BASE_URL = process.env.URL || "http://localhost:3000/";

const abort = (msg) => {
  console.error(`Abort: ${msg}`);
  process.exit(1);
}

const takeScreenshot = async (page, path) => {
  if (!fs.existsSync("./screenshots")) {
    fs.mkdirSync("./screenshots");
  }

  await page.screenshot({
    path: `./screenshots/screenshot-${Date.now()}-${path.substring(1)}.webp`,
    type: "webp",
    fullPage: true,
    captureBeyondViewport: true,
  });
};

// path must start with '/'
const browseAndScreenshotPath = async (page, path) => {
  if (!path.startsWith("/")) {
    abort(`Path must start with '/' but did not: '${path}'`);
  }

  const response = await page.goto(`${BASE_URL}${path}`);
  assert.equal(response.status(), 200);
  await takeScreenshot(page, path);
};

// Launch the browser and open a new blank page, go to URL, resize window.
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1024 });

await browseAndScreenshotPath(page, "/");
await browseAndScreenshotPath(page, "/intern");

await browser.close();
