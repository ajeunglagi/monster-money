# Design — Monster Money

## Architecture
Single-page static app. Three files, no build step, no server:
- `index.html` — semantic structure: header (title + month), stats strip,
  monster grid, add-expense form, charts, achievements, recent expenses,
  settings, data tools, footer.
- `styles.css` — theme via CSS custom properties; responsive grid; keyframe
  ghost float; health-bar colour states.
- `app.js` — one IIFE. State → `save()` → `render()` cycle.

## Data model (localStorage key `monster-money-v1`)
```json
{
  "income": 2500,
  "currency": "USD",
  "budgets": { "rent": 800, "food": 300, "transport": 120, "bills": 150,
               "fun": 80, "shopping": 100, "health": 60, "other": 50 },
  "expenses": [
    { "id": "m1a2b3", "amount": 42.5, "cat": "food",
      "note": "Groceries", "date": "2026-11-20" }
  ]
}
```

## Categories (monsters)
| id | name | emoji | colour |
|----|------|-------|--------|
| rent | Rent Goblin | 🏠 | #a78bfa |
| food | Food Fiend | 🍔 | #fb923c |
| transport | Transport Troll | 🚗 | #38bdf8 |
| bills | Bills Banshee | 💡 | #facc15 |
| fun | Fun Phantom | 🎮 | #f472b6 |
| shopping | Shopping Specter | 🛍️ | #4ade80 |
| health | Health Haunt | 💊 | #f87171 |
| other | Other Ooze | 👻 | #94a3b8 |

## Key computations
- `spentByCat(month)` — sum of expenses per category for the month.
- `health(cat)` — `(budget - spent) / budget`, clamped to [0, 1]; slain if <= 0.
- `projection` — `dailyAverage * daysInMonth`; daily average uses days
  elapsed in the month (min 1). Warns when projection > income.
- `dailyAllowance` — `income / daysInMonth`, used by the Ghost Buster streak.
- Charts drawn on `<canvas>` with `devicePixelRatio` scaling; donut by
  category share, bars for the last 14 days.

## Error handling
- Invalid expense input → inline error text, no state change.
- Corrupt localStorage JSON → fall back to defaults, keep the app running.
- Bad import file → error message, existing data untouched.
- Missing canvas context → charts section shows a text fallback.

## Testing
- `node --check app.js` for syntax.
- Serve locally (`python3 -m http.server`) and fetch the page; confirm
  HTTP 200 and no missing local assets.
- Manual smoke test of the loop: set budget → add expense → health drops →
  projection updates → delete expense → health recovers.
