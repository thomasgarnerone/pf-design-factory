# Patient File Design Skill
**Skill ID:** `patient-file-design`
**Runtime:** Claude Code
**Owner:** Doctolib Design System — DS Core
**Version:** 0.5 (pure HTML/CSS)

---

## What this skill does

Given a feature list with priorities for a cluster, market, or persona:

1. Pulls latest sources from all three repos
2. Reads live component specs and guidelines
3. Asks targeted clarifying questions before designing anything
4. Challenges the existing PF content — does not replicate it
5. Generates a hi-fi HTML/CSS prototype by adapting the B2B shell template
6. Verifies the output before presenting it

---

## Output strategy

**Pure HTML/CSS — no React, no JSX, no build step.**

Every prototype is built by:
1. Copying `boilerplate/B2B_Settings_Page_Template.html` as the starting point
2. Removing the settings sidebar (`.ox-sb`) — not used in PF
3. Replacing the page header with `PatientFileHeader`
4. Replacing the main content area with PF `CardCollections` and `Cards`
5. Adapting the WorkflowPanel content for the cluster
6. Referencing shared CSS files by relative path — never copying or rewriting them

The prototype opens directly in a browser with `python3 -m http.server 3000`. No CORS issues, no build step, no custom CSS.

---

## Boilerplate structure

```
boilerplate/
├── B2B_Settings_Page_Template.html  ← shell to copy and adapt
├── base.css                         ← Oxygen base styles (1rem = 10px)
├── colors_and_type.css              ← color + typography tokens
├── components.css                   ← all Oxygen component CSS classes
└── tokens.css                       ← full design token set
```

**Never modify these files. Never copy their content inline. Reference by relative path only.**

The template already handles all 4 workspace states via CSS classes:
- Default: `<div class="ws">`
- With workflow panel: `<div class="ws has-workflow">`
- With focus panel: `<div class="ws has-focus">`
- Both: `<div class="ws has-workflow has-focus">`

---

## Required reading (load before every task)

Pull all repos first:
```bash
cd ~/doctolib/pf-design-factory && git pull
cd ~/doctolib/oxygen && git pull
cd ~/doctolib/pro-frontend && git pull
```

Then read in this order:

```
# PF factory
pf-design-factory/pf-layout.md
pf-design-factory/oxygen-ds.md

# B2B framework foundations (oxygen)
oxygen/packages/b2b/stories/documentation/framework/foundations/design-principles.md
oxygen/packages/b2b/stories/documentation/framework/foundations/grid-and-layout.md
oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md
oxygen/packages/b2b/stories/documentation/framework/foundations/style-and-theme.md
oxygen/packages/b2b/stories/documentation/framework/foundations/keyboard-navigation.md

# B2B framework patterns (oxygen)
oxygen/packages/b2b/stories/documentation/framework/patterns/collections-and-cards.md
oxygen/packages/b2b/stories/documentation/framework/patterns/navigation-patterns.md
oxygen/packages/b2b/stories/documentation/framework/patterns/patient-file.md
oxygen/packages/b2b/stories/documentation/framework/patterns/data-management.md
oxygen/packages/b2b/stories/documentation/framework/patterns/ai-features.md

# Component code + guidelines (oxygen — code first, then guidelines)
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

# PF component specs + implementations (pro-frontend)
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
pro-frontend/components/WorkflowPanel/WorkflowPanel.tsx
# CSS module files: grep on demand only — never cat in full
```

> ⚠️ If any file is missing, stop and tell the user before proceeding.

**CSS files — never read in full. Grep for specific tokens or class names only:**
```bash
grep -n "color-semantic-brand" ~/doctolib/oxygen/packages/tokens/src/tokens.css
grep -n "ox-card\|ox-button" ~/doctolib/pf-design-factory/boilerplate/components.css
```

---

## Component source hierarchy

For every UI element, check in this order:
1. **`oxygen/`** — DS compliance baseline, always check first
   - Read `.tsx` source for props and structure
   - Read `.guidelines.md` for correct usage
2. **`pro-frontend/`** — PF-specific overrides and B2B extensions
   - Specs in `specs/` for design intent
   - Implementations in `components/` for props and HTML structure
3. If neither covers it: flag as `⚠️ DS Gap: [name]`

---

## Visual reference

Before generating, read the reference screenshots in `pf-layout-examples/`:

| File | Child view | HO active | Workflow panel |
|---|---|---|---|
| `cv-ho-wf.png` | ✅ | ✅ | ✅ |
| `cv-ho.png` | ✅ | ✅ | ❌ |
| `cv-wf.png` | ✅ | ❌ | ✅ |
| `cv.png` | ✅ | ❌ | ❌ |
| `ho-wf.png` | ❌ | ✅ | ✅ |
| `ho.png` | ❌ | ✅ | ❌ |
| `wf.png` | ❌ | ❌ | ✅ |
| `default.png` | ❌ | ❌ | ❌ |

---

## Workflow

### Step 1 — Pull and read

Pull all repos and read all required files listed above before doing anything else.

---

### Step 2 — Parse the feature list

User input format:
```
Cluster: [name]
Market / Persona: [optional]

Features:
- [Feature name] | Priority: [P0/P1/P2] | Notes: [optional]
```

