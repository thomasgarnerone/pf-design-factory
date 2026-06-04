# Patient File Design Skill
**Skill ID:** `patient-file-design`
**Runtime:** Claude Code
**Owner:** Doctolib Design System — DS Core
**Version:** 0.6 (HTML + Boilerplate)

---

## What we're trying to achieve

**Goal:** Test different Patient File information architectures (tab structures, module placement) with real users before committing to implementation.

**Why:** Different personas (osteopath, cardiologist, dentist) and markets (FR, DE, IT) have different workflows. We need to validate that our tab structure and module placement actually match how practitioners work, not just replicate existing patterns.

**Output:** Interactive HTML prototypes that stakeholders can click through and test, comparing multiple architecture options side-by-side.

---

## Approach

### 1. Architecture Iteration Process (BEFORE building anything)

For each prototype request:

1. **Generate 3 distinct architecture options:**
   - **Option A (Conservative):** Stays close to canonical tabs (Santé, Finance, Historique, Administratif)
   - **Option B (Optimized):** Workflow-optimized tabs (e.g., Séances, Paiements, Dossier for osteopaths)
   - **Option C (Radical):** Challenges assumptions (e.g., Treatment Plan, Session Journey)

2. **For each option, document:**
   - Tab structure
   - Module placement table
   - Rationale (why this serves the user's workflow)
   - Trade-offs (what you gain/lose vs. other options)

3. **Ask validation questions:**
   - "Does placing [Module X] in [Tab Y] match practitioner workflow?"
   - "Should [Module A] and [Module B] be co-located? Why?"
   - "Which option minimizes tab switching for the most common tasks?"

4. **User selects** which 2 options to prototype (usually A + B)

### 2. Build HTML Prototype

Create a **single HTML file** with:
- ✅ Both architecture options (Option A and Option B tabs)
- ✅ Variant switcher at the top to toggle between options
- ✅ Real-looking content using boilerplate components
- ✅ Patient File layout (OS Menu, Top Bar, Focus Zone, Toolbox)

### 3. Document decisions

Create `DECISIONS.md` in the prototype folder explaining:
- Context (persona, market, priority)
- Options explored
- Rationale for each option
- Validation plan

---

## Technical approach: HTML + Boilerplate

**⚠️ CRITICAL: ALWAYS use boilerplate HTML components. NEVER create custom HTML/CSS.**

### What is boilerplate?

Located in `/Users/thomas.garnerone/doctolib/pf-design-factory/boilerplate/`:
- `colors_and_type.css` - Oxygen tokens and typography
- `base.css` - Base styles
- `components.css` - All Oxygen component styles
- Individual component HTML files showing exact markup patterns

### Why boilerplate?

✅ **Real components** - Same HTML/CSS that will go to production  
✅ **All features included** - Accessibility, keyboard nav, hover states  
✅ **Maintained by DS team** - Automatically updated when design system changes  
✅ **No recreation** - Just copy existing markup patterns  
✅ **Visual accuracy** - Looks identical to production  

❌ **Never create custom HTML/CSS** - Always copy from boilerplate

---

## Prototype structure

Each prototype is a **single HTML file** in `prototypes/<name>/`:

```
prototypes/osteopath-fr-non-reimbursed/
├── index.html           # ⭐ Single HTML prototype with both options
├── DECISIONS.md         # Architecture rationale
└── README.md           # What this prototype tests
```

**To view:**
```bash
# Open in browser
open prototypes/osteopath-fr-non-reimbursed/index.html
```

No build step, no npm install, no dependencies. Just HTML.

---

## Creating a new prototype

### Step 1: Copy boilerplate shell template

Start from an existing prototype (e.g., `osteopath-fr-non-reimbursed/index.html`) which already has:
- OS Menu (left sidebar navigation)
- Top Bar (global functions)
- Focus Zone (patient info, tabs, content)
- Toolbox (right sidebar with actions)
- Variant switcher
- All boilerplate CSS linked

### Step 2: Update patient info

Edit the ChildViewHeader section:
```html
<div class="cvh">
  <div class="cvh__lead">
    <button class="cvh__back">←</button>
    <div class="cvh__avatar">SM</div>
    <div class="cvh__info">
      <h1 class="cvh__title">Sophie Mercier</h1>
      <div class="cvh__meta">38 ans · F · Patiente depuis 2023</div>
    </div>
  </div>
</div>
```

### Step 3: Define Option A tabs

Copy boilerplate SectionMenu markup:
```html
<!-- Option A container -->
<div class="variant-container" data-variant="a">
  <div class="pfm">
    <div class="pfm__main">
      <div class="mh">
        <div class="tabs">
          <button class="tab is-active" data-tab="sante">Santé</button>
          <button class="tab" data-tab="finance">Finance</button>
          <button class="tab" data-tab="historique">Historique</button>
          <button class="tab" data-tab="administratif">Administratif</button>
        </div>
      </div>
      
      <!-- Panel: Santé -->
      <div class="panel is-active" data-panel="sante">
        <!-- Module content using boilerplate cards -->
      </div>
    </div>
  </div>
</div>
```

### Step 4: Define Option B tabs

Same structure but with different tabs:
```html
<!-- Option B container -->
<div class="variant-container" data-variant="b" style="display:none">
  <div class="pfm">
    <div class="pfm__main">
      <div class="mh">
        <div class="tabs">
          <button class="tab is-active" data-tab="seances">Séances</button>
          <button class="tab" data-tab="paiements">Paiements</button>
          <button class="tab" data-tab="dossier">Dossier</button>
        </div>
      </div>
      
      <!-- Panels for Option B -->
    </div>
  </div>
</div>
```

### Step 5: Add variant switcher JavaScript

Already included in the template - switches between Option A and Option B containers.

### Step 6: Fill in module content

Use boilerplate card components from `boilerplate/cards.html`:
```html
<div class="panel" data-panel="sante">
  <div class="card-collection">
    <div class="card-collection__header">
      <h2 class="card-collection__title">Suivi ostéopathique</h2>
      <button class="ox-inlinebutton">Ajouter</button>
    </div>
    
    <div class="card-grid">
      <div class="card card--size-medium">
        <div class="card__title">Dernières séances</div>
        <div class="card__row">
          <span>15 mai 2026</span>
          <span class="card__meta">Lombalgie chronique</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Step 7: Create DECISIONS.md

Document why you chose these architectures:

```markdown
# Architecture Decisions

**Prototype:** Osteopath France (Non-reimbursed)

## Context
- Persona: Osteopath
- Market: France, non-reimbursed
- Priority: Efficiency over consistency
- Key insight: "They bill at every session"

## Options Explored

### Option A: Conservative (4 tabs)
Santé | Finance | Historique | Administratif

Rationale: Familiar structure...

Trade-offs:
- ✅ Matches existing pattern
- ❌ Session → billing requires 2 tab switches

### Option B: Optimized (3 tabs)
Séances | Paiements | Dossier

Rationale: Session-centric workflow...

Trade-offs:
- ✅ Session → billing = 1 tab switch
- ❌ Diverges from canonical structure
```

---

## Boilerplate component reference

**Key components to copy from:**

| Component | Boilerplate file | What to copy |
|-----------|-----------------|--------------|
| Tabs (SectionMenu) | `sectionmenu.html` | `.sm`, `.sm__list`, `.sm__tab`, `.sm__panel` |
| Patient header | `childviewheader.html` | `.cvh`, `.cvh__lead`, `.cvh__title` |
| Cards | `cards.html` | `.card`, `.card__title`, `.card__row` |
| Card collections | `cardcollection.html` | `.card-collection`, `.card-collection__header` |
| Buttons | `buttons.html` | `.ox-button--variant-solid`, `.ox-button--ui-brand` |
| Inline buttons | `inlinebutton.html` | `.ox-inlinebutton` |
| ActionBar | `actionbar.html` | `.pf-actionbar`, `.pf-actionbar__card` |
| OS Menu | `os-menu.html` | `.ox-osmenu`, `.ox-osmenu__item` |
| Top Bar | `top-bar.html` | `.ox-topbar` |

**Always check the boilerplate file first** before writing any HTML. Copy the exact class names and structure.

---

## Variant Switcher Pattern

**CRITICAL:** Every prototype must have a variant switcher to compare Option A vs Option B.

**Placement:** Top Bar (right side, between search and notifications)

**Why Top Bar:**
- Always visible (doesn't scroll away)
- Global view-mode control
- Keeps main content clean

**Implementation:** Copy from existing prototype's variant switcher code. JavaScript is already included to toggle between variants.

---

## DECISIONS.md requirement

**⚠️ CRITICAL:** Each prototype MUST have a `DECISIONS.md` file.

**What NOT to do:**
- ❌ Create a root-level `architecture-patterns.md` with "reusable patterns"
- ❌ Treat architectures as universal solutions

**What to do:**
- ✅ Create `prototypes/<name>/DECISIONS.md` per prototype
- ✅ Document context-specific rationale (persona + market + workflows)
- ✅ Explain WHY this architecture fits THIS use case

**Rationale:** Tab structures depend on:
- Persona (osteopath workflow ≠ cardiologist workflow)
- Market (FR requirements ≠ DE requirements)
- User needs (efficiency vs. consistency)
- Device (desktop vs. mobile)

There are NO universal tab structures. Every prototype's decisions are context-specific.

---

## Interaction Patterns

**OPTIONAL but recommended:** Add basic interactivity to make the prototype feel real.

**Patterns to consider:**

1. **Tab switching** - Already included in template
2. **QuickEdit** - Inline editing for contact info (copy from boilerplate `quickedit.html`)
3. **Button actions** - Toast notifications on button click
4. **Card expansion** - Show/hide details

**Implementation:** Copy JavaScript from existing prototypes. Keep it simple - just enough to demonstrate the interaction.

---

## Workflow summary

```
1. User requests prototype → Read cluster/market context
2. Generate 3 architecture options → Document in draft
3. Ask validation questions → User answers
4. User selects 2 options to prototype (usually A + B)
5. Copy boilerplate shell template → Start new HTML file
6. Build Option A tabs + content using boilerplate components
7. Build Option B tabs + content using boilerplate components
8. Test variant switcher → Both options work
9. Create DECISIONS.md → Document rationale
10. Commit → Push to pf-design-factory
```

---

## Required reading (before every task)

```bash
# Pull all repos
cd ~/doctolib/pf-design-factory && git pull
cd ~/doctolib/oxygen && git pull
cd ~/doctolib/pro-frontend && git pull
```

**Read in order:**

1. `pf-design-factory/pf-layout.md` - Layout structure reference
2. `pf-design-factory/prototypes/<similar-prototype>/index.html` - Working example
3. `pf-design-factory/boilerplate/sectionmenu.html` - Tab component markup
4. `pf-design-factory/boilerplate/cards.html` - Card component markup
5. `pf-design-factory/boilerplate/cardcollection.html` - Card collection markup

**Oxygen docs** (if needed for deep reference):
- `oxygen/packages/b2b/stories/documentation/framework/foundations/page-anatomy.md`
- `oxygen/packages/b2b/stories/documentation/framework/patterns/patient-file.md`

---

## Success criteria

A prototype is ready when:

✅ Uses only boilerplate HTML/CSS (no custom components)  
✅ Has variant switcher working (can toggle Option A ↔ Option B)  
✅ Both options have realistic content (not just placeholders)  
✅ Follows pf-layout.md structure (OS Menu, Top Bar, Focus Zone, Toolbox)  
✅ Has DECISIONS.md documenting the rationale  
✅ Opens in browser and looks like real Patient File  
✅ Stakeholders can click tabs and see content  

---

## Anti-patterns (DON'T DO THIS)

❌ Creating custom HTML/CSS instead of using boilerplate  
❌ Building React apps instead of simple HTML  
❌ Creating "universal architecture patterns" at repo root  
❌ Skipping the architecture iteration process  
❌ Building only one option (always compare at least 2)  
❌ Hardcoding styles instead of using boilerplate classes  
❌ Forgetting the variant switcher  
❌ No DECISIONS.md file  

---

Last updated: 2026-06-04
