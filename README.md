# GMAT Practice Optimizer V3

Local-first static website for Erik's TTP-first GMAT prep.

Open `index.html` in a browser. The app stores practice sessions, import batches, question attempts, and mistake cards in browser storage. Use **Data -> Export Backup** before moving devices or clearing browser data.

## GitHub Pages

This folder is ready for GitHub Pages. Publish the repository from the root folder and set Pages to deploy from the default branch root. The `.nojekyll` file is included so static assets are served directly.

The live page uses Wikimedia image URLs for the Oxford hero and motivation images so the first page still renders even if the local `assets/` folder is not uploaded correctly.

## V3 workflow

1. Open the Today tab.
2. Clear the repair queue up to the daily cap.
3. Do the adaptive TTP mix shown.
4. Screenshot or copy the visible TTP result.
5. Use Import to parse and confirm the batch.
6. Fix due mistake cards before new work.
7. Use the Schedule tab to see the current fluid plan, weekend emphasis, and mock checkpoints.

## Research-backed upgrades

V3 implements ten patterns from high-performing learning products and learning science:

- Active recall before scoring: repair cards hide the fix rule until Erik reveals it.
- Confidence-based review: cards use Again / Hard / Good / Easy ratings instead of a binary pass/fail.
- Spaced repetition with lapses: misses reset the card and keep it due.
- Daily review caps: weeknights prevent the repair queue from swallowing all study time.
- Leech detection: repeat offenders are flagged for concept rebuilding.
- Adaptive interleaving: daily TTP sets mix the highest-risk topics instead of drilling only one lane.
- Mastery thresholds: topics show Build, Calibrate, Repair, Unseen, or Mastery.
- Score band: readiness turns into a conservative current-score range.
- Streak and exam countdown: momentum is visible without turning the app into a toy.
- One-click import prefill: Today's TTP assignment can populate the import form before the set.

## Current product logic

- Baseline: 655 official attempt on 2025-12-31, split Q80 / V87 / DI81.
- Target: 735-745 with Q89 / V87 / DI89.
- Primary curriculum: TTP.
- Main weak levers: Algebra word problems, Value / Order / Factors, Rates / Ratios / Percent, Graphs and Tables.
- Review cadence: next day, 3 days, 7 days, 14 days, 30 days.
- Weeknight mode after 2026-05-04 prioritizes due mistake repair before new volume.
- Verbal stays maintenance-only unless mock data shows a real drop.

## Bridge stance

The import flow uses screenshots or pasted visible text. It does not automate login, scrape hidden account data, or use GitHub as a live study database.

OCR loads Tesseract.js only when you click **Run OCR**. If it is unavailable, paste the visible result text into the fallback box.

## Mistake repair

The Fix tab shows one card at a time. First attempt the redo, then reveal the fix rule. **Again** keeps the card due, **Hard** repeats it tomorrow, **Good** advances the normal interval, and **Easy** skips ahead faster. Imported batches can be deleted from Import history, which also removes the generated review cards from that import.

## Oxford theme assets

- `assets/radcliffe-square.jpg` - Radcliffe Square photo by Txllxt TxllxT, Wikimedia Commons, CC BY-SA 4.0.
- `assets/christ-church-meadow.jpg` - Christ Church Meadow photo by Ozeye, Wikimedia Commons, CC BY-SA 3.0 / GFDL.
- `assets/oscar-wilde.jpg` - Oscar Wilde portrait by Napoleon Sarony, Library of Congress / Wikimedia Commons, public domain.
