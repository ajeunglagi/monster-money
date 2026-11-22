# Tech Steering — Monster Money

## Stack
- **Vanilla HTML + CSS + JavaScript, no framework, no build step.**
  Reason: the app must run as a static site (GitHub Pages) with zero deploy
  cost and zero backend. A framework would add weight and failure modes for
  no benefit at this scope.
- **No external runtime dependencies.** Charts are hand-drawn on `<canvas>`.
  The only external request is an optional Google Font (Creepster for display
  type) with a system-font fallback, so the app still works fully offline.
- **localStorage** for persistence, single key `monster-money-v1`, JSON.
  Export/import via JSON file download/upload chosen by the user.

## File layout
- `index.html` — structure and content (semantic HTML, accessible labels).
- `styles.css` — all styling; dark Halloween theme, CSS custom properties.
- `app.js` — all behaviour; one IIFE, no globals besides the app namespace.
- `.kiro/` — Kiro specs and steering (this project follows Kiro spec-driven
  development: requirements → design → tasks).

## Conventions
- All money is stored as numbers (major currency units, e.g. dollars).
  Formatting uses `Intl.NumberFormat` with the user's chosen currency.
- Dates are stored as ISO `YYYY-MM-DD` strings (local time).
- "This month" means the current local year-month. Expenses from other
  months are kept but excluded from the dashboard.
- Every user action that changes data calls `save()` then `render()`.
- No `eval`, no inline event handlers, no `innerHTML` with user data
  (use `textContent` / DOM APIs for user-supplied strings).

## Quality bar
- Must work on a phone viewport (360px) and desktop.
- Must work with JavaScript disabled? No — this is an interactive app; but
  the page must still show its title, purpose and a no-JS message.
- `node --check app.js` must pass; the page must load with no console errors.
