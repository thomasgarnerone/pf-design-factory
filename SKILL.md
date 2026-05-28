# Patient File Design Skill
**Skill ID:** `patient-file-design`  
**Runtime:** Claude Code  
**Owner:** Doctolib Design System — DS Core  
**Version:** 0.4 (three-repo)

---

## What this skill does

Given a feature list with priorities for a cluster, market, or persona, this skill:

1. Reads live sources from disk — Oxygen DS, pro-frontend B2B specs, PF layout spec, guidelines
2. Asks targeted clarifying questions before designing anything
3. Produces a hi-fi HTML/CSS/React prototype using the correct DS components (Oxygen or pro-frontend)
4. Enforces the PF foundational layout at all times

---

## Required reading (load before every task)

Read these files from disk before starting. All paths relative to `~/doctolib/`:

```
pf-design-factory/pf-layout.md                                                          → PF layout zones, CSS classes, hard constraints
pf-design-factory/oxygen-ds.md                                                          → Oxygen DS component reference
oxygen/README.md                                                                         → DS fundamentals (tokens, type, color, motion)
oxygen/prototype/patient-detail.composed.jsx                                             → Canonical composed components
oxygen/prototype/patient-detail.css                                                      → PF shell CSS

--- B2B framework foundations (oxygen) ---
oxygen/packages/b2b/stories/documentation/framework/foundations/design-principles.md
oxygen/packages/b2b/stories/documentation/framework/foundations/grid-and-layout.md
oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md
oxygen/packages/b2b/stories/documentation/framework/foundations/style-and-theme.md
oxygen/packages/b2b/stories/documentation/framework/foundations/keyboard-navigation.md

--- B2B framework patterns (oxygen) ---
oxygen/packages/b2b/stories/documentation/framework/patterns/collections-and-cards.md
oxygen/packages/b2b/stories/documentation/framework/patterns/navigation-patterns.md
oxygen/packages/b2b/stories/documentation/framework/patterns/patient-file.md
oxygen/packages/b2b/stories/documentation/framework/patterns/data-management.md
oxygen/packages/b2b/stories/documentation/framework/patterns/ai-features.md

--- Component code + guidelines (oxygen) ---
oxygen/packages/b2b/src/dataDisplay/Card/v2/Card.tsx
oxygen/packages/b2b/src/dataDisplay/Card/Card.guidelines.md
oxygen/packages/b2b/src/dataEntry/DataGrid/DataGrid.tsx
oxygen/packages/b2b/src/dataEntry/DataGrid/DataGrid.guidelines.md
oxygen/packages/b2b/src/actions/Filters/Filters.tsx
oxygen/packages/b2b/src/actions/Actions.guidelines.md
oxygen/packages/b2b/src/navigation/SidebarMenu/SidebarMenu.guidelines.md
oxygen/packages/b2b/src/navigation/Tabs/Tabs.guidelines.md
oxygen/packages/b2b/src/layout/Layout.guidelines.md
oxygen/packages/b2b/src/overlays/Overlays.guidelines.md
oxygen/packages/b2b/src/focusPanel/FocusPanel.guidelines.md
oxygen/packages/core/src/FocusPanel/FocusPanel.tsx
oxygen/packages/b2b/src/templates/PatientFilePageTemplate/PatientFilePageTemplate.tsx

--- PF component specs (pro-frontend) ---
pro-frontend/specs/patient-file-architecture.md
pro-frontend/specs/card-component-spec.md
pro-frontend/specs/card-collection-component-s*.md
pro-frontend/specs/quick-edit-component-spec.md
pro-frontend/specs/section-menu-component-sp*.md
pro-frontend/specs/workflow-panel-component-s*.md
pro-frontend/specs/patient-file-menu-component*.md
pro-frontend/specs/patient-file-header-status-pills/
pro-frontend/docs/patient-file-v3/action-bar/
pro-frontend/docs/pro-frontend-architecture.md
pro-frontend/docs/pro-app-shell-overview.md
pro-frontend/docs/pro-sdks-guidelines.md

--- PF component implementations (pro-frontend) ---
pro-frontend/components/Workspace/Workspace.tsx
pro-frontend/components/Workspace/Workspace.module.css
pro-frontend/components/ActionBar/ActionBar.tsx
pro-frontend/components/ActionBar/ActionBar.module.css
pro-frontend/components/Focus/Focus.tsx
pro-frontend/components/Focus/Focus.module.css
pro-frontend/components/ChildViewHeader/ChildViewHeader.tsx
pro-frontend/components/ChildViewHeader/types.ts
pro-frontend/components/SectionMenu/SectionMenu.tsx
pro-frontend/components/CardCollection/CardCollection.tsx
pro-frontend/components/CardCollection/types.ts
pro-frontend/components/QuickEdit/QuickEdit.tsx
pro-frontend/components/InlineButton/InlineButton.tsx
pro-frontend/components/InlineButton/InlineButtonText.tsx
pro-frontend/components/WorkflowPanel/WorkflowPanel.tsx
```

