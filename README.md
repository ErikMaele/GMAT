# GMAT Practice Optimizer V2

Local-first static website for Erik's TTP-first GMAT prep.

Open `index.html` in a browser. The app stores practice sessions, import batches, question attempts, and mistake cards in browser storage. Use **Data -> Export Backup** before moving devices or clearing browser data.

## GitHub Pages

This folder is ready for GitHub Pages. Publish the repository from the root folder and set Pages to deploy from the default branch root. The `.nojekyll` file is included so static assets are served directly.

## V2 workflow

1. Open the Today tab.
2. Do the exact TTP assignment shown.
3. Screenshot or copy the visible TTP result.
4. Use Import to parse and confirm the batch.
5. Fix due mistake cards before new work.

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

## Oxford theme assets

- `assets/radcliffe-square.jpg` - Radcliffe Square photo by Txllxt TxllxT, Wikimedia Commons, CC BY-SA 4.0.
- `assets/christ-church-meadow.jpg` - Christ Church Meadow photo by Ozeye, Wikimedia Commons, CC BY-SA 3.0 / GFDL.
- `assets/oscar-wilde.jpg` - Oscar Wilde portrait by Napoleon Sarony, Library of Congress / Wikimedia Commons, public domain.
