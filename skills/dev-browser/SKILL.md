---
name: dev-browser
description: Browser automation with persistent state. Use for navigating websites, filling forms, screenshots, scraping, testing web apps. Triggers: "go to [url]", "click", "fill form", "screenshot", "scrape", "automate", "test website".
---

# Dev Browser

Persistent browser automation via HTTP API. Pages survive script disconnections.

## Dependencies

- [bun](https://bun.sh) - JavaScript runtime
- Chrome/Chromium:
  - Ubuntu/Debian: `sudo apt install chromium-browser`
  - macOS: `brew install --cask google-chrome`
  - Arch: `sudo pacman -S chromium`

## Quick Start

```bash
# Start server (run once, keep running)
cd skills/dev-browser && bun run start

# Or headless
HEADLESS=true bun run start
```

Wait for "Ready!" then use the client or HTTP API.

## Client Usage

```typescript
import { connect } from "./src/client.ts";

const browser = await connect();
const page = await browser.page("my-page");

// Navigate
await page.goto("https://example.com");

// Run JavaScript
const title = await page.evaluate("document.title");

// Screenshot
await page.screenshot({ path: "tmp/shot.png" });

// Click & type
await page.click("button.submit");
await page.type("input[name=email]", "test@example.com");

// Get accessibility tree
const snapshot = await page.snapshot();
```

## HTTP API

All endpoints return JSON. Base URL: `http://localhost:9222`

### Server Info
```bash
curl http://localhost:9222
# {"wsEndpoint":"ws://...","pages":["page1","page2"]}
```

### List Pages
```bash
curl http://localhost:9222/pages
# {"pages":[{"name":"my-page","url":"https://example.com"}]}
```

### Create/Get Page
```bash
curl -X POST http://localhost:9222/pages \
  -H "Content-Type: application/json" \
  -d '{"name":"my-page"}'
```

### Navigate
```bash
curl -X POST http://localhost:9222/pages/my-page/goto \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# {"url":"https://example.com","title":"Example Domain"}
```

### Evaluate JavaScript
```bash
curl -X POST http://localhost:9222/pages/my-page/evaluate \
  -H "Content-Type: application/json" \
  -d '{"script":"document.title"}'
# {"result":"Example Domain"}
```

### Screenshot
```bash
curl -X POST http://localhost:9222/pages/my-page/screenshot \
  -H "Content-Type: application/json" \
  -d '{"fullPage":true}'
# {"path":"tmp/my-page-1234567890.png"}
```

### Click Element
```bash
curl -X POST http://localhost:9222/pages/my-page/click \
  -H "Content-Type: application/json" \
  -d '{"selector":"button.submit"}'
```

### Type Text
```bash
curl -X POST http://localhost:9222/pages/my-page/type \
  -H "Content-Type: application/json" \
  -d '{"selector":"input[name=q]","text":"hello world"}'
```

### Get Page Content
```bash
curl http://localhost:9222/pages/my-page/content
# {"content":"<!DOCTYPE html>..."}
```

### Accessibility Snapshot
```bash
curl http://localhost:9222/pages/my-page/snapshot
# {"snapshot":{"role":"RootWebArea","name":"Example",...}}
```

### Close Page
```bash
curl -X DELETE http://localhost:9222/pages/my-page
```

## Workflow

1. Start server once (keep it running)
2. Create pages as needed - they persist
3. Navigate, interact, extract data
4. Take screenshots for visual feedback
5. Use accessibility snapshots to find elements

## Tips

- Use descriptive page names: `github-login`, `search-results`
- Pages persist - reuse them across scripts
- Accessibility snapshot shows interactive elements
- Screenshots go to `tmp/` by default
- `HEADLESS=true` for CI/server environments