> ⚠️ If any file is missing, stop and tell the user before proceeding.

---

## Tech stack

All prototypes use the React/Babel stack from `oxygen/prototype/`. Always reference shared files by relative path — never copy CSS into cluster folders.

```html
<!-- From oxygen/preview/ — reference by relative path, never copy -->
<link rel="stylesheet" href="../../oxygen/preview/_base.css">
<link rel="stylesheet" href="../../oxygen/preview/_components.css">
<link rel="stylesheet" href="../../oxygen/prototype/patient-detail.css">

<!-- JS runtime from CDN -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<script src="../../oxygen/prototype/icon-sprite.js"></script>

<!-- Cluster-specific scripts -->
<script type="text/babel" src="[cluster].primitives.jsx"></script>
<script type="text/babel" src="[cluster].composed.jsx"></script>
<script type="text/babel" src="[cluster].app.jsx"></script>
```

**Conventions:**
- `1rem = 10px` (set in `_base.css`)
- All color/type/spacing via CSS custom properties from `_components.css`
- Component classes namespaced `pd-*`
- Icons via `<Icon name="..." size={16} />` — never foreign icon sets

---

## Canonical PF component hierarchy

Every prototype must use this exact tree. Read `oxygen/prototype/patient-detail.app.jsx` for the live reference.

```
<div class="pd-app">                      ← CSS grid: topbar (5.6rem) + workspace (1fr)
  <header class="pd-topbar">             ← Fixed top bar: brand + breadcrumb + user
  <Workspace actionBar={<ActionBar>}>    ← Flex row: ActionBar + Focus + optional WorkflowPanel
    <ActionBar groups={[...]}>           ← Left sidebar, 26rem, grouped navigation cards
    <Focus>                              ← Main column, flex, fills remaining width
      <ChildViewHeader                   ← Patient identity: name, meta, primary CTA
      <SectionMenu items={[tabs]}>       ← Horizontal tab bar + panel switcher
        <div id="[tab-id]">            ← One panel per tab
          <CardCollection label="...">  ← Named section with header actions
            <Card title="...">          ← Individual data module
              QuickEdit / InlineButton  ← Editable fields and contextual actions
    <WorkflowPanel>                      ← Optional right panel (forms, workflows)
```

Any feature must map to a node in this tree. Zones outside this tree are forbidden.

---

## Workflow

### Step 1 — Pull latest and read live sources

Before anything else, pull all three repos to ensure you're working from the latest sources:
```bash
cd ~/doctolib/oxygen && git pull
cd ~/doctolib/pro-frontend && git pull
cd ~/doctolib/pf-design-factory && git pull
```

