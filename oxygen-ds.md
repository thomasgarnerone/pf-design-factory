# Oxygen DS — Component Reference for Patient File Design
**Status:** ✅ Auto-populated from boilerplate  
**Source:** `~/doctolib/oxygen/` — README.md, prototype/patient-detail.*, preview/patientfile*.html  
**Live source:** Always read `~/doctolib/oxygen/README.md` for the latest fundamentals before using this file.

---

## Design Fundamentals

### Typography
- **Roboto** (400/500/700) — all UI and body text
- **Montserrat** (700) — titles and headings
- **Doctolib-Bold** — marketing/hero only, never in product UI
- Base: `html { font-size: 62.5% }` → `1rem = 10px` everywhere

### Color philosophy
- Always use **semantic tokens** (`--oxygen-color-semantic-*`), never primitives directly
- Primary blue: `#107ACA` / `--oxygen-color-semantic-brand-prominent-base`
- Backgrounds: white or `--oxygen-color-semantic-neutral-subtle-weaker`
- Colored surfaces only for status and callouts

### Spacing (8pt grid)
- `x1 = 8px (0.8rem)`, `x1.5 = 12px`, `x2 = 16px`, `x3 = 24px`, `x4 = 32px`
- Component padding: `1.6rem` min, `2.4rem` default
- Gap between workspace panels: `1.6rem`

### Borders & radius
- Hairlines: `0.1rem solid --oxygen-color-semantic-neutral-subtle-strong`
- Common radii: `0.4rem` inputs, `0.8rem` buttons, `1.2rem` panels/cards

### Shadows (always blue-tinted, never grey)
- Rest: `0 1px 4px rgba(blue,.16), 0 0 1px rgba(blue,.10)`
- Hover: `0 8px 8px rgba(blue,.08), 0 10px 40px rgba(blue,.08)`
- Cards: elevated OR bordered — never both

### Motion
- Duration: 150–250ms, ease-out in, ease-in out
- No bounces, no springs. Panel width transitions: `0.3s ease`

---

## Key Semantic CSS Tokens

```css
/* Text */
--oxygen-color-semantic-neutral-prominent-stronger   /* primary text */
--oxygen-color-semantic-neutral-prominent-strong     /* secondary text */
--oxygen-color-semantic-neutral-prominent-base       /* tertiary text */
--oxygen-color-semantic-neutral-prominent-weak       /* labels, placeholders */

/* Surfaces */
--oxygen-color-semantic-neutral-subtle-weaker        /* page / app background */
--oxygen-color-semantic-neutral-subtle-weak          /* row hover */
--oxygen-color-semantic-neutral-subtle-base          /* dividers */
--oxygen-color-semantic-neutral-subtle-strong        /* borders */
--oxygen-color-primitive-white                       /* card / panel background */

/* Brand */
--oxygen-color-semantic-brand-prominent-base         /* primary blue, CTAs */
--oxygen-color-semantic-brand-prominent-strong       /* hover on primary */
--oxygen-color-semantic-brand-subtle-weak            /* active tab bg, ghost hover */

/* Status */
--oxygen-color-semantic-positive-prominent-base      /* success green */
--oxygen-color-semantic-positive-subtle-weak         /* success bg tint */
--oxygen-color-semantic-warning-prominent-strong     /* warning text */
--oxygen-color-semantic-warning-subtle-weak          /* warning bg tint */
--oxygen-color-semantic-danger-prominent-base        /* error / danger */

/* Typography shortcuts */
--oxygen-font-semantic-title-xl-bold                 /* patient name */
--oxygen-font-semantic-title-l-bold                  /* page titles */
--oxygen-font-semantic-title-m-bold                  /* CardCollection titles */
--oxygen-font-semantic-title-s-bold                  /* small section headers */
--oxygen-font-semantic-body-l-bold                   /* topbar brand */
--oxygen-font-semantic-body-m-bold                   /* active tabs, buttons */
--oxygen-font-semantic-body-m-regular                /* standard body */
--oxygen-font-semantic-body-s-bold                   /* uppercase labels, tags */
--oxygen-font-semantic-body-s-regular                /* secondary body */
--oxygen-font-semantic-body-xs-bold                  /* badge counts */
--oxygen-font-semantic-body-xs-regular               /* timestamps, metadata */
```

---

## PF Shell Components

Read `~/doctolib/oxygen/prototype/patient-detail.composed.jsx` and `patient-detail.css` as the live reference. The summaries below are for quick orientation — always defer to the source files.

### `<Workspace actionBar={...}>`
Outermost layout container. Flex row: ActionBar + Focus + optional WorkflowPanel.
```css
.pd-workspace { display: flex; gap: 1.6rem; height: 100%; overflow: hidden; padding: 1.6rem; }
.pd-workspace > * { transition: width .3s ease; }
```

### `<ActionBar groups={[...]} activeId onSelect>`
Left sidebar. Width: `26rem`, fixed. Scrollable. Grouped navigation cards only — no primary action buttons.
```css
.pd-actionbar { width: 26rem; flex: none; background: white; border-radius: 1.2rem; padding: 1.2rem; }
.pd-actionbar__item.is-active { background: --brand-subtle-weak; color: --brand-prominent-strong; }
```
Group shape: `{ heading: string, items: [{ id, label, icon, count? }] }`

