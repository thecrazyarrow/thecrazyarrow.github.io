# SADHANAM: Build prompt for Aaron's portfolio website

> **How to use:** open this folder (`portfolio`) in VS Code, start Claude Code in the terminal, and paste:
> `Read SADHANAM.md in this folder and build the whole website exactly as it describes. Ask me before deleting anything.`

---

## 0. Ground rules for Claude Code

- Work **inside this folder only**. It is a plain static site: **HTML, CSS and vanilla JavaScript**. No frameworks, no build step required to view it (opening `index.html` or running `npx serve` must work).
- This folder already contains a **V1 site** (`index.html`, `prints.html`, `prints.js`, `videos.html`, `style.css`, `script.js`, `models/`). **Do not delete it.** Move the old HTML/CSS/JS files into `_archive/v1/` first, then build V2. Keep the `models/` folder where it is and **reuse `prints.js`** (the three.js STL/3MF/OBJ/GLB viewer) for the 3D page. Read the V1 files first and reuse any useful text or code.
- Folders for photos already exist, each with a `README.txt` saying what goes there. Most are **empty right now**. Every image slot must show a tasteful placeholder (dark card, thin gold outline, small icon, label like "Photo coming soon") when its folder has no images, so the site looks finished even before photos are added.
- Write a small Node script `tools/build-media.js` that scans every folder under `zynx/` and `assets/images/` and writes `assets/media.json` (a list of image paths per folder, sorted by file name). Pages read `media.json` to fill galleries. Add a note in `README.md`: *"After adding photos, run `node tools/build-media.js`."* Also generate compressed `.webp` copies with `sharp` if it installs cleanly; if not, skip it without failing.
- Keep the code **readable and commented**, like V1, because Aaron is learning web development from this project.
- Fully **responsive** (mobile first), accessible (alt text, focus states, contrast, `prefers-reduced-motion`), and fast (lazy-loaded images, no heavy libraries except three.js on the 3D page).
- Never show a phone number anywhere. Never list AutoCAD.

---

## 1. Who the site is for

**Aaron Angel Netto**, BTech Electronics & Communication Engineering (College of Engineering Perumon, Kerala, under APJ Abdul Kalam Technological University, 2021–2025; coursework completed, final certification pending). Based in **Kuwait**, **open to opportunities in Japan** (Japan only, never mention China). Personal brand: **"engineered by chaos"**, nickname **"the crazy arrow"**.

The site must read as an **engineer's portfolio first**, while showing he is a versatile, hands-on person who can handle anything thrown at him, including rough industrial work.

- Email (show it): **aaronnetto78@gmail.com**
- LinkedIn: **linkedin.com/in/aaron-angel-netto-86199b244**
- Phone: **do not show**

---

## 2. Look and feel

- **Gold and black** is the leading theme. Deep black / near-black backgrounds (`#0b0a08`, card `#16130e`), **warm soft gold** accents (`#d4a84b`, lighter `#e8c87a`), warm off-white text (`#f3ead7`), muted text (`#a8987a`), gold-brown hairlines (`#4a3c20`).
- The feel is **creative and welcoming, not cold or industrial**: rounded cards (12–16px), generous spacing, smooth gentle animations, friendly expressive typography. Suggested fonts: a characterful display font for headings (e.g. *Sora*, *Outfit* or *Space Grotesk*) plus a clean body font. Pick what looks best.
- **The Industrial page alone** may look grittier (darker textures, sparks, workshop feel) but stays inside the same gold-and-black system.
- **Hover-lift cards everywhere:** on hover/focus, cards rise (`translateY(-6px)`), the border turns gold and a soft gold glow appears. On touch devices, tapping gives the same feedback.
- Subtle fade/slide-in on scroll (IntersectionObserver), disabled under `prefers-reduced-motion`.
- **Logo:** `assets/logo/logo.svg` (Aaron will export it from Fusion: "engineered by chaos" with the "o" in chaos drawn as a motorcycle wheel, and "the crazy arrow" in small letters). Until the file exists, show a text logo: **engineered by chaos** with *the crazy arrow* underneath in small gold letters. Use the logo in the nav, the footer and as the favicon (fall back to a generated simple gold "A" SVG favicon).

---

## 3. Site-wide elements