Then read:
```bash
# pf-design-factory
cat ~/doctolib/pf-design-factory/pf-layout.md
cat ~/doctolib/pf-design-factory/oxygen-ds.md

# oxygen — core
cat ~/doctolib/oxygen/README.md
cat ~/doctolib/oxygen/prototype/patient-detail.composed.jsx
cat ~/doctolib/oxygen/prototype/patient-detail.css

# oxygen — B2B framework foundations
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/design-principles.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/grid-and-layout.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/style-and-theme.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/foundations/keyboard-navigation.md

# oxygen — B2B framework patterns
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/collections-and-cards.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/navigation-patterns.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/patient-file.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/data-management.md
cat ~/doctolib/oxygen/packages/b2b/stories/documentation/framework/patterns/ai-features.md

# oxygen — component code + guidelines
cat ~/doctolib/oxygen/packages/b2b/src/dataDisplay/Card/v2/Card.tsx
cat ~/doctolib/oxygen/packages/b2b/src/dataDisplay/Card/Card.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/dataEntry/DataGrid/DataGrid.tsx
cat ~/doctolib/oxygen/packages/b2b/src/dataEntry/DataGrid/DataGrid.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/actions/Filters/Filters.tsx
cat ~/doctolib/oxygen/packages/b2b/src/actions/Actions.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/navigation/SidebarMenu/SidebarMenu.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/navigation/Tabs/Tabs.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/layout/Layout.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/overlays/Overlays.guidelines.md
cat ~/doctolib/oxygen/packages/b2b/src/focusPanel/FocusPanel.guidelines.md
cat ~/doctolib/oxygen/packages/core/src/FocusPanel/FocusPanel.tsx
cat ~/doctolib/oxygen/packages/b2b/src/templates/PatientFilePageTemplate/PatientFilePageTemplate.tsx

# pro-frontend — PF specs
cat ~/doctolib/pro-frontend/specs/patient-file-architecture.md
cat ~/doctolib/pro-frontend/specs/card-component-spec.md
cat ~/doctolib/pro-frontend/specs/card-collection-component-s*.md
cat ~/doctolib/pro-frontend/specs/quick-edit-component-spec.md
cat ~/doctolib/pro-frontend/specs/section-menu-component-sp*.md
cat ~/doctolib/pro-frontend/specs/workflow-panel-component-s*.md
cat ~/doctolib/pro-frontend/specs/patient-file-menu-component*.md
cat ~/doctolib/pro-frontend/docs/patient-file-v3/action-bar/*.md
cat ~/doctolib/pro-frontend/docs/pro-frontend-architecture.md
cat ~/doctolib/pro-frontend/docs/pro-app-shell-overview.md
cat ~/doctolib/pro-frontend/docs/pro-sdks-guidelines.md

# pro-frontend — PF component implementations
cat ~/doctolib/pro-frontend/components/Workspace/Workspace.tsx
cat ~/doctolib/pro-frontend/components/Workspace/Workspace.module.css
cat ~/doctolib/pro-frontend/components/ActionBar/ActionBar.tsx
cat ~/doctolib/pro-frontend/components/ActionBar/ActionBar.module.css
cat ~/doctolib/pro-frontend/components/Focus/Focus.tsx
cat ~/doctolib/pro-frontend/components/Focus/Focus.module.css
cat ~/doctolib/pro-frontend/components/ChildViewHeader/ChildViewHeader.tsx
cat ~/doctolib/pro-frontend/components/ChildViewHeader/types.ts
cat ~/doctolib/pro-frontend/components/SectionMenu/SectionMenu.tsx
cat ~/doctolib/pro-frontend/components/CardCollection/CardCollection.tsx
cat ~/doctolib/pro-frontend/components/CardCollection/types.ts
cat ~/doctolib/pro-frontend/components/QuickEdit/QuickEdit.tsx
cat ~/doctolib/pro-frontend/components/InlineButton/InlineButton.tsx
cat ~/doctolib/pro-frontend/components/InlineButton/InlineButtonText.tsx
cat ~/doctolib/pro-frontend/components/WorkflowPanel/WorkflowPanel.tsx
```

### Step 2 — Parse the feature list

User input format:
```
Cluster: [name]
Market / Persona: [optional]

Features:
- [Feature name] | Priority: [P0/P1/P2] | Notes: [optional]
```

Map each feature to: **Tab → CardCollection → Card → Component type**

### Step 3 — Mandatory clarification phase

**Never skip.** Ask grouped questions about:
- Tab placement ambiguities
- Data model gaps (what fields? what states?)
- Navigation: new tab vs. card vs. WorkflowPanel?
- Market tab set confirmation:

| Market | Canonical tabs |
|---|---|
| EHR (FR/DE/IT full) | Health · Financial · Administrative · History |
| BMS-DE | Administrative · History · Documents · Notes |
| BMS-FR / BMS-IT | Administrative · History |

- Priority conflicts, edge cases (empty state, skeleton, error)

Wait for answers before writing any code.

### Step 4 — Layout plan (requires approval)

```
Cluster: [name] · Market: [market]

Tabs:
├── Overview (default)
│   ├── CardCollection: "[name]"
│   │   └── Cards: [list with component types]
│   └── CardCollection: "[name]"
├── [Tab N]: ...

WorkflowPanel: [yes/no] → trigger: [action] → content: [description]
ActionBar: [groups and items]

Assumptions: [list any gaps filled without explicit input]
```

Wait for explicit approval before writing code.

### Step 5 — Generate prototype

Output to `prototypes/[cluster]/`:

```
[cluster].html              ← entry point
[cluster].primitives.jsx    ← Icon, Button, IconButton, QuickEdit, InlineButton
[cluster].composed.jsx      ← ChildViewHeader, ActionBar, SectionMenu, CardCollection, Card, WorkflowPanel
[cluster].app.jsx           ← App() with cluster data, state, layout
[cluster].css               ← cluster-specific overrides only (shell from patient-detail.css)
```

**Content rules:**
- French-sounding patient names (Marie Leroy, Jean-Marc Dubois, Fatima Benali…)
- Realistic French/European medical context (CPAM, HbA1c, ordonnance, bilan sanguin…)
- Each CardCollection opens with `{/* MODULE: [name] */}`
- No Lorem ipsum anywhere

### Step 6 — Update master index

Update `prototypes/index.html` with the new cluster:
- Name, market/persona, feature count, date generated
- Link to cluster entry point
- Styled with Oxygen DS, PF visual language

---

## Hard constraints

1. **Layout is immutable** — all 5 zones (topbar, ActionBar, Focus, SectionMenu, WorkflowPanel) must be present and used correctly
2. **Component source hierarchy** — for every component, always:
   - Read the `.tsx` source first — props, types, and behavior are the ground truth
   - Read the `.guidelines.md` to understand correct usage, patterns, and anti-patterns
   - Check `oxygen/` first (DS compliance baseline), then `pro-frontend/` for PF-specific overrides
   - If neither has it: flag as `⚠️ DS Gap: [name]` and use closest existing component
   - Never use Bootstrap, Tailwind, MUI, or invented components
3. **No design without clarification** — Step 3 before Step 5, always
4. **Market tab sets are canonical** — never invent tabs without explicit approval
5. **Reference, don't copy** — CSS and boilerplate files are referenced by path, never duplicated into cluster folders

---

## Output structure

```
patient-file-skill/
├── SETUP.md
├── SKILL.md                    ← this file
├── oxygen-ds.md                ← DS component reference
└── prototypes/
    ├── index.html              ← master index (updated after each cluster)
    ├── cardiology/
    │   ├── cardiology.html
    │   ├── cardiology.primitives.jsx
    │   ├── cardiology.composed.jsx
    │   ├── cardiology.app.jsx
    │   └── cardiology.css
    └── [cluster]/
```

Shared files referenced from (never copied):
```
~/doctolib/oxygen/preview/_base.css
~/doctolib/oxygen/preview/_components.css
~/doctolib/oxygen/prototype/patient-detail.css
~/doctolib/oxygen/prototype/icon-sprite.js
```

---

## Example invocation (paste into Claude Code)

```
Use the patient-file-design skill.

Cluster: Cardiology
Market: France B2B — EHR (Health / Financial / Administrative / History)
Persona: Cardiologist, specialist, high appointment volume

Features:
- ECG results viewer           | P0 | PDF + structured data
- Medication history timeline  | P0
- Referral letter generation   | P1 | pre-filled from PF → WorkflowPanel
- Alerts / contraindications   | P0
- Appointment history 12mo     | P1
```
