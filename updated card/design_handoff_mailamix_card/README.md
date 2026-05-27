# Handoff: Mail-a-Mix Postcard Template

## Overview
This is the customer-facing card template for **Mail-a-Mix** — a web app that prints and mails a physical 6"×4" postcard featuring a CSS-rendered cassette tape on the front and a standard postcard layout on the back. The customer customizes the playlist title, recipient/sender names, cassette color, and card background; the back carries a scannable QR code linking to a YouTube playlist.

The customer-facing surface this design represents is the **live preview / customization screen**: a single page showing the card front + back with a small controls panel above. The end product (the printed postcard) is the card itself; the surrounding chrome (controls, tabs, page background) is the preview UI.

## About the Design Files
The single HTML file in this bundle (`Card Template.html`) is a **design reference**, not production code. It's a self-contained prototype illustrating the intended look, behavior, and customization model.

The task is to **recreate this design inside the Mail-a-Mix codebase** using its established framework, component library, state model, and styling system — not to ship the raw HTML. If no codebase exists yet, pick the most appropriate framework (React + Tailwind, Next.js, etc.) and implement the design there.

The cassette + label illustration in particular is built entirely from CSS gradients, box-shadows, and inline SVG noise — no raster images. Preserve that approach: every visual on the card should remain CSS/SVG so it scales cleanly to print resolution.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are locked in. Recreate pixel-perfectly. The card dimensions (864×576 at 144dpi-equivalent) correspond to a 6"×4" postcard at 300dpi when scaled up; the design is meant to print at the larger resolution.

---

## Screens / Views

There is one screen with two states (Front / Back) toggled via tabs.

### Screen: Card Preview & Customizer

**Purpose:** Let a customer customize their postcard and see both sides update live before placing the print order.

**Page layout (top to bottom):**
1. **Page heading** — "Mail-a-Mix" in Bebas Neue at the top
2. **Controls panel** — text inputs and color swatch rows
3. **Tab bar** — Front / Back toggle
4. **Card preview** — the 864×576 card itself
5. **Scale note** — small caption beneath the card

**Page background:** Dark warm gradient — `radial-gradient(ellipse at 50% 0%, #1a1208 0%, #0a0604 70%)` over `#0a0604`. Body font-family `'Space Mono', monospace`, color `#e8d4a8`.

---

### Component: Controls Panel
A card containing all customization inputs.

- **Container:** background `linear-gradient(180deg, #1a140c 0%, #14100a 100%)`, border `1px solid #2a2018`, border-radius 8px, padding 22px 26px, max-width 880px, inset top highlight `inset 0 1px 0 rgba(255,200,120,0.06)`.
- **Layout:** flex-wrap with `gap: 20px`. Text-input groups share a row at the top; swatch rows (Cassette Color, Card Background) are full-width rows, center-aligned.

**Inputs (all groups share the same control-group styling):**

| Field | id | Default value | Maxlength |
|---|---|---|---|
| Cassette Label | `labelInput` | `Summer 2026 for Jake` | 40 |
| Recipient Name | `recipientName` | `Jake Morrison` | — |
| Sender Name | `senderName` | `Maria` | — |

- **Label (above each input):** font-size `0.62rem`, letter-spacing `0.2em`, uppercase, color `#8a7456`.
- **Input field:** background `#0e0a06`, border `1px solid #2e2418`, border-radius 4px, color `#f0deb0`, font-family `'Space Mono', monospace`, font-size `0.85rem`, padding `9px 11px`. Focus border `#f0a020`.
- **Char count (Cassette Label only):** font-size `0.6rem`, color `#6a5840`. Turns `#e85d04` when length > 32.