- **Nav bar** (slim, black, gold links, collapses to a menu on mobile): Home · Projects · 3D & Manufacturing · Industrial · Garage · Guitar · Versatility · Growth Log · About, plus a gold **"Hire me"** button and the **language switch**.
- **Language switch: EN / 日本語 / عربي.** Put all text in `assets/i18n/en.json`, `ja.json`, `ar.json` and swap it with JS (remember the choice in `localStorage`, wrapped in try/catch). For Arabic set `dir="rtl"` and `lang="ar"` on `<html>` and make sure layouts mirror correctly (nav, text alignment, card order, timelines). Write natural, professional Japanese and Arabic translations. Add a visible comment at the top of `ja.json` and `ar.json`: `"_note": "Machine-written. Aaron will check these before publishing."`
- **"Hire me"** button in the nav and a **"Hire me / Let's build something"** call-to-action at the bottom of every page. It goes to the contact section on the About page.
- **Download CV** buttons (Home hero and About) link to `assets/resume/Aaron_Angel_Netto_CV.pdf` (already in place) with the `download` attribute.
- **Contact section** (on About): email link, LinkedIn link, and a simple contact form using **Formspree** (`action="https://formspree.io/f/YOUR_FORM_ID"`, leave the placeholder and explain in README how to get an ID). If the form isn't set up, it falls back to opening an email.
- **Footer** on every page: logo, email, LinkedIn, "Open to engineering roles in Japan" with the Japanese line **日本でのエンジニア職を探しています**, © year.
- **SEO and sharing:** proper `<title>` and meta description per page, Open Graph/Twitter tags, a generated `assets/og-image.png` (1200×630, gold-on-black name card, created by a script or SVG), `robots.txt`, `sitemap.xml`, and a custom **`404.html`** in the same style (e.g. "This part got lost in the print queue", with a link home).

---

## 4. Pages and content

### 4.1 Home (`index.html`)
- **Hero:** the photo of Aaron grinding metal, taken from the **first image in `zynx/`**. It must **blend in seamlessly**: no hard edges, faded into the black page with a CSS `mask-image` (radial plus side/bottom linear fade) so it looks like part of the background. On desktop the photo sits on the right with text on the left; on mobile it sits behind the text, darker, with the text over the faded part. Optional: a few slow drifting gold "spark" particles (canvas, very light, off with reduced motion).
- Hero text: small line *"Kuwait · Open to opportunities in Japan"* (gold badge), big name **Aaron Angel Netto**, tagline **"Engineer · Maker · Creator"**, and the brand mark *engineered by chaos*. Buttons: **Download CV** (filled gold) and **See my work** (gold outline).
- **Section cards** (hover-lift, each linking to its page, each with an icon and a one-line teaser):
  - Custom Projects: "Built a 3D printer for cement"
  - 3D & Manufacturing: "Bringing discontinued parts back"
  - Industrial: "Engines, lathes, ECUs. Bring it on."
  - The Garage, Ava & Toraa: "97cc to 135cc, and more"
  - Guitar Era: "First song 'Twenty Three', coming soon"
  - Versatility: "Drop me into any role"
  - Growth Log: "What I'm working on"
- **Skills strip** (chips): Autodesk Fusion · FreeCAD · FEA · Arduino · BigTreeTech · Marlin · PlatformIO · Python · MediaPipe · YOLOv8 · FDM printing · Acetone vapour smoothing · Lathe / CNC · Engine building · SMD repair · DaVinci Resolve · CapCut
- **"Currently" strip:** *Learning Japanese · Writing "Twenty Three" · Designing a 3D-printed guitar* (easy to edit in the i18n file).
- A short **experience timeline** (gold line with dots): 2021 started BTech at CEP → 2025 founded his 3D printing business → big bore kit development → video work (Royal Enfield franchise, Supreme Food Co., QStudios internship) → Aug 2026 closed the print business → now: warehouse operations in Kuwait, building toward Japan.

### 4.2 Custom Projects (`projects.html`)
Each project is a large hover-lift panel; clicking opens a detailed section with a **Problem → Process → Result** structure, photo gallery from its folder and a tech-stack badge row.

