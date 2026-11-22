# Devpost submission draft — Monster Money (Kiroween 2026, Costume Contest)

> DRAFT — do not submit yet. Fill in the repo URL, live app URL, and video
> URL after the GitHub and YouTube steps are done.

## Category
Costume Contest

## Tagline
Tame your money monsters — a Halloween budget tracker where every spending
category is a monster with a health bar.

## Description (plain language)
Money is scary, and most budget apps are boring enough that people quit
them after a week. Monster Money turns budgeting into a game you can win:
each spending category is a monster — Rent Goblin, Food Fiend, Fun Phantom,
and five more. Your monthly budget is the monster's health. Every expense
you log feeds the monster and drains its health. Keep all eight monsters
alive until the end of the month and you win.

It is a complete working app: set income and budgets in USD, IDR, EUR, or
GBP; log expenses; watch health bars, totals, a spending donut, and a
14-day bar chart update instantly; earn achievements computed from your
real data; and get an honest month-end projection with a plain warning when
you are on pace to overspend. There is no account, no bank link, no
tracking, and no cost — all data lives in your browser, with JSON
export/import for backups.

## How we used Kiro (HONEST — verified 22 Nov 2026)
- Kiro CLI 3.5.0 installed in the build environment
  (`curl -fsSL https://cli.kiro.dev/install | bash`).
- The project was structured as a Kiro spec-driven project: steering files
  (`.kiro/steering/product.md`, `.kiro/steering/tech.md`) and a full spec
  (`.kiro/specs/monster-money/requirements.md`, `design.md`, `tasks.md`).
- [x] Kiro login completed via device flow on 22 Nov 2026 (Ajeng signed in
      with Google on her phone). Verified with `kiro-cli whoami`: "Logged in
      with Builder ID", email ajeunglagi@gmail.com.
- [x] Genuine Kiro agent session after login: `kiro-cli chat
      --no-interactive` in the project dir (session
      `sess_74a654e2-d739-4dea-a9bb-b8e7fe43ed1d`, "Review Monster Money
      Against Spec", v3 engine). It read all three source files and the
      full spec, found a real accessibility bug — every delete button in
      the expense list had the identical `aria-label="Delete expense"`, so
      a screen-reader user could not tell which expense a button would
      remove — and fixed it in `app.js` (`renderList()`): each button now
      gets a unique label built from that expense, e.g. "Delete expense:
      Groceries, $42.50, 2026-11-20" (note, or category name as fallback).
      Verified with `node --check app.js` and the 12/12 headless DOM smoke
      test, then committed (`8dba1b0`).
- NOTE on the Kiro user ID: the CLI's local auth state holds only an
  opaque AWS SSO token — it does not expose a Kiro user ID string, and
  `kiro-cli profile` is Pro-only. The user ID is shown on the Kiro web
  dashboard (app.kiro.dev, account/settings after signing in with Google)
  and is needed ONLY for the optional 4,000-credit request form
  (deadline 1 Dec 2026 12:00 PM PT); it is not required for the Devpost
  submission itself. Read it from the dashboard before 1 Dec if credits
  are wanted.

## Links (fill in)
- Public GitHub repo (must contain `/.kiro` at root): ____
- Live app URL (GitHub Pages): ____
- Demo video, public YouTube, under 3 min: ____

## Checklist before submitting
- [ ] Repo is public, has MIT license visible, `.kiro/` at root and NOT in `.gitignore`
- [ ] Live app link opens and the full loop works (set budget → log expense → health drops)
- [ ] Video is Public on YouTube and under 3 minutes
- [ ] Submitted before 5 Dec 2026 05:00 WIB (4 Dec 2026 2:00 PM PT)