**Swatch rows (Cassette Color, Card Background):**
- Row layout: flex-row, `justify-content: center`, gap `18px`. Label sits inline next to the swatches.
- **Swatch:** 32×32 circle, `border-radius: 50%`, `border: 2px solid transparent`, cursor pointer, inset shadow `inset 0 -3px 6px rgba(0,0,0,0.5)`, outer shadow `0 2px 4px rgba(0,0,0,0.4)`.
- **Hover:** `transform: scale(1.1)`.
- **Active:** `border-color: #f0a020`, `transform: scale(1.15)`.
- Each swatch is a radial gradient — see the **Cassette Color Variants** and **Card Background Variants** tables below for the exact colors.

---

### Component: Tab Bar (Front / Back)
- Container: `1px solid #2a2018`, border-radius 6px, background `#14100a`, overflow hidden.
- Tab: padding `8px 22px`, font Space Mono `0.7rem` letter-spacing `0.12em` uppercase, background transparent, color `#6a5840`.
- Active tab: background `#f0a020`, color `#14100a`.
- Hover (inactive): color `#d4b878`.

---

### Component: The Card (864×576)
- `border-radius: 4px`, `overflow: hidden`, drop-shadow stack: `0 30px 60px -10px rgba(0,0,0,0.8), 0 18px 36px -18px rgba(0,0,0,0.9), 0 0 0 1px rgba(80,60,40,0.4)`.

---

### Card Front

The front carries the cassette illustration centered on a warm dark field with subtle paper grain, a dashed amber inset frame with corner registration marks, a bottom "MAIL · A · MIX" wordmark, and the URL "mailamix.com" beneath it.

**Front field (default — Warm Brown):**
```
background:
  radial-gradient(ellipse at 30% 20%, #2a1a0c 0%, transparent 55%),
  radial-gradient(ellipse at 70% 80%, #1a0e06 0%, transparent 60%),
  linear-gradient(135deg, #1c1208 0%, #120a04 100%);
```

**Paper grain (::before):** a fractal-noise SVG at base frequency 0.85, mix-blend-mode `overlay` (or `multiply` for light backgrounds), opacity from the `--grain-opacity` variable per background variant.

**Coarse speckle (::after):** fractal-noise SVG at base frequency 0.18, mix-blend-mode `soft-light`, opacity `var(--speckle-opacity)`.

**Inset frame (`.front-frame`):** `inset: 22px`, `border: 1px dashed var(--front-accent-soft)`, border-radius 2px.

**Corner registration marks (`.reg-mark`):** 14×14px crosshairs in `var(--reg-color)`. Positioned 10px from each corner. Two 1px lines crossing at center.

**Bottom wordmark (`.front-brand`):** "MAIL · A · MIX" in Bebas Neue `0.78rem`, letter-spacing `0.55em`, color `var(--front-accent)`, centered with `bottom: 22px`. Dots are 4×4 circles in the same color.

**URL line (`.front-url`):** "mailamix.com" in Space Mono `0.55rem`, letter-spacing `0.28em`, lowercase, color `var(--front-accent)`, opacity 0.8, `bottom: 8px`.

---

### Component: The Cassette (centered on the front)

Wrapper rotated `-1.2°` with drop-shadow `drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 6px 8px rgba(0,0,0,0.45))`.

**Shell:** 540×340px, border-radius 8px, padding `14px 22px 12px`. Background is a two-layer gradient — a top highlight + a 170° body gradient using `var(--body-light) → var(--body) → var(--body-dark)`. Multiple inset shadows for top highlight, bottom shadow, side hairlines, plus an edge ring `0 0 0 1px var(--shell-edge)`.

A `::before` adds horizontal molding ribs (gradient on each side edge) + wear-spot radial gradients. A `::after` adds fine plastic noise via fractal-noise SVG, mix-blend-mode overlay, opacity 0.35.

**Cassette internal layout (top → bottom):**

1. **Top strip (`.cassette-top`, 14px tall):**
   - Two corner write-protect notch indents (`::before` and `::after` on `.cassette-top`) — 22×8px each, recessed into `var(--shell-edge)`, positioned 38px from the left/right edges.
   - Two screws in the outer corners.
   - Center "MAIL-A-MIX" molded text in Bebas Neue `0.55rem`, letter-spacing `0.4em`, color `var(--shell-text)`.

