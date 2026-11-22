const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\Krish Prajapati\\.gemini\\antigravity\\brain\\49cec1c7-13b5-47e0-868c-4ad5de039821";

async function runTests() {
  console.log("Starting Next.js dev server on port 3000...");
  const server = spawn("node", ["./node_modules/next/dist/bin/next", "dev", "-p", "3000"], {
    cwd: "d:\\Krish_Portfolio",
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", (d) => console.log(`[Next stdout]: ${d.toString().trim()}`));
  server.stderr.on("data", (d) => console.log(`[Next stderr]: ${d.toString().trim()}`));

  const cleanup = () => {
    try {
      server.kill();
    } catch (e) {}
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("uncaughtException", cleanup);

  console.log("Waiting for http://localhost:3000 to be ready...");
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get("http://localhost:3000", (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error("status " + res.statusCode));
        });
        req.on("error", reject);
        req.setTimeout(1000, () => req.destroy());
      });
      console.log("Server is ready and responding with 200!");
      break;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log("Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // Listen for console logs and errors
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`[Browser ${msg.type()}]:`, msg.text());
    }
  });

  page.on("pageerror", (err) => {
    console.error("[Browser page error]:", err.message);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

  // Wait for preloader to finish (Preloader unmounts when isLoaded is true)
  console.log("Waiting for preloader to finish...");
  await page.waitForFunction(() => {
    const heroH1 = document.querySelector("#hero h1");
    return heroH1 && window.getComputedStyle(heroH1).opacity === "1";
  }, { timeout: 10000 });

  await new Promise((r) => setTimeout(r, 700));

  const viewports = [
    { name: "1920", width: 1920, height: 1080 },
    { name: "1440", width: 1440, height: 900 },
    { name: "1280", width: 1280, height: 800 },
    { name: "1024", width: 1024, height: 768 },
    { name: "768", width: 768, height: 1024 },
    { name: "390", width: 390, height: 844 },
  ];

  console.log("\n─── TESTING HERO VIEWPORTS & TITLE FIT ───");
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await new Promise((r) => setTimeout(r, 600)); // allow ResizeObserver & re-render

    const metrics = await page.evaluate((vpWidth) => {
      const h1 = document.querySelector("#hero h1");
      const titleRect = h1 ? h1.getBoundingClientRect() : null;
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasHorizontalScroll = scrollWidth > clientWidth + 1;

      return {
        hasHorizontalScroll,
        scrollWidth,
        clientWidth,
        titleText: h1 ? h1.innerText : "",
        titleWidth: titleRect ? titleRect.width : 0,
        titleLeft: titleRect ? titleRect.left : 0,
        titleRight: titleRect ? titleRect.right : 0,
        fitsInViewport: titleRect ? (titleRect.left >= 0 && titleRect.right <= vpWidth) : false,
      };
    }, vp.width);

    console.log(
      `Viewport ${vp.name}px: Title="${metrics.titleText}" | Width=${metrics.titleWidth.toFixed(1)}px (left=${metrics.titleLeft.toFixed(1)}, right=${metrics.titleRight.toFixed(1)}) | Fits: ${metrics.fitsInViewport} | Horizontal scroll: ${metrics.hasHorizontalScroll}`
    );

    const screenshotPath = path.join(ARTIFACT_DIR, `hero_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: hero_${vp.name}.png`);
  }

  console.log("\n─── TESTING ABOUT DOOR (CLOSED & OPEN) ───");
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 400));

  // Scroll to #doors
  await page.evaluate(() => {
    const doors = document.querySelector("#doors");
    if (doors) doors.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  // Ensure door is closed
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });
  await new Promise((r) => setTimeout(r, 500));

  const closedScreenshotPath = path.join(ARTIFACT_DIR, "door_about_closed.png");
  await page.screenshot({ path: closedScreenshotPath });
  console.log("Saved screenshot: door_about_closed.png");

  // Now click on Door 01 trigger to open it
  console.log("Clicking on Door 01 to swing open in 3D...");
  await page.evaluate(() => {
    const door1Trigger = document.querySelector('[aria-label*="Door 01"]');
    if (door1Trigger) door1Trigger.click();
  });

  // Wait 1.4s for 3D swing transition
  await new Promise((r) => setTimeout(r, 1400));

  // Verify content in Door 01
  const doorContent = await page.evaluate(() => {
    const door1 = document.querySelector(".door-interactive-item");
    if (!door1) return { found: false };
    const text = door1.innerText;
    return {
      found: true,
      hasStudentBuilder: text.includes("Student.") && text.includes("Builder."),
      hasDJSCE: text.includes("DJSCE") || text.includes("Dwarkadas"),
      hasCGPA: text.includes("9.10"),
      hasLanguages: text.includes("Python") && text.includes("Java"),
      hasFrameworks: text.includes("Django") && text.includes("Flutter"),
      hasDataBI: text.includes("Power BI") && text.includes("SQL"),
      fullTextSnippet: text.slice(0, 300),
    };
  });

  console.log("Door 01 Content Verification:", JSON.stringify(doorContent, null, 2));

  const openScreenshotPath = path.join(ARTIFACT_DIR, "door_about_open.png");
  await page.screenshot({ path: openScreenshotPath });
  console.log("Saved screenshot: door_about_open.png");

  // Test closing via Escape
  console.log("Testing Escape key to close door...");
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 1200));

  const isClosedAfterEsc = await page.evaluate(() => {
    const door1 = document.querySelector('[aria-label*="Door 01"]');
    return door1 ? door1.getAttribute("aria-expanded") === "false" : false;
  });
  console.log("Door closed after Escape:", isClosedAfterEsc);

  await browser.close();
  cleanup();
  console.log("\nAll tests completed successfully!");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
