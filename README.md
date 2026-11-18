# जितेन्द्र ❤ अंशिका — 3D Wedding Invitation

An animated, 3D invitation website built with React + Vite, Three.js (react-three-fiber) and Framer Motion.
All text is taken from the printed invitation card.

## Experience
1. **Palace doors intro**: carved maroon-and-gold doors with a marigold toran. Tapping the Ganesh wax seal swings the doors open in 3D, plays a temple bell, and starts a soft tanpura drone.
2. **3D background**: falling rose/marigold petals, full 3D marigold flowers, twinkling gold dust and bokeh. The camera follows the mouse or phone tilt, and the petals speed up as you scroll.
3. **Sections**: Jai Shri Mahakal blessing with kalash → couple names (letter-by-letter reveal, original sketches in gold) → live countdown to the Shubh Lagna → Shri Ganesh shlokas card → *Shagun Kshanikayen*, a 3D coverflow of 5 ceremonies (each with "add to calendar") → Aashirwad Samaroh venue card (Google Maps + calendar) → baraat note → welcome message, Bal-Manuhar and share button.

## Run
```bash
npm install
npm run dev      # local dev
npm run build    # production build in dist/
```

## Music
After the doors open, a "Mahiro" murli (bansuri flute) instrumental plays.
Put your own track at `public/music/mahiro-murli.mp3` and it plays on loop. If the file is missing, a built-in synthesised murli tune plays instead.

## Deploy (GitHub Pages)
1. Create an empty repository on GitHub and push this folder to its `main` branch.
2. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Each push to `main` runs `.github/workflows/deploy.yml`. It builds the site and publishes it at `https://<username>.github.io/<repo>/`.

## Edit content
All text, dates and venues are in `src/data.js`.
Calendar times are IST. The countdown target is `weddingMoment`, set to 2 Dec 2026, 5:30 PM (Godhuli bela). Adjust it if the muhurat time differs.
