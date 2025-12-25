/**
 * Dev Browser Server
 * 
 * Simple HTTP server that manages a persistent Chrome browser.
 * Pages persist across client disconnections.
 */

import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILE_DIR = join(__dirname, "..", "profiles", "browser-data");
const TMP_DIR = join(__dirname, "..", "tmp");
const PORT = Number(process.env.PORT) || 9222;
const HEADLESS = process.env.HEADLESS === "true";

// Page registry
const pages = new Map<string, Page>();
let browser: Browser | null = null;
let wsEndpoint: string | null = null;

// Find Chrome executable
function findChrome(): string | null {
  const paths = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  
  try {
    const result = execSync("which google-chrome || which chromium || which chromium-browser 2>/dev/null", { encoding: "utf-8" }).trim();
    if (result) return result.split("\n")[0];
  } catch {}
  
  return null;
}

async function startBrowser(): Promise<void> {
  const executablePath = findChrome();
  
  if (!executablePath) {
    console.error("\n❌ Chrome/Chromium not found!\n");
    console.error("Install one of:");
    console.error("  Ubuntu/Debian: sudo apt install chromium-browser");
    console.error("  macOS:         brew install --cask google-chrome");
    console.error("  Arch:          sudo pacman -S chromium");
    console.error("");
    process.exit(1);
  }
  
  mkdirSync(PROFILE_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });
  
  console.log(`Chrome: ${executablePath}`);
  console.log(`Profile: ${PROFILE_DIR}`);
  console.log(`Headless: ${HEADLESS}`);
  
  browser = await puppeteer.launch({
    executablePath,
    headless: HEADLESS,
    userDataDir: PROFILE_DIR,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--disable-sync",
    ],
  });
  
  wsEndpoint = browser.wsEndpoint();
  console.log(`WebSocket: ${wsEndpoint}`);
  
  browser.on("disconnected", () => {
    console.log("Browser disconnected");
    process.exit(1);
  });
}

// HTTP request handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  
  try {
    // GET / - server info
    if (method === "GET" && path === "/") {
      return Response.json({ wsEndpoint, pages: [...pages.keys()] }, { headers });
    }
    
    // GET /pages - list pages
    if (method === "GET" && path === "/pages") {
      const pageList = [...pages.entries()].map(([name, page]) => ({
        name,
        url: page.url(),
      }));
      return Response.json({ pages: pageList }, { headers });
    }
    
    // POST /pages - create/get page
    if (method === "POST" && path === "/pages") {
      const body = await req.json() as { name: string };
      const { name } = body;
      
      if (!name || typeof name !== "string") {
        return Response.json({ error: "name is required" }, { status: 400, headers });
      }
      
      let page = pages.get(name);
      if (!page) {
        if (!browser) throw new Error("Browser not started");
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        pages.set(name, page);
        page.on("close", () => pages.delete(name));
      }
      
      return Response.json({ name, url: page.url(), wsEndpoint }, { headers });
    }
    
    // DELETE /pages/:name - close page
    if (method === "DELETE" && path.startsWith("/pages/")) {
      const name = decodeURIComponent(path.slice(7));
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      await page.close();
      pages.delete(name);
      return Response.json({ success: true }, { headers });
    }
    
    // POST /pages/:name/goto - navigate
    if (method === "POST" && path.match(/^\/pages\/[^/]+\/goto$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const body = await req.json() as { url: string; waitUntil?: string };
      await page.goto(body.url, { 
        waitUntil: (body.waitUntil as "load" | "domcontentloaded" | "networkidle0" | "networkidle2") || "domcontentloaded",
        timeout: 30000,
      });
      
      return Response.json({ url: page.url(), title: await page.title() }, { headers });
    }
    
    // POST /pages/:name/evaluate - run JS
    if (method === "POST" && path.match(/^\/pages\/[^/]+\/evaluate$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const body = await req.json() as { script: string };
      const result = await page.evaluate(body.script);
      
      return Response.json({ result }, { headers });
    }
    
    // POST /pages/:name/screenshot - take screenshot
    if (method === "POST" && path.match(/^\/pages\/[^/]+\/screenshot$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const body = await req.json() as { path?: string; fullPage?: boolean };
      const screenshotPath = body.path || join(TMP_DIR, `${name}-${Date.now()}.png`);
      
      await page.screenshot({ path: screenshotPath, fullPage: body.fullPage || false });
      
      return Response.json({ path: screenshotPath }, { headers });
    }
    
    // POST /pages/:name/click - click element
    if (method === "POST" && path.match(/^\/pages\/[^/]+\/click$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const body = await req.json() as { selector: string };
      await page.click(body.selector);
      
      return Response.json({ success: true }, { headers });
    }
    
    // POST /pages/:name/type - type text
    if (method === "POST" && path.match(/^\/pages\/[^/]+\/type$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const body = await req.json() as { selector: string; text: string };
      await page.type(body.selector, body.text);
      
      return Response.json({ success: true }, { headers });
    }
    
    // GET /pages/:name/content - get page HTML
    if (method === "GET" && path.match(/^\/pages\/[^/]+\/content$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const content = await page.content();
      return Response.json({ content }, { headers });
    }
    
    // GET /pages/:name/snapshot - get accessibility tree
    if (method === "GET" && path.match(/^\/pages\/[^/]+\/snapshot$/)) {
      const name = decodeURIComponent(path.split("/")[2]);
      const page = pages.get(name);
      
      if (!page) {
        return Response.json({ error: "Page not found" }, { status: 404, headers });
      }
      
      const snapshot = await page.accessibility.snapshot();
      return Response.json({ snapshot }, { headers });
    }
    
    return Response.json({ error: "Not found" }, { status: 404, headers });
    
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error:", message);
    return Response.json({ error: message }, { status: 500, headers });
  }
}

// Graceful shutdown
async function shutdown(): Promise<void> {
  console.log("\nShutting down...");
  
  for (const [, page] of pages) {
    try { await page.close(); } catch {}
  }
  pages.clear();
  
  if (browser) {
    try { await browser.close(); } catch {}
  }
  
  console.log("Goodbye!");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Main
console.log("Starting dev-browser server...");
await startBrowser();

Bun.serve({
  port: PORT,
  fetch: handleRequest,
});

console.log(`\nReady! http://localhost:${PORT}`);
console.log("Press Ctrl+C to stop\n");