2. **Label well (`.cassette-label-well`, calc(100% - 32px) wide):**
   - Recessed dark frame `var(--shell-edge)`, padding 4px, border-radius 4px, inset shadow.
   - **Label paper inside:** 86px tall, rotated `0.3°` (hand-applied look), background is a layered gradient — two faint coffee-stain radial gradients + a 180° gradient from `var(--label-bg)` to `var(--label-bg2)`. Includes a `::before` SVG paper grain (mix-blend-mode multiply, opacity 0.18) and a `::after` radial vignette tinted with `rgba(120,70,30,0.18)`.
   - **Label structure:**
     - **Header band (`.label-header`, 18px tall):** background `var(--label-stripe)`. Brand "MAIL · A · MIX" left (Bebas Neue `0.7rem`, letter-spacing `0.26em`, color `var(--label-bg)`, `mix-blend-mode: screen`) and catalog "C–90 · NO. 0420" right (Space Mono `0.5rem`).
     - **Body (`.label-body`):** flex column centered. **Hero title (`.label-title`)** in Bebas Neue at a *length-responsive* size (see Behavior). The title has a **print-misregistration shadow**: `text-shadow: 0.6px 0.6px 0 var(--label-accent), -0.4px -0.4px 0 rgba(180,40,80,0.08)`. Below the title, a sub-row with "Side A · 90 Min · ★ · Hi-Fi" in Space Mono `0.5rem`, letter-spacing `0.18em`, color `var(--label-stripe)`. Bullets are 3px circles; the star is in `var(--label-accent)`.
     - **Footer stripe (`.label-footer`, 8px tall):** ticked pattern via repeating-linear-gradient between `var(--label-stripe2)` and `var(--label-bg2)`.

3. **Window (`.cassette-window`, ~142px tall):** background `var(--tape-color)` with a radial gradient at the bottom for the tape-head opening shadow. Inset shadow stack for the recessed look. Plastic reflection (`::before`) and visible tape strand (`::after`) at the bottom (linear gradient with `var(--tape-wound)` center stop).
   - **Two reels (`.reel`, 92×92):** background is a single radial gradient composing concentric bands → reel-hub center, reel-bg ring, wound tape ring (`var(--tape-wound)`), darker tape ring, outer teeth (`var(--reel-teeth)`). A `::before` adds repeating concentric circle lines (tape spiral texture) at inset 24%. A `::after` adds outer gear teeth via repeating conic-gradient masked to the outer ring.
   - **Hub:** 34×34 circle, radial-gradient hub colors, 6-pronged sprocket pattern via conic-gradient (`::before`), 13×13 center hole.
   - **Head slot (`.head-slot`):** 110×12 capstan well at the bottom of the window. Contains 4 pins — two narrow `.head-pin` (3×6 metallic) and two wider `.head-pin.wide` (8×4).

4. **Bottom strip (`.cassette-bottom`, 32px tall, grid `auto 1fr auto`):**
   - Left side: screw + two-line shell-spec text "Stereo / Dolby B NR" (Space Mono `0.5rem`, letter-spacing `0.2em`, color `var(--shell-text)`).
   - Center: pin cluster — 5 pin holes (3 small 4×4, 2 large 7×7) in a recessed dark strip with inset shadow.
   - Right side: two-line spec "Made for / you · ♥" + screw.

**Screws (`.screw`):** 11×11 circles, radial gradient `var(--screw-color)` → `var(--screw-dark)`, multiple inset shadows for depth, slot rotated 38° via `::after`.

---

### Component: Cassette Color Variants

Seven variants. Each sets a complete set of CSS custom properties on `.cassette.<variant>`:

| Variant | Use |
|---|---|
| `black` (default) | Classic Black |
| `cream` | Cream |
| `orange` | Orange |
| `blue` | Blue |
| `pink` | Pastel Pink |
| `purple` | Bright Purple |
| `sage` | Sage Green |

