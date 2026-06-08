# Happy 20th Birthday Hasini

A cinematic, single-page birthday experience for Hasini. This project is built using React, GSAP 3, and Tailwind CSS. It is heavily optimized for both mobile and desktop experiences, prioritizing high-performance 60 FPS animations.

## Setup and Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

## How to Customize

1. **Update Photos:**
   - Drop your 12 photos into `src/assets/photos/`
   - Name them exactly `photo-01.jpg` through `photo-12.jpg` (or update the extensions/paths in `src/content/content.js`).
   - For best results, use a consistent aspect ratio (e.g., 4:5 or square).

2. **Edit Text, Captions, and Milestones:**
   - Open `src/content/content.js`.
   - Update `galleryPhotos` array with your captions.
   - Update `letterContent` with your personal heartfelt message.
   - Update `timelineMilestones` with real years and memories.

3. **Add Background Music:**
   - Drop your `.mp3` file into the `public/` folder.
   - Rename it exactly to `song.mp3`.
   - It will automatically play in the background as soon as the website is opened and tapped!

4. **Update Deployed URL (for QR Code and Share button):**
   - Open `src/App.jsx`.
   - Update `export const SITE_URL = "https://your-domain.here";` at the top of the file.

## Deployment

This project uses Vite and is ready to be deployed on Vercel, Netlify, or GitHub Pages.

**Deploy to Vercel (One-command):**
```bash
npx vercel --prod
```
*(Make sure to use the "Vite" preset if prompted).*

## Tech Stack Highlights
- **Animation:** GSAP 3 (ScrollTrigger, CustomEase) running exclusively on `transform` and `opacity`
- **Gestures:** `@use-gesture/react` for the mobile photo carousel
- **Particles:** `canvas-confetti` and custom Canvas 2D fireflies
- **Layout:** Tailwind CSS v4

Crafted with love ❤️
