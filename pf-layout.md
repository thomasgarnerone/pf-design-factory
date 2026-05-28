# Patient File — Foundational Layout Specification
**Status:** 🟡 Partially populated — structural zones extracted from prototype. Figma details still needed.  
**Live source:** `~/doctolib/oxygen/prototype/patient-detail.css` and `preview/patientfile*.html`  
**Repo:** `github.com/doctolib/pf-design-factory`

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│  pd-topbar  (5.6rem fixed, white, bottom border)         │
├──────────┬──────────────────────────────┬───────────────┤
│          │  Focus                        │               │
│ Action   │  ┌────────────────────────┐  │  Workflow     │
│ Bar      │  │ ChildViewHeader        │  │  Panel        │
│          │  ├────────────────────────┤  │  (optional)   │
│ 26rem    │  │ SectionMenu (tabs)     │  │  40rem        │
│ fixed    │  ├────────────────────────┤  │               │
│          │  │ Tab panels             │  │               │
│          │  │ (CardCollections)      │  │               │
└──────────┴──────────────────────────────┴───────────────┘
  Workspace: flex row, gap 1.6rem, padding 1.6rem, height 100%
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

## Zone 2 — Workspace

```css
.pd-workspace {
  display: flex;
  gap: 1.6rem;
  height: 100%;
  overflow: hidden;
  padding: 1.6rem;
}
.pd-workspace > * { transition: width .3s ease; }
```

Direct children only: ActionBar (fixed) + Focus (grows) + WorkflowPanel (fixed, optional).

---

## Zone 3 — Action Bar

| Property | Value |
|---|---|
| Width | `26rem` — `flex: none` |
| Background | `white` |
| Border radius | `1.2rem` |
| Padding | `1.2rem` |
| Overflow | `overflow-y: auto` |

Role: contextual navigation for the practitioner's daily workflow. Not patient record content.

Standard PF groups (from prototype):
- **Today:** My agenda (count), Waiting room (count), Messages (unread count)
- **Patients:** All patients, Starred, Recently seen
- **Practice:** Prescriptions, Documents, Settings

Must never contain: solid buttons, form fields, patient record content.

---

## Zone 4 — Focus

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

Contains in order: ChildViewHeader → SectionMenu → tab panels.

---

## Zone 4a — Child View Header

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

## Zone 4b — Section Menu

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

## Zone 4c — Tab Panels (CardCollections + Cards)

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

## Zone 5 — Workflow Panel (optional)

| Property | Value |
|---|---|
| Width | `40rem` — `flex: none` |
| Background | `white` |
| Border radius | `1.2rem` |
| Layout | `flex-direction: column; overflow: hidden` |

Use for: multi-step workflows, consultation note creation, referral letter generation, prescription editing.  
Do not use for: read-only detail views, content that fits in a Card.

Structure: Header (label + back + actions + close) → Body (scrollable) → Footer (cancel + alternative + confirm).

---

## Module Placement Rules

| Module type | Zone | Component |
|---|---|---|
| Patient identity | Focus / ChildViewHeader | Always present |
| Tab navigation | Focus / SectionMenu | Always present |
| Identity & contact | Overview / CardCollection | QuickEdit fields |
| Clinical summary | Health tab / CardCollection | Cards |
| Medication list | Health tab / CardCollection | Cards + InlineButton (Renew) |
| Appointment history | Overview or History / CardCollection | Cards |
| Documents | Documents tab / CardCollection | Cards + InlineButton |
| Consultation note | WorkflowPanel | Triggered by primary CTA |
| Referral letter | WorkflowPanel | Triggered by InlineButton |
| Alerts / contraindications | ChildViewHeader or top CardCollection | Tag or status pill |
| Daily workflow nav | ActionBar | Navigation cards only |

---

## Forbidden Patterns

- ❌ Removing or collapsing TopBar, ActionBar, Focus, or SectionMenu
- ❌ Solid/primary buttons in the ActionBar
- ❌ Patient record content in the TopBar
- ❌ Tabs outside the canonical market set (without explicit approval)
- ❌ Modal for WorkflowPanel content
- ❌ Form fields in ChildViewHeader (except inline QuickEdit)
- ❌ Extra columns or panels outside the Workspace flex row

---

## Still needed (from Figma)

- [ ] ActionBar card heights and internal spacing
- [ ] CardCollection grid column behavior (how small/medium cards reflow)
- [ ] WorkflowPanel width variants (narrow / expanded)
- [ ] ChildViewHeader with alert banner variant
- [ ] SectionMenu overflow behavior (dropdown collapse when tabs don't fit)
- [ ] Health Observation side panel at < 1280px breakpoint

---

## Live reference

```bash
# Read live layout source
cat ~/doctolib/oxygen/prototype/patient-detail.css
open ~/doctolib/oxygen/preview/patientfileheader.html
open ~/doctolib/oxygen/preview/patientfilemenu.html
open ~/doctolib/oxygen/preview/patientfileactionbar.html
```

Figma file: [add link]  
Last reviewed: 2026-05-12