**Variables driven per variant (see `Card Template.html` for the exact hex values):**
- `--body`, `--body-dark`, `--body-light`, `--body-shine`, `--body-wear`, `--shell-edge`
- `--label-bg`, `--label-bg2`, `--label-txt`, `--label-stripe`, `--label-stripe2`, `--label-accent`
- `--reel-bg`, `--reel-hub`, `--reel-teeth`
- `--screw-color`, `--screw-dark`
- `--tape-color`, `--tape-wound`
- `--shell-text`, `--hairline`

**Exact values are in `Card Template.html` lines for `.cassette.cream`, `.cassette.orange`, etc.** Copy them verbatim — they're tuned per shell.

**Swatch preview gradients** for each cassette color (used on the Cassette Color swatches):
- black: `radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a 70%)`
- cream: `radial-gradient(circle at 30% 30%, #fff0c8, #d4b878 80%)`
- orange: `radial-gradient(circle at 30% 30%, #ff7a20, #a83800 80%)`
- blue: `radial-gradient(circle at 30% 30%, #3a78ff, #0a1a55 80%)`
- pink: `radial-gradient(circle at 30% 30%, #fcd6dc, #c88090 80%)`
- purple: `radial-gradient(circle at 30% 30%, #a070ec, #3a0c70 80%)`
- sage: `radial-gradient(circle at 30% 30%, #b6c4a4, #4e5a3c 80%)`

---

### Component: Card Background Variants

Five variants applied to `.card-front` as classes (`bg-brown` is the default and uses no class override):

| Variant | Use |
|---|---|
| `bg-brown` (default) | Warm Brown |
| `bg-black` | Black |
| `bg-blue` | Light Blue |
| `bg-white` | White |
| `bg-gray` | Light Gray |

Each variant overrides these CSS custom properties on `.card-front`:
- `--bg-1`, `--bg-2`, `--bg-3`, `--bg-4` — background gradient stops
- `--front-accent` — color for bottom wordmark, URL, brand dot
- `--front-accent-soft` — color for inset frame border
- `--reg-color` — color for corner registration marks
- `--grain-blend` — `overlay` (dark bg) or `multiply` (light bg)
- `--grain-opacity`, `--speckle-opacity` — noise intensity

**Exact values are in `Card Template.html`.** The pattern: dark backgrounds keep `overlay` blend with amber accents; light backgrounds switch to `multiply` blend with sepia/charcoal accents so the frame and wordmark stay legible.

**Swatch preview gradients:**
- bg-brown: `radial-gradient(circle at 30% 30%, #3a2410, #14100a 80%)`
- bg-black: `radial-gradient(circle at 30% 30%, #1c1c1c, #050505 80%)`
- bg-blue: `radial-gradient(circle at 30% 30%, #d4dfeb, #98aecc 80%)`
- bg-white: `radial-gradient(circle at 30% 30%, #ffffff, #ebe2cf 80%)`
- bg-gray: `radial-gradient(circle at 30% 30%, #c8c4be, #989088 80%)`

---

### Card Back

A standard postcard layout split 50/50 by a vertical dashed divider. Both columns use `display: flex; flex-direction: column; justify-content: center; gap: 28px` (left) / `36px` (right) so the "From" blocks and the "Note for you" / "Deliver to" blocks line up across the divider.

**Back paper:** `radial-gradient(ellipse at 50% 50%, #fdf6e5 0%, #f4ebd5 100%)`. Paper grain via fractal-noise SVG (`::before`), multiply blend, opacity 0.35.

**Central divider (`::after`):** vertical dashed amber line — `repeating-linear-gradient(180deg, #b89860 0px, #b89860 2px, transparent 2px, transparent 5px)`, opacity 0.5, top 50px, bottom 50px.

