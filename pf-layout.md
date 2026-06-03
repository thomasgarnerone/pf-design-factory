# Patient File — Foundational Layout Specification
**Status:** ✅ Updated to match Oxygen page-anatomy.md (2026-06-03)
**Official source:** `~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md`
**Repo:** `github.com/doctolib/pf-design-factory`

---

## Layout Overview

Based on Oxygen's official page anatomy, the Patient File uses a **three-zone layout**:

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar  (global functions, fixed)                         │
├──────────┬──────────────────────────────────┬──────────────┤
│          │  Focus Zone                       │              │
│ OS Menu  │  ┌────────────────────────────┐  │  Toolbox     │
│          │  │ ChildViewHeader            │  │              │
│ (left,   │  ├────────────────────────────┤  │ (right,      │
│  collap- │  │ SectionMenu (tabs)         │  │  contextual) │
│  sible)  │  ├────────────────────────────┤  │              │
│          │  │ Tab panels                 │  │ ActionBar or │
│          │  │ (CardCollections)          │  │ Workflow     │
│          │  │                            │  │ Panel        │
└──────────┴──────────────────────────────────┴──────────────┘
```

CSS grid root:
```css
.pd-app {
  display: grid;
  grid-template-rows: 5.6rem 1fr;
  height: 100vh;
  min-height: 64rem;
}
```

---

## Zone 1 — Top Bar

| Property | Value |
|---|---|
| Height | `5.6rem` fixed |
| Background | `--oxygen-color-primitive-white` |
| Border | `0.1rem solid --oxygen-color-semantic-neutral-subtle-base` (bottom only) |
| Layout | `flex; align-items: center; justify-content: space-between; padding: 0 2.4rem; gap: 1.6rem` |

Zones: **Left** — brand mark + "Doctolib" · **Center** — breadcrumb (Patients › Name) · **Right** — search + notifications + practitioner avatar

Must never contain: module content, patient data, primary CTAs, form fields.

---

## Zone 2 — OS Menu

**Location:** Left side, vertical navigation  
**Official spec:** See `oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md`

| Property | Value |
|---|---|
| Width | Variable (collapsible) |
| Position | Fixed left |
| Behavior | Collapsible to maximize Focus Zone space |

**Structure:**
- Primary navigation items (major features/sections)
- Maximum one level of sub-navigation
- Always accessible regardless of page context

**Rule:** The OS Menu was previously called the "Stub". Use **OS Menu** terminology consistently.

Component spec → `oxygen/packages/b2b/src/navigation/SidebarMenu/SidebarMenu.guidelines.md`

---

## Zone 3 — Focus Zone

**Location:** Center, primary workspace  
**Official spec:** See `oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md`

**The primary interactive area where healthcare professionals perform their core tasks.**

```css
.pd-focus {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 0 .4rem;
}
```

**Behaviors:**
- Content changes with every primary navigation action
- The Focus Zone's content dictates what appears in the Toolbox (right side)

**Structure:** Contains in order: ChildViewHeader → SectionMenu → tab panels (CardCollections)

Pattern spec → `oxygen/packages/b2b/stories/documentation/framework/patterns/collections-and-cards.md`

---

## Zone 3a — Child View Header (within Focus Zone)

Always the first element in Focus. Never removed.

| Property | Value |
|---|---|
| Layout | `flex; align-items: flex-start; justify-content: space-between; gap: 1.6rem; padding: .4rem 0` |
| Patient name | `700 2.4rem/1.2` · `--neutral-prominent-stronger` |
| Sub text | `--body-m-regular` · `--neutral-prominent-base` · bullet-separated |
| Avatar | 40px circle with patient initials |

Left: back button + avatar + name + sub  
Right: secondary icon buttons + primary CTA (solid brand button)

---

## Zone 3b — Section Menu (within Focus Zone)

Always the second element in Focus. Never removed.

```css
.pd-sectionmenu__tabs {
  display: flex; align-items: center; gap: .4rem;
  background: white; border-radius: 1.2rem; padding: .6rem;
}
.pd-sectionmenu__tab[aria-selected="true"] {
  background: --brand-subtle-weak;
  color: --brand-prominent-strong;
  font: --body-m-bold;
  border-radius: .8rem;
}
```

Live tab (Health Observation active): pulsing green dot animation.

Market canonical tab sets — never deviate:

| Market | Tabs |
|---|---|
| EHR (FR/DE/IT full) | Health · Financial · Administrative · History |
| BMS-DE | Administrative · History · Documents · Notes |
| BMS-FR / BMS-IT | Administrative · History |

---

## Zone 3c — Tab Panels (CardCollections + Cards, within Focus Zone)

```css
.pd-cardcollection__header { display: flex; align-items: center; justify-content: space-between; }
.pd-cardcollection__title  { font: --title-m-bold; }
.pd-cardcollection__grid   { display: grid; gap: 1.2rem; }

