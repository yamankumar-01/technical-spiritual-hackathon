# Soft Medical Glass — UI & Design System

A modern, clean, and calming healthcare/SaaS design system built with **React**, **Tailwind CSS**, and **Lucide Icons**.

---

## 1. Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background gradient top | `#DFF5F7` | Soft cyan wash at top of page |
| Background gradient bottom | `#FFFFFF` / `#EAF9FA` | Transition to near-white downward |
| Primary accent (Teal) | `#4FB4C4` | Interactive highlights, active nav, icons |
| Accent gradient end | `#3E97AE` | Button gradient ending, dark teal text |
| Heading text | `#12141A` | Near-black bold headings |
| Body / Secondary text | `#5B6470` | Descriptions and labels |
| Card background | `rgba(255, 255, 255, 0.95)` | Glassmorphic cards with blur |
| Shadow | `rgba(18, 20, 26, 0.06–0.10)` | Diffused, large blur radius |

---

## 2. Core Components

All components are located in `src/components/soft-medical-glass/` and can be imported from the barrel file:

```jsx
import {
  PillNavbar,
  HeroCard,
  FloatingOverlapBar,
  IconCard,
  MediaCard,
  DuotoneIcon,
} from './components/soft-medical-glass';
```

### 1. `PillNavbar`
Floating rounded pill navbar with glassmorphism, responsive navigation links, and primary CTA.
- **Props**:
  - `logo`: ReactNode
  - `links`: `Array<{ label: string, href: string, active?: boolean, onClick?: () => void }>`
  - `cta`: `{ label: string, onClick?: () => void, href?: string }`
  - `maxWidth`: string (default `'max-w-6xl'`)

### 2. `HeroCard`
Card-style hero container with rounded corners (`rounded-[32px]`) and a two-column responsive layout.
- **Props**:
  - `tag`: ReactNode or string
  - `title`: ReactNode or string
  - `subtitle`: ReactNode or string
  - `media`: ReactNode (image/visual)
  - `mediaPosition`: `'right' | 'left'` (default `'right'`)
  - `actions`: ReactNode (action buttons)

### 3. `FloatingOverlapBar`
Signature glassmorphic overlap card docked across the bottom edge of the hero or any section using negative margins.
- **Props**:
  - `children`: Form fields, dropdowns, inputs, or search bars
  - `overlapClass`: string (default `'-mt-10 sm:-mt-14'`)
  - `maxWidth`: string (default `'max-w-5xl'`)

### 4. `IconCard`
Equal-width cards with a centered duotone-in-blob icon glyph on top and bold title below.
- **Props**:
  - `icon`: ReactNode or Lucide icon component
  - `title`: ReactNode or string
  - `description`: ReactNode or string
  - `badge`: string (optional tag)
  - `active`: boolean
  - `onClick`: function

### 5. `MediaCard`
Rounded-corner photo on top with subtle cyan color-grade filter, bold title below, and description.
- **Props**:
  - `image`: string (URL)
  - `imageAlt`: string
  - `badge`: string (overlay tag)
  - `title`: ReactNode or string
  - `description`: ReactNode or string
  - `footer`: ReactNode (CTA button or link)

### 6. `DuotoneIcon`
A flat colored glyph sitting inside a soft pale cyan rounded blob.
- **Props**:
  - `icon`: ReactNode or Lucide icon component
  - `size`: `'sm' | 'md' | 'lg' | 'xl'` (default `'md'`)
  - `blobColor`: string (default `'bg-[#DFF5F7]'`)
  - `iconColor`: string (default `'text-[#4FB4C4]'`)

---

## 3. Interactive Demo & Live Showcase

Visit **`/design-system`** or **`/soft-glass`** on your local server:
```
http://localhost:5173/design-system
```
