---
name: dev-browser
description: Browser automation with persistent pages. Triggers on "go to [url]", "click", "fill form", "screenshot", "scrape", "test website". Pages survive disconnections.
---

# Dev Browser

Persistent browser automation via HTTP. Start server once, pages persist.

## Setup

```bash
cd skills/dev-browser && bun run start  # or HEADLESS=true bun run start
```

Wait for "Ready!" then use API.

## HTTP API (localhost:9222)

```bash
# navigate
curl -X POST http://localhost:9222/pages/my-page/goto \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# evaluate JS
curl -X POST http://localhost:9222/pages/my-page/evaluate \
  -d '{"script":"document.title"}'

# screenshot
curl -X POST http://localhost:9222/pages/my-page/screenshot \
  -d '{"fullPage":true}'

# click
curl -X POST http://localhost:9222/pages/my-page/click \
  -d '{"selector":"button.submit"}'

# type
curl -X POST http://localhost:9222/pages/my-page/type \
  -d '{"selector":"input[name=q]","text":"hello"}'

# accessibility snapshot
curl http://localhost:9222/pages/my-page/snapshot

# close
curl -X DELETE http://localhost:9222/pages/my-page
```

## TypeScript Client

```typescript
import { connect } from "./src/client.ts";
const browser = await connect();
const page = await browser.page("my-page");

await page.goto("https://example.com");
const title = await page.evaluate("document.title");
await page.screenshot({ path: "tmp/shot.png" });
await page.click("button.submit");
```

## Tips

- Use descriptive page names: `github-login`, `search-results`
- Pages persist - reuse across scripts
- Screenshots go to `tmp/`