1. **★ Featured, full width: Custom Cement 3D Printer** (`assets/images/projects/cement-printer/`)
   - Major college engineering project: designed and built a cement-based 3D printer **from scratch** covering the mechanical structure, motion, electronics and extrusion.
   - BigTreeTech controller, stepper motors and drivers, **custom auger-based extrusion**, **peristaltic pump** material delivery, Marlin firmware, designed in FreeCAD.
   - Challenges: cement behaves nothing like thermoplastic. Material consistency, flow rate, extrusion pressure, nozzle geometry and layer deposition all had to be solved; motion and material flow had to work as one system. Solved through repeated build-test-fix cycles.
   - Gold timeline: Concept → Mechanical design → Electronics → Fabrication → Assembly → Control → Testing → Iteration.
   - Big italic quote: *"I didn't just use a 3D printer. I built one for a material it was never designed to print."*
2. **Universal Mouldable Splint** (`.../splint/`)
   - A flat-bed-printable splint printed flat on a standard printer, then **heat-formed with hot water** to fit the patient's limb. Lighter and less bulky than a cast, with adaptable geometry instead of one-size-fits-all, designed for low-cost local fabrication.
   - The idea came from a hospital visit. Explored in collaboration with **Athira Hospital, Chavara, Kollam**.
   - Small visible note: *"A product-development concept, not a clinically validated medical device."*
3. **3D-Printed Electric Guitar**, badge **"In design"** (`.../guitar/`)
   - Original sci-fi, asymmetric, angular design in Autodesk Fusion.
   - 20 × 40 mm aluminium T-slot extrusion backbone running from the body into the neck; body with hexagonal through-holes; two humbuckers; 22 frets; 25.5" scale; fixed bridge; volume/tone and 3-way selector.
   - Split into bolt-together modules that fit a 220 × 220 × 250 mm print bed.
   - Embed the existing interactive 3D viewer showing `models/GUITAR BODY.stl` (reuse `prints.js`).
4. **Gesture-Controlled Robotic Arm** (`.../robotic-arm/`, demo video `assets/video/robotic-arm.mp4` if present)
   - Built single-handedly. A robotic arm controlled by hand gestures through computer vision: **MediaPipe + YOLOv8**, **21-point hand tracking**, Arduino motor control, real-time response.

(Do **not** include the voice AI assistant.)

### 4.3 3D Modelling & Manufacturing (`manufacturing.html`)
- **The 3D printing business (2025 – August 2026)**: told as a completed chapter. Aaron spotted that vehicle owners and machinery users couldn't find replacement parts that were discontinued or unavailable, so he founded an independent FDM 3D printing business serving clients **in India and internationally**:
  - Designed custom and replacement parts in Fusion for **motorcycles, cars and obsolete machinery**
  - Reverse-engineered discontinued components where no drawings existed
  - Full cycle: Customer requirement → Measurement → CAD → Prototype → Testing → Refinement → Final part (show as a gold step flow)
  - Handled quotes, sourcing, production, quality checks and shipping
  - Quote: *"I learned how to identify a real market problem, develop a solution and deliver it to a real customer."*
- **Rapid prototyping with ABS**, print tuning per material and geometry, design for strength and manufacturability.
- **Acetone vapour smoothing:** text only (no photos exist): *"Every order shipped with a free acetone vapour-smoothed figurine, a small signature touch."*
- **Self-taught CAD & FEA:** learned Fusion from scratch; FreeCAD FEA for loads, constraints, stress distribution and deformation, used as a design-iteration tool. Quote: *"I don't wait until I know everything before starting a project. I learn what I need, apply it, test it and improve."*
- **Interactive model library:** move the V1 three.js viewers here: `models/splendor rally visor.stl` (Splendor Rally Visor), `models/3d forge monster can.stl` (Monster can holder), plus the guitar body. Keep `models/README.txt` instructions working.
- Photo gallery from `assets/images/manufacturing/`.
- **"What's next" panel:** *"Building a 3D print farm in India for motorcycle parts."*

### 4.4 Industrial / Fabrication (`industrial.html`)
Grittier variant of the theme. Message: *nothing is too rough.* Gallery from `assets/images/industrial/`.
- **Engine building:** full strip-downs and rebuilds, overhauls, head swaps, boring and sleeving, head machining, valve work, thread repair and bolt-hole chasing, custom clutch cables, Suzuki Swift gearbox work, everything checked against manufacturer tolerances.
- **Precision machining, big bore kit development:** assisted in developing big bore cylinder components including for the Royal Enfield Hunter 350; lathe and CNC to tight tolerances; measurement, fitting, inspection, iterative refinement; coordinated machine shops and inspected their parts. Flow: Concept → Measurements → CAD → Machining → Inspection → Fitting → Refinement. Quote: *"Digital design only becomes engineering when the physical component has to fit, function and survive in the real world."*
- **Component-level electronics repair:** SMD-level fault finding on water-damaged ECUs, circuit tracing, diode/resistor testing, restoring boards instead of replacing them.
- **Repair log** (small cards, reuse V1 text if present): water-damaged Insta360 One RS (disassembled, PCB cleaned, multimeter fault isolation); Samsung S21 Ultra display fault isolated to the panel; LED fog lights wired into a rally tower with a relay; 6V horn voltage drop traced on the Splendor.

