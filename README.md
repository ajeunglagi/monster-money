# Monster Money — Tame Your Money Monsters

🎃 **Kiroween 2026 · Costume Contest entry** 🎃

Money is scary. Monster Money makes budgeting feel like a game you can win:
every spending category is a monster with a health bar. Your monthly budget
is the monster's health. Every expense you log feeds the monster and drains
its health. Keep your monsters alive until the end of the month and you win.

## Try it

Open `index.html` in any browser, or visit the live app (GitHub Pages link
added after deploy). No account, no sign-up, no server, no cost.

## What it does

- **8 monsters, 8 budgets** — Rent Goblin, Food Fiend, Transport Troll,
  Bills Banshee, Fun Phantom, Shopping Specter, Health Haunt, Other Ooze.
  Each shows budget, spent, remaining, and a health bar (green → amber →
  red → SLAIN when over budget).
- **Feed a monster** — log an expense (amount, category, note, date) and
  every health bar, total, chart, and achievement updates instantly.
- **Honest projection** — daily average × days in the month, with a plain
  red warning when you are on pace to overspend your income.
- **Charts** — donut of spending by category, bars for the last 14 days
  (hand-drawn on canvas, no libraries).
- **Achievements** — First Bite, Monster Tamer, Ghost Buster, Penny Pumpkin,
  Budget Keeper — all computed from your real data, never faked.
- **Your data stays yours** — everything lives in the browser
  (localStorage). Export a JSON backup, import it later, reset the month.
  Nothing is uploaded anywhere.
- **Currencies** — USD, IDR, EUR, GBP.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step, no dependencies, no backend.

## How it was built (Kiro)

This project follows Kiro spec-driven development. The full spec lives in
`.kiro/` (do not delete it — the hackathon requires it at the repo root):

- `.kiro/steering/product.md` — product vision and principles
- `.kiro/steering/tech.md` — stack and conventions
- `.kiro/specs/monster-money/requirements.md` — requirements
- `.kiro/specs/monster-money/design.md` — architecture and data model
- `.kiro/specs/monster-money/tasks.md` — implementation checklist

Kiro CLI 3.5.0 was installed in the build environment; the Kiro agent
session used during development is described honestly in the Devpost
write-up (`SUBMISSION.md`): after Ajeng logged in with Google via device
flow (verified Builder ID, ajeunglagi@gmail.com), a genuine `kiro-cli`
agent session reviewed the app against its spec and fixed a real
accessibility bug (unique `aria-label`s on the expense delete buttons),
verified with `node --check` and the 12/12 DOM smoke test.

## License

MIT — see `LICENSE`.
