# Product Steering — Monster Money

## Vision
Money is scary. Monster Money makes budgeting feel like a game you can win:
every spending category is a monster with a health bar. Your monthly budget is
the monster's health. Every expense you log feeds the monster and drains its
health. Keep your monsters alive until the end of the month and you win.

## Who it is for
- Anyone who finds normal budget apps boring and quits them after a week.
- People who want to see, at a glance, which spending habit is eating them alive.
- First-time budgeters: no accounts, no bank links, no sign-up, no cost.

## Core principles
1. **Zero friction.** Open the page and start logging in under 10 seconds.
   No account, no server, no tracking. Data lives in the browser (localStorage).
2. **The monsters ARE the interface.** Health bars, not spreadsheets. The
   spooky design is the function, not decoration on top of it.
3. **Honest numbers.** Real totals, real projections, no fake "AI insights".
   A projected month-end overspend is shown plainly, in red, before it happens.
4. **Works offline.** A single static site. No build step, no backend, no
   external API. It must run identically from GitHub Pages or a local file.
5. **Private by design.** Nothing leaves the device except when the user
   explicitly exports a JSON backup.

## What it is NOT
- Not a bank-connected app. No Plaid, no credentials, no sync.
- Not a game with pay-to-win mechanics. No purchases of any kind.
- Not a financial advisor. It tracks and projects; it never recommends
  investments or debt products.

## Success for the hackathon
- A judge opens the live link, understands the idea in 10 seconds, logs an
  expense, watches a monster's health drop, and smiles.
- The demo video shows the full loop (set budget → log expense → monster
  reacts → projection updates) in under 3 minutes.
