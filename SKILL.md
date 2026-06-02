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
pf-design-factory/boilerplate/patient-detail.composed.jsx                                             → Canonical composed components
pf-design-factory/boilerplate/patient-detail.css                                                      → PF shell CSS

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
pro-frontend/components/ActionBar/ActionBar.tsx
pro-frontend/components/Focus/Focus.tsx
pro-frontend/components/ChildViewHeader/ChildViewHeader.tsx
pro-frontend/components/ChildViewHeader/types.ts
pro-frontend/components/SectionMenu/SectionMenu.tsx
pro-frontend/components/CardCollection/CardCollection.tsx
pro-frontend/components/CardCollection/types.ts
pro-frontend/components/QuickEdit/QuickEdit.tsx
pro-frontend/components/InlineButton/InlineButton.tsx
pro-frontend/components/InlineButton/InlineButtonText.tsx
pro-frontend/components/WorkflowPanel/WorkflowPanel.tsx
# CSS module files: grep on demand only — never read in full
```

> ⚠️ If any file is missing, stop and tell the user before proceeding.

**CSS files — never read in full.** Use targeted lookups only:
```bash
# Look up a specific token by name
grep -n "color-semantic-brand" ~/doctolib/oxygen/packages/tokens/src/tokens.css

# Look up a specific component's styles
grep -n "pd-card" ~/doctolib/pf-design-factory/boilerplate/patient-detail.css

# Look up a CSS module class
grep -n "actionBar\|workspace" ~/doctolib/pro-frontend/components/ActionBar/ActionBar.module.css
```
Never `cat` `tokens.css`, `_components.css`, or any `.css` file in full — they are too large and will waste context.

---

## Tech stack

All prototypes use the React/Babel stack from `pf-design-factory/boilerplate/prototype/`. Always reference shared files by relative path — never copy CSS into cluster folders.

```html
<!-- From boilerplate/ — reference by relative path, never copy -->
<link rel="stylesheet" href="../../boilerplate/_base.css">
<link rel="stylesheet" href="../../boilerplate/_components.css">
<link rel="stylesheet" href="../../boilerplate/patient-detail.css">

<!-- JS runtime from CDN -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<script src="../../boilerplate/icon-sprite.js"></script>

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

Every prototype must use this exact tree. Read `pf-design-factory/boilerplate/patient-detail.app.jsx` for the live reference.

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
cat ~/doctolib/pf-design-factory/boilerplate/patient-detail.composed.jsx
cat ~/doctolib/pf-design-factory/boilerplate/patient-detail.css

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
cat ~/doctolib/pro-frontend/components/ActionBar/ActionBar.tsx
cat ~/doctolib/pro-frontend/components/Focus/Focus.tsx
cat ~/doctolib/pro-frontend/components/ChildViewHeader/ChildViewHeader.tsx
cat ~/doctolib/pro-frontend/components/ChildViewHeader/types.ts
cat ~/doctolib/pro-frontend/components/SectionMenu/SectionMenu.tsx
cat ~/doctolib/pro-frontend/components/CardCollection/CardCollection.tsx
cat ~/doctolib/pro-frontend/components/CardCollection/types.ts
cat ~/doctolib/pro-frontend/components/QuickEdit/QuickEdit.tsx
cat ~/doctolib/pro-frontend/components/InlineButton/InlineButton.tsx
cat ~/doctolib/pro-frontend/components/InlineButton/InlineButtonText.tsx
cat ~/doctolib/pro-frontend/components/WorkflowPanel/WorkflowPanel.tsx
# CSS module files: grep on demand only — never cat in full

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

Also ask — for every cluster — these challenge questions:
- What does the current generic PF get wrong for this cluster/persona?
- Are there modules in the current PF that are irrelevant for this cluster?
- What critical information is missing from the current PF for this persona?
- What's the single most important action this persona needs to take in the PF?

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

**STOP. Before writing a single line of code, run these commands:**
```bash
cp boilerplate/patient-detail.primitives.jsx prototypes/[cluster]/[cluster].primitives.jsx
cp boilerplate/patient-detail.composed.jsx prototypes/[cluster]/[cluster].composed.jsx
cp boilerplate/patient-detail.app.jsx prototypes/[cluster]/[cluster].app.jsx
cp boilerplate/patient-detail.css prototypes/[cluster]/[cluster].css
```

**Verify the files exist on disk before proceeding:**
```bash
ls prototypes/[cluster]/
```

Only after these 4 files exist, adapt them for the cluster. Never create them from scratch.

**Custom CSS is forbidden.** The only content allowed in `[cluster].css` is cluster-specific overrides that genuinely don't exist in the boilerplate. If you find yourself writing layout, colors, typography, or component styles — stop immediately. Those already exist in `_base.css`, `_components.css`, and `patient-detail.css`. Use the existing `pd-*` class names instead.

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

### Viewing prototypes

Never open HTML files directly in the browser — this causes CORS errors with local script loading.

Always serve via a local HTTP server:
```bash
cd ~/doctolib/pf-design-factory/prototypes
npx serve .
# then open http://localhost:3000/[cluster]/[cluster].html
```

Or with Python:
```bash
cd ~/doctolib/pf-design-factory/prototypes
python3 -m http.server 3000
# then open http://localhost:3000/[cluster]/[cluster].html
```

### Step 6 — Verify prototype (mandatory before presenting output)

After generating, verify all files load correctly and there are no console errors:

```bash
# Check all referenced files exist
grep -oE '(src|href)="[^"]+"' ~/doctolib/pf-design-factory/prototypes/[cluster]/[cluster].html | \
  grep -v "^http" | sed 's/(src|href)="//g' | sed 's/"//g' | while read f; do
    full="~/doctolib/pf-design-factory/prototypes/[cluster]/$f"
    [ ! -f "$full" ] && echo "❌ MISSING: $f"
  done

# Check JSX files for obvious syntax errors
node --input-type=module < ~/doctolib/pf-design-factory/prototypes/[cluster]/[cluster].app.jsx 2>&1 | grep -i error
```

Fix any missing files or errors before presenting the output. Most common issues:
- Wrong relative path to boilerplate (`../../boilerplate/preview/` not `./` or absolute)
- Component imported but not defined
- Missing required props on a component
- JSX syntax error in generated code

Only present the prototype to the user once it loads without errors.

### Step 7 — Update master index

Update `prototypes/index.html` with the new cluster:
- Name, market/persona, feature count, date generated
- Link to cluster entry point
- Styled with Oxygen DS, PF visual language

---

## Hard constraints

### What the agent must never change
- The foundational shell zones (topbar, ActionBar, Focus, SectionMenu, WorkflowPanel)
- The component vocabulary (Oxygen + pro-frontend only)
- The market canonical tab set (unless explicitly asked to challenge it)

### What the agent is expected to challenge
The existing PF content, modules, and architecture are **not** a template to replicate. The agent should actively question:
- Does this module need to exist for this cluster/persona?
- Is this the right tab for this content?
- Can two existing modules be merged into one?
- Is there a missing module the current PF doesn't have but this cluster needs?
- Is the current information hierarchy optimal for this persona's workflow?

**The goal is the best possible PF for this cluster — not a copy of the generic PF with new content slotted in.**
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
~/doctolib/pf-design-factory/boilerplate/_base.css
~/doctolib/pf-design-factory/boilerplate/_components.css
~/doctolib/pf-design-factory/boilerplate/patient-detail.css
~/doctolib/pf-design-factory/boilerplate/icon-sprite.js
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
