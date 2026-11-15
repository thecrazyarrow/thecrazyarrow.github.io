/*
  ============================================================
  tools/build-media.js : makes the photo list for the website
  ============================================================
  Run it from the portfolio folder AFTER ADDING PHOTOS:

      node tools/build-media.js

  What it does:
    1. Looks in zynx/ and every folder under assets/images/
    2. Lists the images in each folder, sorted by file name
       (so 01.jpg, 02.jpg, 10.jpg come out in that order)
    3. Notes the videos in assets/video/ and whether assets/logo/logo.svg exists
    4. Writes it all to assets/media.json, which the pages read

  BONUS: if the "sharp" package is installed (npm install), it also makes a
  smaller .webp copy of every photo, and the site uses those automatically.
  If sharp isn't installed, that step is simply skipped.

  This is Node.js: JavaScript that runs on your computer instead of in a
  browser. "require" is Node's way of importing built-in tools.
*/

const fs = require('fs');       // read and write files
const path = require('path');   // join folder names safely on Windows and Mac

const ROOT = path.join(__dirname, '..');               // the portfolio folder
const IMAGE_ROOTS = ['zynx', 'assets/images'];
const IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
const VIDEO_TYPES = ['.mp4', '.webm', '.mov'];

// Try to load sharp. If it isn't installed, carry on without it.
let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('(sharp not installed: skipping .webp copies. Optional: run "npm install")');
}

// Web paths always use "/" even on Windows
const toWeb = p => p.split(path.sep).join('/');

// "Natural" sort: 2.jpg comes before 10.jpg
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

// Every folder inside a folder (including itself)
function allFolders(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [dir];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
      result.push(...allFolders(path.join(dir, entry.name)));
    }
  }
  return result;
}

async function main() {
  const media = { generated: new Date().toISOString(), logo: null, folders: {}, videos: [] };
  let made = 0;

  for (const rootName of IMAGE_ROOTS) {
    for (const folder of allFolders(path.join(ROOT, rootName))) {
      const files = fs.readdirSync(folder)
        .filter(f => IMAGE_TYPES.includes(path.extname(f).toLowerCase()))
        .sort(byName);

      // A .webp with the same name as a .jpg/.png is OUR copy, not a separate photo
      const names = new Set(files.map(f => path.parse(f).name.toLowerCase()));
      const originals = files.filter(f => {
        const isWebp = path.extname(f).toLowerCase() === '.webp';
        if (!isWebp) return true;
        const base = path.parse(f).name.toLowerCase();
        return !files.some(o => o !== f && path.parse(o).name.toLowerCase() === base);
      });

      const list = [];
      for (const file of originals) {
        const full = path.join(folder, file);
        const entry = { src: toWeb(path.relative(ROOT, full)) };
        const ext = path.extname(file).toLowerCase();

        if (ext !== '.webp' && ext !== '.gif') {
          const webpPath = path.join(folder, path.parse(file).name + '.webp');
          if (sharp && !fs.existsSync(webpPath)) {
            try {
              // max 1800px wide, quality 78: much smaller, still sharp
              await sharp(full).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(webpPath);
              made++;
            } catch (err) {
              console.warn('  could not convert ' + file + ': ' + err.message);
            }
          }
          if (fs.existsSync(webpPath)) entry.webp = toWeb(path.relative(ROOT, webpPath));
        }
        list.push(entry);
      }

      media.folders[toWeb(path.relative(ROOT, folder))] = list;
      if (names.size) console.log(`  ${toWeb(path.relative(ROOT, folder))}: ${list.length} photo(s)`);
    }
  }

  // Videos
  const videoDir = path.join(ROOT, 'assets', 'video');
  if (fs.existsSync(videoDir)) {
    media.videos = fs.readdirSync(videoDir)
      .filter(f => VIDEO_TYPES.includes(path.extname(f).toLowerCase()))
      .sort(byName)
      .map(f => 'assets/video/' + f);
  }

  // Logo
  if (fs.existsSync(path.join(ROOT, 'assets', 'logo', 'logo.svg'))) media.logo = 'assets/logo/logo.svg';

  fs.writeFileSync(path.join(ROOT, 'assets', 'media.json'), JSON.stringify(media, null, 2) + '\n');
  console.log(`Wrote assets/media.json (${made} new .webp copies, ${media.videos.length} video(s), logo: ${media.logo ? 'yes' : 'not yet'})`);
}

main();