Map each feature to: **Tab → CardCollection → Card → HTML pattern**

---

### Step 3 — Mandatory clarification phase

**Never skip.** Ask grouped questions about:

- Tab placement for ambiguous features
- Data model gaps (what fields? what states?)
- Navigation: new tab vs. card vs. WorkflowPanel?
- Market canonical tab set:

| Market | Tabs |
|---|---|
| EHR (FR/DE/IT full) | Health · Financial · Administrative · History |
| BMS-DE | Administrative · History · Documents · Notes |
| BMS-FR / BMS-IT | Administrative · History |

- Priority conflicts, edge cases (empty state, loading, error)

Also ask — for every cluster:
- What does the current generic PF get wrong for this cluster/persona?
- Are there modules in the current PF that are irrelevant here?
- What critical information is missing from the current PF for this persona?
- What's the single most important action this persona needs to take?

Wait for answers. Never write code before this is resolved.

---

### Step 4 — Layout plan (requires approval)

```
Cluster: [name] · Market: [market]

Tabs:
├── [Tab 1] (default)
│   ├── CardCollection: "[name]"
│   │   └── Cards: [list with content type]
│   └── CardCollection: "[name]"
├── [Tab N]: ...

WorkflowPanel: [yes/no] → trigger: [action] → content: [description]
PatientFileHeader: [primary CTA, secondary actions]

Assumptions: [list any gaps filled without explicit input]
```

Wait for explicit approval before writing any code.

---

### Step 5 — Generate prototype

**STOP. Before writing a single line of HTML:**

```bash
mkdir -p prototypes/[cluster]
cp boilerplate/B2B_Settings_Page_Template.html prototypes/[cluster]/[cluster].html
```

Verify the file exists:
```bash
ls prototypes/[cluster]/
```

Then adapt `[cluster].html` by making only these changes:

1. **Remove** the entire `.ox-sb` settings sidebar block
2. **Replace** `.ws__pageheader` content with `PatientFileHeader` markup
3. **Replace** `.settings-content` with PF `CardCollections` and `Cards` using correct `ox-*` CSS classes from `components.css`
4. **Adapt** `.wp` (WorkflowPanel) content for the cluster's workflow
5. **Update** CSS `<link>` hrefs to point to `../../boilerplate/` files
6. **Remove** the variant switcher dev toolbar at the bottom

**Never:**
- Write custom CSS
- Inline styles beyond what the template already has
- Invent CSS class names — use only existing `ox-*` classes from `components.css`
- Modify the shell structure (topbar, OS menu, workspace grid)

**Content rules:**
- French-sounding patient names (Marie Leroy, Jean-Marc Dubois, Fatima Benali…)
- Realistic French/European medical context (CPAM, HbA1c, ordonnance, bilan sanguin…)
- No Lorem ipsum
- Each CardCollection opens with `<!-- MODULE: [name] -->`

---

### Step 6 — Verify

```bash
# Check all referenced CSS/JS files exist
grep -oE 'href="[^"]+"' prototypes/[cluster]/[cluster].html | \
  sed 's/href="//;s/"//' | grep -v "^http" | while read f; do
    [ ! -f "prototypes/[cluster]/$f" ] && echo "❌ MISSING: $f"
  done
```

Fix any missing file references before presenting. Then serve and verify no console errors:
```bash
cd prototypes && python3 -m http.server 3000
# open http://localhost:3000/[cluster]/[cluster].html
```

Only present the prototype once it loads without errors.

---

### Step 7 — Update master index

Update `prototypes/index.html`:
- Cluster name, market/persona, feature count, date
- Link to cluster entry point
- Styled with Oxygen DS

---

## Hard constraints

1. **Shell is immutable** — topbar, OS menu, workspace grid are never modified
2. **`PatientFileHeader` for patient identity** — never invent a custom header
3. **`ox-*` classes only** — from `components.css`; no custom CSS; no inline styles beyond the template
4. **No design without clarification** — Step 3 before Step 5, always
5. **Market tab sets are canonical** — never invent tabs without explicit approval
6. **Reference, never copy** — CSS files linked by relative path, never duplicated

---

## Output structure

```
pf-design-factory/
├── boilerplate/              ← shared shell (never modified)
│   ├── B2B_Settings_Page_Template.html
│   ├── base.css
│   ├── colors_and_type.css
│   ├── components.css
│   └── tokens.css
├── pf-layout-examples/       ← visual reference screenshots
│   ├── default.png
│   ├── cv.png
│   └── ...
└── prototypes/
    ├── index.html            ← master index
    └── [cluster]/
        └── [cluster].html    ← one file per cluster
```

---

## Example invocation

```
Use the patient-file-design skill.

Cluster: Non-reimbursed acts
Market: France B2B — BMS-FR (Administrative · History)
Persona: Osteopath, private practice, high volume of non-reimbursed acts

Features:
- Non-reimbursed act creation     | P0 | triggers WorkflowPanel
- Payment status tracking         | P0 | per act and per patient
- Price list management           | P1 | custom prices per act type
- Outstanding balance summary     | P0 | visible at a glance
- Invoice generation              | P1 | PDF, pre-filled
```