**Top masthead (`.postcard-masthead`):** centered "POSTCARD · MAIL-A-MIX · PLAY ME" in Bebas Neue `0.7rem`, letter-spacing `0.42em`, color `#8a6830`. Dots are 3px in `#c64a08`.

#### Left column (top → bottom)

1. **Sender block (`.sender-block`):**
   - "A MIXTAPE FROM" label (Space Mono `0.5rem`, letter-spacing `0.22em`, color `#8a6830`).
   - Sender name (`#senderNameDisplay`, Bebas Neue `1.1rem`, color `#2a1810`).
   - Layout: flex row, baseline alignment, gap 10px. Bottom border: `1px dashed rgba(184,152,96,0.45)`, padding-bottom 4px.

2. **QR area (`.qr-area`):**
   - **QR placeholder** (`.qr-placeholder`, id `qrBox`): 108×108px, `border: 1.5px solid #2a1810`, border-radius 3px, background `#fffaee`, padding 6px.
     - Fake QR pattern via two `::before` repeating-linear-gradients (4px on, 4px off, both axes).
     - Three QR-style finder squares via `::after` using a complex box-shadow stack to position the top-left, top-right, and bottom-left finders.
     - **Replace with a real QR code in production** generated from the playlist URL. Same size, same colors (`#2a1810` on `#fffaee` background works), same border treatment.
   - **QR meta (right of the QR):** "▶ SCAN" arrow line in Bebas Neue `0.65rem` color `#c64a08`. "to Play / the Tape" headline in Bebas Neue `1.55rem`, color `#2a1810`. Subline "Opens your playlist / on YouTube" in Space Mono `0.55rem`, color `#5a4830`.

3. **Message area (`.message-area`):**
   - "A note for you ↓" label (Space Mono `0.5rem`, letter-spacing `0.22em`, color `#8a6830`).
   - Four dashed message lines (`repeating-linear-gradient(90deg, #b89860 0px, #b89860 4px, transparent 4px, transparent 8px)`, opacity 0.45, 1px tall, gap 14px).

#### Right column (top → bottom)

1. **Return block (`.return-block`):**
   - "FROM" label (Space Mono `0.45rem`, letter-spacing `0.22em`, color `#a88848`).
   - Return address (Space Mono `0.55rem`, color `#6a5236`, line-height 1.7):
     ```
     Mail-a-Mix
     5504 13th Ave
     Unit #214
     Brooklyn, NY 11219
     ```
   - Return URL (`mailamix.com`) in Space Mono `0.55rem` color `#c64a08`.

2. **Recipient block (`.recipient-block`):**
   - Left border accent: `3px solid #c64a08`, padding `12px 14px`, margin-left/right 8px.
   - "▶ DELIVER TO" label (Space Mono `0.5rem`, letter-spacing `0.22em`, color `#c64a08`).
   - Recipient name (`#recipientNameDisplay`, Archivo Black `0.95rem`, color `#1c1208`).
   - Recipient address (Space Mono `0.72rem`, color `#2a1810`, line-height 1.7). Sample copy: `456 Main Street / Apt 3B / Brooklyn, NY 11201`.

3. **Cancellation stamp (`.cancel-mark`)** — decorative postal cancellation mark overlaid behind the return-block:
   - 86×86 circle, position absolute top 28px right 22px, rotated `-12°`, opacity 0.55, behind content (`z-index: 0`).
   - Outer border 1.5px solid `rgba(198,74,8,0.35)`, inner dashed border (`::before`) at inset 5px in `rgba(198,74,8,0.4)`.
   - Stack inside: "MAIL-A-MIX" (Bebas `0.6rem`) / "2026" (Bebas `1.1rem`) / "Side A · Play" (Space Mono `0.4rem`), all in `rgba(198,74,8, 0.6–0.75)`.

---

## Interactions & Behavior

### Live updates (typing → preview)

| Input | Updates element |
|---|---|
| `#labelInput` | `#labelText` (cassette label hero text) — and triggers `fitLabelTitle()` |
| `#recipientName` | `#recipientNameDisplay` |
| `#senderName` | `#senderNameDisplay` |

