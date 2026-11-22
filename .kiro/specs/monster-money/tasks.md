# Tasks — Monster Money

Status: prototype milestone. Items marked [x] are done; [ ] remain for the
submission milestone.

## Prototype (this run)
- [x] Read Kiroween 2026 rules; confirm deadline (4 Dec 2026 2:00 PM PT /
      5 Dec 2026 05:00 WIB), Indonesia eligibility, Costume Contest brief.
- [x] Choose category: Costume Contest (flexible brief, UI polish is the
      differentiator, lowest scope risk of the four).
- [x] Install Kiro CLI 3.5.0 (`~/.local/bin/kiro-cli`); verify `--version`.
- [x] Write `.kiro/steering/product.md` and `.kiro/steering/tech.md`.
- [x] Write `.kiro/specs/monster-money/requirements.md` and `design.md`.
- [x] Build `index.html` — semantic structure for all sections.
- [x] Build `styles.css` — dark Halloween theme, responsive, animations.
- [x] Build `app.js` — state, monsters, expenses, charts, achievements,
      demo data, export/import, reset.
- [x] Add `README.md`, MIT `LICENSE`, `.gitignore` (must NOT ignore `.kiro`).
- [x] Validate: `node --check app.js`; serve locally and fetch page (200).
- [x] Smoke-test the core loop in the served page.

## Before submission (needs Ajeng / parent agent)
- [ ] Kiro login via device flow (`kiro-cli login --use-device-flow`) —
      Ajeng opens the URL on her phone and signs in with Google. This gives
      the project a real Kiro user ID (also needed for Devpost registration)
      and lets a genuine Kiro agent session contribute to the build, so the
      Kiro write-up is truthful. DO NOT claim Kiro generated code it did not.
- [ ] Kiro agent session: after login, run `kiro-cli` in the project and ask
      it to review the code and implement one real improvement; record what
      it did in the write-up.
- [ ] GitHub: create public repo `monster-money` on Ajeng's GitHub account,
      push this folder (must include `/.kiro` at root). Needs her account.
- [ ] Deploy the live app link: enable GitHub Pages on the repo (free).
- [ ] Demo video: record a <3 min screen recording of the app loop, upload
      as public on YouTube from Ajeng's account. Script is in `DEMO_SCRIPT.md`.
- [ ] Devpost submission: category Costume Contest, repo link, live app URL,
      video link, description + Kiro write-up (draft in `SUBMISSION.md`).
      Submit before 5 Dec 2026 05:00 WIB.
