# NEXT PRINT — Website

Production-ready Next.js 15 landing page for NEXT PRINT contract manufacturing.

## Stack

| Tool | Version |
|------|---------|
| Next.js | 15 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run type-check # TypeScript check without building
```

## Project structure

```
src/
├── app/
│   ├── globals.css       # Tailwind v4 entry + design tokens
│   ├── layout.tsx        # Root layout, font, metadata
│   └── page.tsx          # Home page
├── components/
│   ├── icons/            # Outline SVG icons (accent colour)
│   │   ├── IconBattery.tsx
│   │   ├── IconChart.tsx
│   │   ├── IconCube.tsx
│   │   ├── IconGrowth.tsx
│   │   └── index.ts
│   ├── ui/
│   │   └── LogoMark.tsx  # NP monogram (swap for real logo file here)
│   ├── Header.tsx        # Fixed header with desktop nav
│   ├── HeroSection.tsx   # Hero copy + production image
│   ├── MobileNav.tsx     # Client component — burger + overlay
│   └── StatBar.tsx       # 4-column stats row
└── lib/
    └── constants.ts      # All editable content: email, nav, stats
public/
└── hero-printers.png     # Replace with final production photo
```

## Customisation

### Replace the logo
Open `src/components/ui/LogoMark.tsx` and swap the SVG with:
```tsx
import Image from "next/image";
export function LogoMark() {
  return <Image src="/logo.svg" alt="NEXT PRINT" width={48} height={40} />;
}
```

### Replace the hero image
Drop your production photo into `/public/` and update the `src` in
`src/components/HeroSection.tsx`:
```tsx
<Image src="/your-photo.jpg" ... />
```

### Change email / nav / stats
All in one file: `src/lib/constants.ts`

### Change brand colours
All design tokens live in `src/app/globals.css` inside the `@theme` block.

## Deploy

Works on Vercel, Netlify, or any Node host:
```bash
npm run build
npm start          # self-hosted
```
