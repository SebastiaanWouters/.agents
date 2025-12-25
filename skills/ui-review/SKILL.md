---
name: ui-review
description: Review local code changes for UI/UX issues, styling problems, and frontend bugs. Use when asked to review recent changes, check UI quality, or identify frontend improvements. Surfaces visual regressions, UX anti-patterns, accessibility issues, and styling inconsistencies.
---

# UI/UX Review Skill

Review recent local changes for frontend issues: suboptimal UI/UX, styling bugs, visual regressions, and improvement opportunities. Applies the frontend-design skill's quality standards as the benchmark.

## When to Use

- User asks to review recent changes for UI issues
- Before committing frontend changes
- After implementing a new component/feature
- When debugging visual/layout problems
- Periodic frontend quality checks

## Review Process

### 1. Gather Changed Files

```bash
# staged + unstaged changes
git diff --name-only HEAD

# or specific commit range
git diff --name-only main..HEAD

# only frontend files
git diff --name-only HEAD | grep -E '\.(tsx?|jsx?|css|scss|html|vue|svelte)$'
```

### 2. Analyze Changes

For each changed frontend file, review against these criteria:

#### Typography Issues
- [ ] Generic fonts (Inter, Roboto, Arial, system fonts)
- [ ] Poor font pairing
- [ ] Inconsistent font sizes/weights
- [ ] Bad line-height/letter-spacing

#### Color & Theme Issues
- [ ] Inconsistent color usage (no CSS variables)
- [ ] Poor contrast (accessibility)
- [ ] Generic palettes (purple gradients on white)
- [ ] Muddy or timid color choices

#### Layout Issues
- [ ] Predictable/cookie-cutter layouts
- [ ] Poor spacing consistency
- [ ] Broken responsive behavior
- [ ] Alignment problems
- [ ] Z-index conflicts

#### Animation Issues
- [ ] Missing micro-interactions where expected
- [ ] Janky or stuttering animations
- [ ] No loading states
- [ ] Abrupt state changes

#### UX Anti-Patterns
- [ ] No feedback on user actions
- [ ] Confusing navigation
- [ ] Hidden interactive elements
- [ ] Poor error states
- [ ] Missing empty states

#### Accessibility Issues
- [ ] Missing alt text
- [ ] Poor focus indicators
- [ ] No keyboard navigation
- [ ] Color-only information
- [ ] Missing ARIA labels

### 3. Visual Verification (optional)

If dev-browser is available and app is running locally, capture visual evidence:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("ui-review");
await page.setViewportSize({ width: 1280, height: 800 });

await page.goto("http://localhost:3000"); // adjust URL
await waitForPageLoad(page);

// capture current state
await page.screenshot({ path: "tmp/review-desktop.png" });

// mobile viewport
await page.setViewportSize({ width: 375, height: 667 });
await page.screenshot({ path: "tmp/review-mobile.png" });

await client.disconnect();
EOF
```

### 4. Output Format

Structure findings as:

```
## UI/UX Review: [scope]

### Critical Issues
Issues that break functionality or severely harm UX.

### Styling Problems
Visual inconsistencies, poor aesthetics, design debt.

### Accessibility Gaps
Missing a11y features that exclude users.

### Improvement Opportunities
Not broken, but could be better.

### Positive Changes
What's working well (brief).
```

## Quality Standards (from frontend-design)

Apply these as the benchmark:

**Typography**: Distinctive, characterful fonts. No generic choices.

**Color**: Cohesive, intentional palette with CSS variables. Dominant colors with sharp accents.

**Motion**: Purposeful animations at high-impact moments. CSS-first, libraries for complex.

**Layout**: Unexpected, interesting compositions. Intentional asymmetry or structure.

**Backgrounds**: Atmosphere and depth. Gradients, textures, patterns where appropriate.

**Overall**: Production-grade, visually striking, memorable. Clear aesthetic POV.

## Example Review

```
## UI/UX Review: LoginForm component

### Critical Issues
- Form submits on Enter but no loading state - user double-clicks
- Error messages not announced to screen readers

### Styling Problems
- Using system font stack instead of project's design tokens
- Button hover state uses opacity instead of color transition
- Input focus ring is browser default, not styled

### Accessibility Gaps
- Password field missing autocomplete="current-password"
- No visible focus indicator on "Forgot password" link
- Form errors only communicated via color

### Improvement Opportunities
- Add subtle entrance animation for form elements
- Consider adding password visibility toggle
- Error shake animation would improve feedback

### Positive Changes
- Good use of CSS grid for responsive layout
- Proper label associations with inputs
```

## Integration with Other Skills

- **frontend-design**: Use as quality benchmark and for fixes
- **dev-browser**: Visual verification and screenshot comparison
- **btca**: Query framework-specific best practices