### 4.5 The Garage: Ava & Toraa (`garage.html`)
A split layout: **Ava** on one side, **Toraa** on the other (stacked on mobile). Each bike has a photo gallery from its folder and **hover cards per mod group**.

**AVA: Hero Splendor (stock 97cc → 135cc)** (`assets/images/bikes/ava/`)
- **Engine:** 135cc big bore kit (from stock 97cc) · ported and polished head with bigger valves · air-cooled to oil-cooled conversion
- **Intake:** custom airbox · variable velocity stacks at the throttle body for top-end power · an **EDF (electric ducted fan)** force-feeding the airbox above 4000 rpm
- **Motocross conversion** (card tagline *"Built to leave the tarmac"*): front raised with a taller machined fork end nut · rear raised with TVS Phoenix shocks · dual-sport tyres: **Michelin Anakee Cross 80/100-18** front, **CEAT Gripp X5 100/90-18** rear
- **Front end & body:** headlight delete with a custom 3D-printed headlight mount · 3D-printed number plate
- **Electrical:** full wiring redone

**TORAA: Royal Enfield Hunter 350** (`assets/images/bikes/toraa/`)
- **Engine:** 410cc big bore conversion attempt, told honestly: *"Went for 410cc. The engine took it; the stock ECU didn't."* · Hitchcocks high-lift cam · slipper clutch conversion
- **Intake:** Schorl high-flow air filter kit · 3D-printed high-flow intake cover
- **Ergonomics & comfort:** Art of Motorcycle scrambler handlebar conversion · Royal Enfield custom seat · Pulsar 220 rear shocks for comfort
- **Tyres:** Apollo Tramplr ST dual-sport rear · front still stock (upgrade planned)
- **Just for fun:** 3D-printed Monster can holder on the handlebars

Leave an obvious, easy-to-fill spot (in the i18n files) for optional performance numbers later.

### 4.6 Guitar Era: Singer-Songwriter (`guitar.html`)
Softer, warmer variant of the theme. Gallery from `assets/images/music/`.
- The guitar: **Yamaha C40**.
- The journey: **self-taught in 1.8 years**, shown as a short gold timeline from first chords to writing his own songs.
- **First song: "Twenty Three". Coming soon.** A highlighted panel with the title and a "Coming soon" badge. Build it so a Spotify/YouTube embed can be dropped in later by pasting a link in one place.
- Optional slot for playing clips from `assets/video/`.
- (The 3D-printed guitar is **not** on this page; it lives on Projects.)

### 4.7 Versatility (`versatility.html`)
Message: *"Drop me into any role and I'll make it work."* Clean hover cards:
- **Warehouse operations & inventory (Kuwait, current):** generates pick lists; processes material requisitions and location transfers in/out in the **Orion** inventory system; checks item, branch and storage-location details; keeps stock records accurate and traceable.
- **Procurement:** supplier identification and vetting, quote comparison, negotiation, purchase orders; sourcing filament, hardware, motors, controllers and pumps; lead-time and stock management; client quotations; re-sourcing obsolete parts through reverse engineering; coordinating machine shops and inspecting incoming parts.
- **IT support & hardware:** PC builds and upgrades (motherboard, CPU, RAM, storage, PSU); Windows installation and migration; Ubuntu and Linux Mint; boot-failure and hardware fault isolation; malware removal; system optimisation; helping non-technical users.
- **Office & admin:** Microsoft Word, Excel, PowerPoint; data entry, records and reporting; customer and vendor communication; order tracking from enquiry to dispatch.
- **Video & content (move the V1 `videos.html` content here):** Royal Enfield franchise promotional ad (scripting, filming, editing, post-production); **Lead Videographer, Supreme Food Co., Kollam** (5 trend-driven promo videos); **2-week video-editing internship at QStudios, Kuwait**; freelance edits. Tools: DaVinci Resolve, CapCut. Quote: *"My role wasn't simply to operate a camera, it was to turn an idea into content people would actually want to watch."* Keep the V1 video embeds that already have real links.
- **Leadership:** Founder & President of the **Anime Club** at College of Engineering Perumon for 4 years.
- **Workshops & training:** EV workshop (NIT Calicut); BIS workshop on ISI-certified helmet testing; IEEE SB CE-Perumon bug bounty & cybersecurity workshop; 7-day Flutter internship, Revertech IT Solutions (May 2023).

