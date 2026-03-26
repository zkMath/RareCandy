---
name: Sia Platform Design Reference
description: Design system from /Users/rhyswawryck/Desktop/Development/Sia/frontend — plum color palette, glass morphism, warm gradients, breathing orbs — to be replicated in RareCandy
type: reference
---

Sia platform source: `/Users/rhyswawryck/Desktop/Development/Sia/frontend`

## Core Design Tokens

**Plum Color Palette**:
50: #f5f3ff, 100: #ede9fe, 200: #ddd6fe, 300: #c4b5fd, 400: #a78bfa,
500: #8b5cf6, 600: #7c3aed, 700: #6d28d9, 800: #5b21b6, 900: #4c1d95, 950: #2e1065

**Background Gradient**: `linear-gradient(to top right, #ebe4f3 0%, #f0ecf5 35%, #f6f3f0 65%, #faf6f3 100%)`
**Grid Overlay**: 80px white grid at 50% opacity
**Sidebar**: `linear-gradient(180deg, #2e1065 0%, #3b1578 100%)`
**Top Bar**: `backdrop-blur-xl` + `rgba(255,255,255,0.6)`

## Component Patterns
- Glass cards: `rounded-2xl border border-white/50 backdrop-blur-md shadow-sm` + gradient bg
- Glass sections: `rounded-[28px] border border-white/60 backdrop-blur-md` + gradient
- Buttons: `rounded-xl`, plum bg, `shadow-lg shadow-plum-300/30`
- Stat cards: `bg-gray-50 rounded-xl p-3.5 border border-gray-100`
- Sidebar links: `rounded-xl`, active: `bg-white/15 text-white`, inactive: `text-white/60 hover:bg-white/10`

## Animations (defined in index.css)
- Breathe (4s): scale + opacity pulsing for orbs (3 layers: inner, mid, outer)
- Orb-swirl (8s): continuous rotation for gradient effects
- Float (7-11s): 6 patterns for decorative floating elements
- Scroll-left (40s/60s): infinite horizontal scroll for tickers

## Tailwind v4
Uses `@import "tailwindcss"` and `@theme` block for CSS custom properties.