Empty values fall back to `"Your Tape"`, `"Recipient Name"`, `"A friend"` respectively.

### Length-responsive label title (`fitLabelTitle`)

The cassette label hero font-size adapts to the character count so long playlist names still print well:
```js
let size = 1.85;        // rem
if (len > 18) size = 1.6;
if (len > 24) size = 1.35;
if (len > 32) size = 1.15;
```

Character-count badge (`#charCount`) shows `${len} / 40`. Adds `.warn` class (`color: #e85d04`) when `len > 32`.

### Cassette color picker
Clicking a `[data-color]` swatch:
1. Removes `.active` from every other cassette swatch.
2. Adds `.active` to the clicked swatch.
3. Sets the cassette element to `class="cassette <color>"`.

### Card background picker
Clicking a `[data-bg]` swatch:
1. Removes `.active` from every other bg swatch.
2. Adds `.active` to the clicked swatch.
3. Strips any existing `bg-*` class from `.card-front`.
4. If the choice isn't `brown`, adds `bg-<color>` to `.card-front`.

### Front / Back tab toggle
Clicking a tab sets `display: block` on the matching card and `display: none` on the other. (Reimplement with conditional rendering / a controlled tab in the target framework.)

### Hover / focus states
- Inputs: focus border `#f0a020`.
- Swatches: hover scales to 1.1, active scales to 1.15 with amber border.
- Tabs: inactive hover color shifts to `#d4b878`.

### No animations
No transitions beyond the standard 0.15s color/border-color/transform tweens on hover.

---

## State Management

Minimal state — all client-side:
- `labelText: string` (≤ 40 chars) — cassette title
- `recipientName: string`
- `senderName: string`
- `cassetteColor: 'black' | 'cream' | 'orange' | 'blue' | 'pink' | 'purple' | 'sage'`
- `cardBackground: 'brown' | 'black' | 'blue' | 'white' | 'gray'`
- `side: 'front' | 'back'`
- A derived QR code URL (currently a placeholder pattern; in production, generate from the YouTube playlist URL the customer attaches in an earlier step).
- The recipient address fields (street, city, state, zip) — currently hardcoded sample copy in this template; wire to real input fields when this is plugged into the actual checkout flow.

The conversation context: the surrounding app flow (playlist URL capture, recipient address entry, payment, order submission) lives outside this template. Inputs you see in this preview are *display state*; the real form probably lives upstream with its own validation.

---

## Design Tokens

### Typography (Google Fonts)
- **Bebas Neue** — display headlines, cassette label title, brand wordmarks, scan labels
- **Archivo Black** — recipient name
- **Space Mono** — body text, meta labels, addresses, monospaced details (also use italic for…nothing right now; the import includes italic if needed later)

Load with:
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

### Type scale (used)
- 2.6rem — page H1 (controls only)
- 1.85 / 1.6 / 1.35 / 1.15rem — cassette label hero (length-responsive)
- 1.55rem — "to Play / the Tape" headline on back
- 1.1rem — sender name (Bebas Neue), cancel-mark middle line
- 0.95rem — recipient name (Archivo Black)
- 0.85rem — input field text
- 0.78rem / 0.72rem — front wordmark / recipient address
- 0.7rem — masthead, tab text, label brand
- 0.65rem — scan arrow
- 0.62 / 0.6 / 0.58rem — control labels, char count, scale note
- 0.55 / 0.52 / 0.5rem — scan sub, meta labels, shell-spec
- 0.45 / 0.42 / 0.4rem — return label, stamp label, cancel-mark bottom

### Color palette (literals used outside the variant systems)