### `<Focus>`
Main content column. Grows to fill remaining Workspace width. Contains ChildViewHeader → SectionMenu.
```css
.pd-focus { flex: 1; min-width: 0; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 2.4rem; }
```

### `<ChildViewHeader label avatar sub onBack primaryAction actions>`
Patient identity bar. Always the first child of Focus.
- `label` — patient full name
- `sub` — `['58 yo · F', 'Patient since 2019', 'Last visit 22 Sep 2025']`
- `primaryAction` — solid brand button (e.g. "Start consultation")
- `actions` — secondary icon buttons (star, share…)

### `<SectionMenu items liveItem selectedId onSelectionChange>`
Horizontal tab bar + panel switcher. Always second child of Focus.
- Tab shape: `{ id, label, icon? }`
- `liveItem` — pulsing green dot tab for active Health Observation

Market canonical tab sets:
| Market | Tabs |
|---|---|
| EHR (FR/DE/IT full) | Health · Financial · Administrative · History |
| BMS-DE | Administrative · History · Documents · Notes |
| BMS-FR / BMS-IT | Administrative · History |

### `<CardCollection label primaryAction actions childView>`
Named section within a tab panel.
- `primaryAction` — outlined brand button in header
- `childView` — arrow link to full view (`{ ariaLabel, onClick }`)

### `<Card title icon size>`
Individual data module. `size`: `"small"` (half-width) | `"medium"` (full-width).
```css
.pd-card { background: white; border-radius: 1.2rem; padding: 1.6rem; }
.pd-card__row { display: flex; align-items: center; justify-content: space-between; padding: .8rem 0; border-bottom: .1rem solid --neutral-subtle-weak; }
```

### `<QuickEdit label value onSave>`
Inline-editable field within a Card row. Click to reveal input.

### `<InlineButton label icon onClick color>`
Contextual ghost button within card rows. `color`: `"brand"` | `"neutral"`.

### `<WorkflowPanel label stepBack actions onClose cancelButton alternativeButton confirmButton>`
Right panel for forms and multi-step workflows. Width: `40rem`, fixed.
- Header: label + back + icon actions + close
- Body: scrollable form content
- Footer: cancel + alternative + confirm

---

## Primitive Components

### `<Button variant ui size icon>`
- `variant`: `"solid"` | `"outlined"` | `"ghost"`
- `ui`: `"brand"` | `"neutral"` | `"danger"`
- `size`: `"medium"` | `"small"`

### `<IconButton icon label variant>`
- `variant`: `"default"` | `"outlined"`

### `<Icon name size>`
Renders from sprite. Name in kebab-case: `"calendar-day"`, `"heart-pulse"`, `"e-prescription"`.

**34 available icons:** ArrowLeft, ArrowRight, ChevronRight, ChevronDown, ChevronLeft, XmarkLarge, Plus, Pencil, PenToSquare, CalendarDay, Calendar, CalendarPlus, Clock, Phone, Envelope, MapPin, LocationDot, User, UserDoctor, Stethoscope, HeartPulse, Pills, EPrescription, FileLines, Bell, MagnifyingGlass, Star, Heart, Filter, Gear, InfoCircle, Paperclip, Print, Share, TrashCan, CircleCheck, Sparkles.

For icons outside this set, read from `~/doctolib/oxygen/packages/icons/src/bundled-index.ts`.

---

## Tags & Status Indicators

```css
.tag { display: inline-flex; padding: .2rem .8rem; border-radius: .6rem; font: --body-s-bold; }
.tag-neutral { background: --neutral-subtle-weak;  color: --neutral-prominent-base; }
.tag-success { background: --positive-subtle-weak; color: --positive-prominent-strong; }
.tag-warn    { background: --warning-subtle-weak;  color: --warning-prominent-strong; }

.sk { background: --neutral-subtle-weak; border-radius: .6rem; animation: sk 1.6s ease-in-out infinite; }
@keyframes sk { 0%,100%{opacity:.6} 50%{opacity:1} }
```

---

## Anti-patterns (hard violations)

- ❌ Hardcoding colors — always use semantic tokens
- ❌ Foreign icon sets (Lucide, Heroicons, Font Awesome, emoji)
- ❌ Both shadow and border on the same Card
- ❌ Primary actions (solid buttons) in the ActionBar
- ❌ Modal for content that belongs in WorkflowPanel
- ❌ Content outside the `Workspace → Focus → SectionMenu` hierarchy
- ❌ Copying `_base.css` / `_components.css` into cluster folders — reference by path
- ❌ Inventing CSS class names outside the `pd-*` namespace for shell elements

---

## Live reference paths

```
~/doctolib/oxygen/README.md                            ← DS fundamentals
~/doctolib/oxygen/prototype/patient-detail.composed.jsx ← composed components
~/doctolib/oxygen/prototype/patient-detail.primitives.jsx ← primitive components
~/doctolib/oxygen/prototype/patient-detail.css         ← shell CSS
~/doctolib/oxygen/prototype/patient-detail.app.jsx     ← full working example
~/doctolib/oxygen/preview/patientfileheader.html       ← PF header reference
~/doctolib/oxygen/preview/patientfilemenu.html         ← PF menu / SectionMenu reference
~/doctolib/oxygen/preview/patientfileactionbar.html    ← ActionBar reference
~/doctolib/oxygen/packages/tokens/src/tokens.css       ← full token set (~200k)
```