### 4.8 Growth Log (`growth.html`)
Quieter variant of the theme. Intro: an honest page about what Aaron is still building, written confidently. These are things he's actively fixing, not apologies.

**Gap cards** (each card: *The gap* / *Why it matters* / *The plan*, plus a gold progress bar or target date; values easy to edit in the i18n files):
1. **Degree completion:** coursework done, final certification pending.
2. **Software & web development:** strong on hardware, still building coding skills. This website is part of the plan.
3. **Japanese:** learning from zero; target **JLPT N3/N2 by December 2027**.
4. **Formal industry experience:** most engineering work so far has been self-run or project-based, not inside a company.
5. **Certifications:** strong practical CAD/FEA/manufacturing skills, few formal certificates yet.

**Goals section:**
- **Main goal:** build an engineering career **in Japan**.
- **Side goal:** **build a 3D print farm in India for motorcycle parts.**

Closing line: *"Everything else on this site started out on a list like this."*

### 4.9 About (`about.html`)
Short and personal, with one photo from `assets/images/about/`. Write a first draft of 3 short paragraphs from the facts in this file (who he is, why he builds, where he's headed): an ECE engineer who learns by building; approach *identify a problem → learn what's needed → design → build → test → improve*; the bikes, the music, the chaos that drives it; heading to Japan. Mark the draft in the i18n file with `"_draft": true` so Aaron knows to rewrite it in his own voice.

Then: education (BTech ECE, CEP 2021–2025, certification pending; 12th grade, Jabriya Indian School, Kuwait), languages (English, Hindi, Malayalam, Japanese *(learning)*), **Download CV**, and the **contact section** (email, LinkedIn, Formspree form). End with **日本でのエンジニア職を探しています**.

---

## 5. Folder map (already created)

```
portfolio/
├─ SADHANAM.md                  ← this file
├─ zynx/                        ← hero photo (grinding metal)
├─ models/                      ← existing STL files for the 3D viewer
└─ assets/
   ├─ logo/                     ← logo.svg (from Fusion, coming)
   ├─ resume/Aaron_Angel_Netto_CV.pdf
   ├─ video/
   └─ images/
      ├─ projects/{cement-printer, splint, guitar, robotic-arm}/
      ├─ manufacturing/
      ├─ industrial/
      ├─ bikes/{ava, toraa}/
      ├─ music/
      └─ about/
```
Create `assets/css/`, `assets/js/`, `assets/i18n/` and `tools/` as needed. Keep the README.txt files in each folder.

---

## 6. Publishing (GitHub Pages, free)

After the site works locally:
1. Write a `README.md` explaining: how to preview (`npx serve .`), how to add photos and rerun `node tools/build-media.js`, how to set the Formspree ID, how to add the song link, and where every text string lives (i18n files).
2. Add a `.gitignore` (node_modules, OS junk).
3. Initialise git, commit, and walk Aaron step by step through creating a GitHub repo, pushing, and turning on **GitHub Pages** (Settings → Pages → deploy from `main`, root). Use `gh` CLI if it's installed and logged in; otherwise give the exact clicks.
4. Explain how to connect a custom domain later (a `CNAME` file plus DNS records).

---

## 7. Final checks before saying "done"

- Open every page at mobile (375px), tablet and desktop widths and check nothing overflows.
- Test EN → 日本語 → عربي on every page; Arabic must be fully right-to-left.
- All links work (nav, CV download, LinkedIn, mailto, 404).
- Empty photo folders show placeholders, not broken images.
- No phone number, no AutoCAD, no China, no voice AI assistant anywhere.
- Lighthouse: aim for 90+ on performance, accessibility, best practices and SEO.
- Finally, list for Aaron **what he still needs to add**: photos per folder, `logo.svg`, Formspree ID, the "Twenty Three" link when released, a review of the Japanese/Arabic text, his own About text, and optional bike numbers.
