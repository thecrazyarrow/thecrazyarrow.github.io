# Aaron Angel Netto: portfolio (V2)

**engineered by chaos** · *the crazy arrow*

A plain static website: HTML, CSS and vanilla JavaScript. No framework and no build step.
The old V1 site is kept in `_archive/v1/`. GitHub Pages doesn't publish folders whose names start with `_`.

---

## Preview it on your computer

The pages load text and 3D models with `fetch()`, which browsers block when you
just double-click a file. Use a tiny local server instead:

- **VS Code:** install the **Live Server** extension → right-click `index.html` → *Open with Live Server*.
- **With Node.js installed:** `npx serve .` then open the address it prints.

(Double-clicking still shows the site in English. The language switch, photos and 3D models need the server.)

---

## Where everything lives

| What | Where |
|---|---|
| All page text (English) | `assets/i18n/en.json` |
| Japanese / Arabic text | `assets/i18n/ja.json`, `assets/i18n/ar.json` |
| Colours, fonts, layout | `assets/css/site.css` (theme colours at the top) |
| Menu, footer, "Hire me" band | `assets/js/site.js` → `buildChrome()` (edit once, every page updates) |
| 3D viewer | `assets/js/viewer.js` (models in `models/`, see `models/README.txt`) |
| Photos | `zynx/` (home hero) and `assets/images/...` (each folder has a README.txt) |
| CV | `assets/resume/Aaron_Angel_Netto_CV.pdf` (keep the same file name) |
| Logo | `assets/logo/logo.svg` (shows automatically once it exists) |

**Editing text:** change the value in `en.json`, e.g.
`"home.now.1": "Learning Japanese"`. Keep the key (left side) the same.
If you change English, update the same key in `ja.json` and `ar.json` too
(anything missing there falls back to English). Run
`powershell -ExecutionPolicy Bypass -File tools\check-i18n.ps1` to list missing keys.

The English inside the HTML files is only a backup for when the JSON can't load.

**Link in a specific language:** add `?lang=ja` or `?lang=ar`, e.g. `about.html?lang=ja`.

---

## Adding photos

1. Drop the photos in the right folder (`assets/images/bikes/ava/01.jpg`, `02.jpg` ...).
   They're shown in file-name order. The home hero uses the **first** image in `zynx/`.
2. **After adding photos, run `node tools/build-media.js`.**
   It rewrites `assets/media.json`, the list the pages read.
   - No Node.js? Run `powershell -ExecutionPolicy Bypass -File tools\build-media.ps1` instead (same result, no .webp copies).
   - Want smaller, faster `.webp` copies? Run `npm install` once (installs `sharp`), then `node tools/build-media.js`.
3. Same for the logo and for videos in `assets/video/`: add the file, rerun the script.

Folders with no photos show a "Photo coming soon" placeholder.

**Videos:** `assets/video/robotic-arm.mp4` appears on the Projects page; files starting
with `guitar` (`guitar-01.mp4` ...) appear on the Guitar page. Keep clips under ~20 MB.

---

## The contact form (Formspree)

1. Sign up free at **formspree.io** and create a form. It gives you an ID like `xyzabcd`.
2. In `about.html`, replace `YOUR_FORM_ID` in
   `action="https://formspree.io/f/YOUR_FORM_ID"` with that ID.

Until you do, pressing **Send** opens the visitor's email app with the message filled in.

## The song "Twenty Three"

In `guitar.html`, paste the YouTube or Spotify link into `data-song-url=""`.
The player replaces "Coming soon" automatically.

## Performance numbers for the bikes (optional)

Fill in `"garage.ava.numbers"` and `"garage.toraa.numbers"` in `en.json`
(e.g. `"Dyno: 14.2 hp"`). Empty = hidden.

## Growth Log progress bars

The numbers (0–100) are `"growth.g1.value"` ... `"growth.g5.value"` in `en.json`.

---

## Publishing on GitHub Pages (free)

1. Create an account at **github.com** (if you don't have one).
2. Click **+ → New repository**. Name it e.g. `portfolio`, set it **Public**, and
   **don't** tick "Add a README". Click **Create repository**.
3. In the VS Code terminal, in this folder (the first commit is already made):
   ```
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```
   A browser window asks you to sign in to GitHub the first time.
4. On GitHub: repository → **Settings → Pages** → *Build and deployment* →
   Source **Deploy from a branch** → Branch **main**, folder **/ (root)** → **Save**.
5. After a minute or two the site is live at
   `https://YOUR-USERNAME.github.io/portfolio/`.
6. Replace `https://YOUR-SITE-URL/` with that address in every `.html` file,
   `robots.txt` and `sitemap.xml` (VS Code: **Ctrl+Shift+H**, find and replace in all files),
   then commit and push again:
   ```
   git add -A
   git commit -m "Set site URL"
   git push
   ```

**Updating later:** edit → `git add -A` → `git commit -m "what changed"` → `git push`.

### Custom domain (later)

1. Buy a domain (Namecheap, Cloudflare, etc.).
2. GitHub → Settings → Pages → **Custom domain** → enter e.g. `aaronnetto.com` → Save.
   (This creates a `CNAME` file in the repo. Pull it with `git pull`.)
3. At your domain provider, add DNS records:
   - four **A** records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - one **CNAME** record for `www` → `YOUR-USERNAME.github.io`
4. Back in Pages settings, tick **Enforce HTTPS** once it's available.
5. Replace the site URL in the HTML files, `robots.txt` and `sitemap.xml` again.

---

## Helper scripts (`tools/`)

| Script | What it does |
|---|---|
| `build-media.js` / `build-media.ps1` | Rebuilds `assets/media.json` after adding photos, videos or the logo |
| `check-i18n.ps1` | Lists text keys missing from the Japanese/Arabic files |
| `make-og-image.ps1` | Redraws `assets/og-image.png`, the preview image for shared links |
