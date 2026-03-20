# 💍 Pixar Wedding — Cinematic Interactive Invitation

A magical, Pixar-style animated wedding invitation website built with Three.js, GSAP, and Lenis smooth scrolling.

## ✨ Features

- **11 cinematic scenes** — scroll through your love story
- **Three.js 3D particle worlds** — gold sparkles, stars, lanterns
- **GSAP ScrollTrigger** — cinematic reveals and transitions
- **Lenis smooth scrolling** — buttery-smooth camera movement
- **Particle systems** — petals, fireflies, hearts, fireworks, birds, butterflies
- **Live countdown timer** to your wedding date
- **Animated RSVP form** with sparkle submit effect
- **Lightbox photo gallery**
- **Embedded Google Maps** for the venue
- **Fully responsive** — mobile, tablet, desktop
- **Reduced motion support** — accessibility-friendly

## 🚀 Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
cd pixar-wedding
vercel --prod
```

### Option B: GitHub → Vercel (Recommended)
1. Push this folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "✨ Initial wedding site"
   git remote add origin https://github.com/YOUR_USERNAME/pixar-wedding.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Vercel auto-detects static site — click **Deploy**
5. Your site is live! 🎉

## 🎨 Customization

### Change couple names
In `index.html`, find:
```html
<span class="name-one">Sophia</span>
<span class="name-two">Ethan</span>
```

### Change wedding date
In `scripts/animations.js`:
```js
const weddingDate = new Date('2025-06-14T16:00:00');
```

### Add real photos
Replace the `.photo-placeholder` divs in `index.html` with:
```html
<img src="assets/photos/your-photo.jpg" alt="Description" />
```
Add your photos to `assets/photos/`.

### Change venue address
Update the Google Maps embed `src` in Scene 9 of `index.html`.

### Color palette
All colors are CSS custom properties in `styles/main.css`:
```css
:root {
  --gold:    #d4a853;
  --rose:    #e8a0a0;
  --ivory:   #fdf8f0;
  --sage:    #8aab8a;
  --lavender:#c9b8d8;
}
```

## 📁 Project Structure

```
pixar-wedding/
├── index.html              # All 11 scenes
├── vercel.json             # Vercel deployment config
├── .gitignore
├── styles/
│   ├── main.css            # Design tokens, typography, base
│   ├── layout.css          # Scene layouts, components
│   └── animations.css      # Keyframes, reveal classes
└── scripts/
    ├── particles.js        # Particle factory (petals, stars, etc.)
    ├── scene-controller.js # Three.js 3D backgrounds
    ├── animations.js       # GSAP ScrollTrigger choreography
    └── main.js             # App bootstrap + Lenis
```

## 🛠 Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Three.js | r128 | 3D particle worlds |
| GSAP | 3.12.5 | Animation engine |
| ScrollTrigger | 3.12.5 | Scroll-driven animations |
| Lenis | 1.0.42 | Smooth scrolling |

All loaded from CDN — no build step required!

---

Made with ♥ for the most magical day of your lives.