**Page / chrome:**
- `#0a0604` — deepest page background
- `#1a1208` — page background mid
- `#14100a` — controls dark
- `#1a140c` — controls light
- `#2a2018` — controls border
- `#e8d4a8` — body text
- `#8a7456` — control labels
- `#6a5840` — char count, inactive tab
- `#5a4830` — scale note
- `#f0a020` — primary amber accent (focus, active tab, hover wordmark)
- `#f0deb0` — input text
- `#0e0a06` — input background
- `#2e2418` — input border
- `#e85d04` — warn / over-character-limit
- `#d4b878` — inactive tab hover

**Card back paper / postal:**
- `#fdf6e5` → `#f4ebd5` — back paper gradient
- `#b89860` — divider color, message-line color
- `#c8b080` — made-with rule (legacy — see note below)
- `#8a6830` — masthead, message label, sender label
- `#c64a08` — primary postal accent (▶ SCAN, ▶ DELIVER TO, recipient border, return URL, cancellation mark)
- `#a88848` — return label, stamp label
- `#2a1810` — main back ink (QR border, scan headline, recipient address)
- `#1c1208` — recipient name ink
- `#6a5236` — return address ink
- `#5a4830` — scan sub ink
- `#fffaee` — QR background

**Card front (default brown):**
- `#2a1a0c`, `#1a0e06`, `#1c1208`, `#120a04` — background stops
- `rgba(240,160,32, 0.42 / 0.32 / 0.12)` — accent triplet
- `#6a4a20` — registration marks
- See **Card Background Variants** for the other four bg recipes (black/blue/white/gray).

### Spacing
No formal scale — sizes are tuned per element. Notable repeated values: 4, 6, 8, 10, 14, 18, 22, 28, 36, 50 px.

### Border radius
- 2px — frame inset, label paper, label footer, stamp area, head slot, message line, return-block
- 3px — QR placeholder
- 4px — input field, cassette window, label-well, card
- 6px — tab bar
- 8px — controls panel, cassette shell, swatch shadows
- 50% — screws, reels, hubs, swatches, brand dots, cancellation mark

### Shadows
The cassette shell is the deepest stack — see `.cassette` for the full recipe. The card itself uses a layered drop-shadow + ring. Reels and hubs use multi-stop inset shadows for the dimensional plastic look. Don't simplify these — the depth comes from the layering.

---

## Assets

**No external images.** Everything on the card — cassette, label paper texture, QR placeholder, postal cancellation stamp — is CSS gradients + inline SVG `feTurbulence` noise data URIs. Keep it that way for print scaling.

**Google Fonts** are the only external dependency. If your app already self-hosts fonts, switch to those; the families are stable choices.

**QR code in production:** swap the `.qr-placeholder` for a real QR generated server-side from the playlist URL. Target the same 108×108 framed look — dark ink `#2a1810` on warm-white `#fffaee` background, 1.5px outer border, 3px border-radius.

---

## Implementation Notes

- The cassette is ~520 lines of CSS. Don't try to refactor it into a single utility-class soup — keep the structural classes (`.cassette`, `.cassette-label-well`, `.cassette-window`, `.reel`, `.head-slot`, etc.) intact. They're load-bearing for readability.
- The CSS custom property pattern (`.cassette.<color>` setting `--body`, `--label-bg`, etc., consumed by all child elements) is the cleanest way to model the variants. Preserve it.
- The same pattern (`--bg-1` etc. on `.card-front.bg-<name>`) handles card backgrounds.
- The card is rendered at 864×576px = 6"×4" at 144dpi. For print, scale up to 300dpi (1800×1200) — keep all units relative (rem/em where used, px otherwise) so the cassette scales cleanly.
- The cassette rotates `-1.2°` and the label rotates `0.3°` — these tiny angles do a lot of the "real object" work. Don't snap them to zero.
- The label title's `text-shadow` is a *print-misregistration* effect (a 0.6px orange offset). Don't replace it with a regular drop-shadow.

---

## Files

- `Card Template.html` — the single self-contained design reference. Every variant, behavior, and interaction is in this one file. Open it in a browser to see all states (use the controls to switch cassette color / card background / tab).