.pd-card { background: white; border-radius: 1.2rem; padding: 1.6rem; }
.pd-card__title { font: --body-s-bold; text-transform: uppercase; letter-spacing: .04em; color: --neutral-prominent-weak; }
.pd-card__row   { display: flex; align-items: center; justify-content: space-between; padding: .8rem 0; border-bottom: .1rem solid --neutral-subtle-weak; }
```

Card `size`: `"small"` (half-width) | `"medium"` (full-width).

---

## Zone 4 — Toolbox

**Location:** Right side, contextual companion to Focus Zone  
**Official spec:** See `oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md`

> "Houses secondary actions, Workflow panels, and the Doctolib Assistant without cluttering the main workspace."

**Contents:**
- **ActionBar** (default): Contextual action cards for the current page/view
- **Workflow Panels**: Multi-step processes (consultation notes, prescriptions, billing, etc.)
- **Supplemental information**: Related docs, activity feeds, live consultation
- **AI Assistant** (when active)

**Behaviors:**
- Content is **always** dependent on what is displayed in the Focus Zone
- Persists only when it contains an active Workflow or the Doctolib Assistant
- **Sizing:** Four preset widths (Small, Medium, Large, Comfort)
  - Default width when hosting a Workflow Panel: 1/3 of available space
  - Comfort mode: 1/2 of available space

| Property | Value |
|---|---|
| Width | Variable (based on content mode) |
| Background | `white` |
| Border radius | `1.2rem` |
| Position | Fixed right |

### ActionBar Mode (default)

Shows contextual action cards relevant to the current Focus Zone content:

Example cards for Patient File:
- **Documents**: Clinical documents, prescriptions, referrals
- **Billing**: Invoice creation, payment tracking
- **Consultation**: Start consultation, consultation notes
- **Patient actions**: Messaging, tasks, exports

**Rule:** ActionBar cards trigger Workflow Panels that open in the same Toolbox space, replacing the ActionBar temporarily.

### Workflow Panel Mode

When an ActionBar card is clicked, the Toolbox transitions to show a Workflow Panel:

**Structure:** Header (label + back + actions + close) → Body (scrollable) → Footer (cancel + alternative + confirm)

**Use for:** Multi-step workflows, consultation note creation, referral letter generation, prescription editing, billing  
**Do not use for:** Read-only detail views, content that fits in a Card

Panel spec → `oxygen/packages/b2b/src/overlays/Overlays.guidelines.md`

---

## Module Placement Rules

| Module type | Zone | Component |
|---|---|---|
| Patient identity | Focus Zone / ChildViewHeader | Always present |
| Tab navigation | Focus Zone / SectionMenu | Always present |
| Identity & contact | Focus Zone / Overview tab / CardCollection | QuickEdit fields |
| Clinical summary | Focus Zone / Health tab / CardCollection | Cards |
| Medication list | Focus Zone / Health tab / CardCollection | Cards + InlineButton (Renew) |
| Appointment history | Focus Zone / Overview or History tab / CardCollection | Cards |
| Documents | Focus Zone / Documents tab / CardCollection | Cards + InlineButton |
| Consultation actions | Toolbox / ActionBar | Action card that triggers Workflow Panel |
| Billing actions | Toolbox / ActionBar | Action card that triggers Workflow Panel |
| Consultation note | Toolbox / Workflow Panel | Triggered by ActionBar card or primary CTA |
| Referral letter | Toolbox / Workflow Panel | Triggered by ActionBar card |
| Prescription | Toolbox / Workflow Panel | Triggered by ActionBar card |
| Alerts / contraindications | Focus Zone / ChildViewHeader or top CardCollection | Tag or status pill |

---

## Forbidden Patterns

- ❌ Removing or collapsing Top Bar, OS Menu, Focus Zone, or SectionMenu
- ❌ Page-specific content in the Top Bar (it's for global functions only)
- ❌ Patient record content in the Top Bar
- ❌ Tabs outside the canonical market set (without explicit approval)
- ❌ Modal for Workflow Panel content (use Toolbox Workflow Panel instead)
- ❌ Form fields in ChildViewHeader (except inline QuickEdit)
- ❌ Navigation actions in the Toolbox ActionBar (ActionBar is for contextual actions, not navigation)
- ❌ Extra columns or panels outside the three-zone layout (OS Menu, Focus Zone, Toolbox)

---

## Still needed (implementation details)

- [ ] Toolbox ActionBar card heights and internal spacing
- [ ] CardCollection grid column behavior (how small/medium cards reflow)
- [ ] Toolbox width transitions (ActionBar mode ↔ Workflow Panel mode)
- [ ] Comfort mode width calculations and breakpoints
- [ ] ChildViewHeader with alert banner variant
- [ ] SectionMenu overflow behavior (dropdown collapse when tabs don't fit)

---

## Official Documentation References

**Primary sources (Oxygen repo):**
```bash
# Page anatomy (official)
~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md

# Patient File pattern
~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/patient-file.md

# Collections and Cards pattern
~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/collections-and-cards.md
```

**Pro-frontend ActionBar implementation:**
```bash
# ActionBar v2 architecture (EHR DE)
~/doctolib/pro-frontend/docs/patient-file-v3/action-bar/action-bar-v2-architecture.md

# ActionBar extraction strategy (Unified PF v3)
~/doctolib/pro-frontend/docs/patient-file-v3/action-bar/action-bar-extraction-strategy.md
```

**Design reference:** [Figma - Patient File v3](https://www.figma.com/design/2MIdwyEW0Cj7rom3PQTpU6/-GUX--Review-File?node-id=7011-90599)

Last updated: 2026-06-03 (aligned with Oxygen page-anatomy.md)
