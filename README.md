# GMAT Practice Optimizer V6

Local-first static website for Erik's TTP-first GMAT prep. The product goal is simple: open the app, start the right block, stay inside official GMAT pacing constraints, then convert the debrief into repair cards with as little typing as possible.

Open `index.html` in a browser. The app stores practice sessions, guided blocks, import batches, question attempts, and mistake cards in browser storage. Use **Data -> Export Backup** before moving devices or clearing browser data.

## GitHub Pages

This folder is ready for GitHub Pages. Publish the repository from the root folder and set Pages to deploy from the default branch root. The `.nojekyll` file is included so static assets are served directly.

The live page uses Wikimedia image URLs for the Oxford hero and motivation images so the first page still renders even if the local `assets/` folder is not uploaded correctly.

## V6 Coach Workflow

1. Open the Today tab.
2. Click **Start Guided Block**.
3. Use the Coach tab while studying in TTP: it shows the exact module, question count, target accuracy, target seconds per question, and official-section protocol.
4. Use the timer and pacing ladder to avoid hidden overinvestment.
5. After the set, complete the one-minute debrief with dropdowns/chips instead of long typing.
6. The app logs the block, creates wrong/uncertain repair cards, and sends you to Fix.
7. Fix due cards before new volume, especially on Norvestor work nights.

## Research-Backed Product Logic

V6 combines GMAT-specific constraints with patterns from TTP, GMAT Club, UWorld, Magoosh, Anki-style spaced repetition, and active recall research:

- Practice cockpit: the app runs the study block instead of only logging it afterward.
- Memory coach: mistake cards get a retrievability estimate, so old errors are pulled forward before they decay.
- Risk-first repair queue: due cards are sorted by memory risk, misses, uncertainty, and overdue pressure.
- Official pacing protocol: Quant 21 q / 45 min, Verbal 23 q / 45 min, DI 20 q / 45 min.
- Section constraints: Quant and Verbal are no-calculator; DI allows the on-screen calculator.
- Review/edit discipline: the cockpit reminds Erik to reserve edits for high-uncertainty questions and never leave blanks.
- One-minute debrief: score, uncertainty, primary failure cause, and fix rule are captured immediately after the set.
- Auto repair creation: wrong and uncertain questions become review cards automatically.
- Active recall before scoring: repair cards hide the fix rule until Erik reveals it.
- Confidence-based review: Again / Hard / Good / Easy ratings replace binary pass/fail.
- Adaptive interleaving: daily TTP sets mix the highest-risk topics.
- Review debt priority: due repairs outrank new practice on work nights.
- Oxford blue interface: the main app now uses Oxford blue as the background system, with parchment panels and gold/sage/burgundy accents.
- Backup portability: exports/imports guided blocks as well as sessions and repair cards.

## Current Product Logic

- Baseline: 655 official attempt on 2025-12-31, split Q80 / V87 / DI81.
- Target: 735-745 with Q89 / V87 / DI89.
- Primary curriculum: TTP.
- Main weak levers: Algebra word problems, Value / Order / Factors, Rates / Ratios / Percent, Graphs and Tables.
- Review cadence: next day, 3 days, 7 days, 14 days, 30 days.
- Weeknight mode after 2026-05-04 prioritizes due mistake repair before new volume.
- Verbal stays maintenance-only unless mock data shows a real drop.

## Bridge Stance

The import flow uses screenshots or pasted visible text. It does not automate login, scrape hidden account data, or use GitHub as a live study database.

OCR loads Tesseract.js only when you click **Run OCR**. If it is unavailable, paste the visible result text into the fallback box.

## Mistake Repair

The Fix tab shows one card at a time. First attempt the redo, then reveal the fix rule. **Again** keeps the card due, **Hard** repeats it tomorrow, **Good** advances the normal interval, and **Easy** skips ahead faster. Imported batches can be deleted from Import history, which also removes the generated review cards from that import.

## Oxford Theme Assets

- `assets/radcliffe-square.jpg` - Radcliffe Square photo by Txllxt TxllxT, Wikimedia Commons, CC BY-SA 4.0.
- `assets/christ-church-meadow.jpg` - Christ Church Meadow photo by Ozeye, Wikimedia Commons, CC BY-SA 3.0 / GFDL.
- `assets/oscar-wilde.jpg` - Oscar Wilde portrait by Napoleon Sarony, Library of Congress / Wikimedia Commons, public domain.
