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
4. **Proposes 3 architecture options** (see Architecture Iteration Process below)
5. **Validates module placement** with targeted questions for each option
6. Challenges the existing PF content — does not replicate it
7. Generates a hi-fi HTML/CSS prototype by adapting the B2B shell template
8. Verifies the output before presenting it

---

## Architecture Iteration Process

**CRITICAL: Before building any HTML, propose multiple architectures and validate with the user.**

### Step 1: Generate 3 architecture options

After understanding the cluster/market requirements, propose **3 distinct architectures**:

**Option A:** "Conservative" — stays close to existing PF patterns, uses canonical tabs (Santé, Finance, Historique, Administratif)

**Option B:** "Optimized" — rethinks tab structure based on user workflows, may introduce new tabs or merge existing ones

**Option C:** "Radical" — challenges assumptions, could use completely different navigation (e.g., "Treatment Plan", "Payment Journey", "Session History") if it better serves user needs

**For each option, provide:**
- Tab structure (list all tabs, even creative ones like "Banana" if they fit user needs)
- Module placement table showing which modules go in which tab
- Rationale: Why this structure serves the user's workflow
- Trade-offs: What you gain and what you lose vs. other options

**Example format:**
```markdown
## Option A: Conservative

**Tabs:** Santé | Finance | Historique | Administratif

**Module placement:**
| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi ostéopathique | Santé | Clinical tracking, standard placement |
| Motifs de consultation | Santé | Health-related, fits existing pattern |
| Factures récentes | Finance | Financial, standard placement |
| Solde patient | Finance | Financial, standard placement |

**Rationale:** Familiar to practitioners, matches existing EHR pattern, low learning curve.

**Trade-offs:** 
- ✅ Consistent with other markets
- ❌ May split related workflows across tabs
- ❌ Doesn't optimize for osteopath-specific journey

---

## Option B: Optimized

**Tabs:** Séances | Paiements | Dossier patient

**Module placement:**
| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi ostéopathique | Séances | Session-centric view |
| Motifs de consultation | Séances | Grouped with session tracking |
| Factures récentes | Paiements | All payment info in one place |
| Solde patient | Paiements | Financial overview |

**Rationale:** Optimized for osteopath workflow (sessions → payment → admin), reduces tab switching.

**Trade-offs:**
- ✅ Workflow-optimized
- ✅ Fewer tabs = less cognitive load
- ❌ Diverges from canonical structure
- ❌ Practitioners see different layout vs. other specialties

---

## Option C: Radical

[... and so on]
```

### Step 2: Ask validation questions for each module

**For each module in each option, ask:**

1. **Workflow fit:** "Does placing [Module X] in [Tab Y] match how practitioners actually work?"
2. **Alternatives:** "Could [Module X] live in [Alternative Tab] instead? Why/why not?"
3. **Dependencies:** "When practitioners use [Module X], what other info do they need visible? Should those be co-located?"
4. **Frequency:** "Is [Module X] used frequently or rarely? Does its placement reflect that priority?"
5. **Split risk:** "Are we splitting a single workflow across multiple tabs? Example: if billing requires clinical notes, do both need to be accessible without tab switching?"

**Example questions:**
```markdown
### Validation questions for Option B:

**Module: Suivi ostéopathique (in Séances tab)**
- Q: When reviewing session tracking, do practitioners need to see financial info (invoices) simultaneously?
- Q: Should session history and upcoming appointments be in the same view?
- Q: Is the term "Séances" clear, or would "Consultations" be more familiar?

**Module: Factures récentes (in Paiements tab)**
- Q: Do practitioners create invoices during a session, or after? If during, does this need to be in the same tab as clinical notes?
- Q: Should we show unpaid invoices prominently, or is the current "Solde patient" summary enough?
```

### Step 3: Iterate based on feedback

After presenting options and questions:
1. Listen to user feedback on what works/doesn't work
2. Refine the chosen option or create a hybrid
3. Re-validate any changes to module placement
4. Get explicit approval: "Shall I proceed with [Option X] / [Hybrid approach]?"

**Only after approval:** proceed to build the HTML/CSS prototype.

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

**CSS files (base.css, components.css, tokens.css):** Reference by relative path only. Never copy or modify.

**Component HTML files (*.html):** Copy the HTML structure and inline `<style>` blocks as needed. These contain component-specific styles not in components.css.

### Boilerplate component HTML files

The boilerplate/ directory contains ~70 component HTML files with exact structures and inline styles:

**Key files for Patient File prototypes:**
- `patientfilemenu.html` - PatientFileMenu with pill-style tabs (`.mh` > `.tabs` > `.tab`)
- `sectionmenu.html` - Generic SectionMenu with underline tabs
- `patientfileheader.html` - ChildViewHeader with patient identity
- `patientfileactionbar.html` - ActionBar with contextual cards
- `workflowpanel.html` - WorkflowPanel structure
- `cardcollection.html` - CardCollection layouts
- `os-menu.html` - OS Menu (left navigation)

**Rule:** Always check these files FIRST for component-specific HTML structure and CSS classes. Many components (like PatientFileMenu) use custom inline styles not in `components.css`.

To find available patterns:
```bash
ls ~/doctolib/pf-design-factory/boilerplate/*.html
```

---

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

## HTML cheat sheet — exact patterns to copy

These are the exact HTML structures to use. Copy them verbatim — do not invent alternatives.

### Avatar (patient initials)
```html
<span class="ox-avatar ox-avatar--medium ox-avatar--dark-primary">
  <span class="ox-avatar__circle">SM</span>
</span>
```
Sizes: `ox-avatar--xsmall` (24px) · `ox-avatar--small` (32px) · `ox-avatar--medium` (40px) · `ox-avatar--large` (48px)
Colors: `ox-avatar--dark-primary` (blue) · `ox-avatar--dark-red` · default (grey)

---

### Tabs

**For Patient File navigation, use PatientFileMenu pattern** (from `boilerplate/patientfilemenu.html`):

```html
<div class="pfm">
  <div class="pfm__main">
    <div class="mh">
      <div class="tabs" role="tablist">
        <button class="tab is-active" role="tab" aria-selected="true">Santé</button>
        <button class="tab" role="tab" aria-selected="false">Finance</button>
        <button class="tab" role="tab" aria-selected="false">Historique</button>
        <button class="tab" role="tab" aria-selected="false">Administratif</button>
      </div>
    </div>
    <div class="panel" role="tabpanel">
      <!-- content -->
    </div>
  </div>
</div>
```

Required CSS (copy from `patientfilemenu.html` inline styles):
```css
.pfm { display: flex; flex-direction: column; gap: .8rem; }
.pfm__main { display: flex; flex-direction: column; gap: .8rem; flex: 1; min-width: 0; }
.mh { background: #fff; border-radius: 1.2rem; padding: .6rem; }
.tabs { display: flex; align-items: center; gap: .4rem; }
.tab { padding: .8rem 1.2rem; border-radius: .8rem; border: none; background: transparent; cursor: pointer; }
.tab.is-active { background: var(--oxygen-color-semantic-brand-subtle-weak); color: var(--oxygen-color-semantic-brand-prominent-strong); font-weight: 600; }
.panel { background: #fff; border-radius: 1.2rem; padding: 2.4rem; flex: 1; overflow-y: auto; }
```

Tab switching JavaScript:
```javascript
document.querySelectorAll('.tabs').forEach(tablist => {
  tablist.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    tablist.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
  });
});
```

**For generic tabs elsewhere** (underline style), use `ox-tabs` pattern from `boilerplate/tabs.html`.

---

## Interaction Patterns

**CRITICAL: ALL buttons in prototypes MUST have functional interactions. No dead buttons.**

Prototypes must include:
- Full visual state transitions
- Form validation feedback
- Data persistence via localStorage
- Loading states and success/error messages

### 1. QuickEdit (Inline Edit)

**Pattern:** Click read-only field → edit mode → save/cancel

**HTML structure:**
```html
<div class="qe" data-field="phone">
  <div class="qe__read" onclick="enterEditMode(this)">
    <span class="qe__label">Téléphone</span>
    <span class="qe__value">06 12 34 56 78</span>
    <i class="fa-solid fa-pen qe__icon"></i>
  </div>
  <div class="qe__edit" style="display:none">
    <input type="tel" class="qe__input" value="06 12 34 56 78">
    <button class="qe__save" onclick="saveQuickEdit(this)"><i class="fa-solid fa-check"></i></button>
    <button class="qe__cancel" onclick="cancelQuickEdit(this)"><i class="fa-solid fa-xmark"></i></button>
  </div>
</div>
```

**JavaScript:**
```javascript
function enterEditMode(readEl) {
  const container = readEl.closest('.qe');
  const editEl = container.querySelector('.qe__edit');
  const input = editEl.querySelector('.qe__input');
  readEl.style.display = 'none';
  editEl.style.display = 'flex';
  input.focus();
  input.select();
}

function saveQuickEdit(btn) {
  const container = btn.closest('.qe');
  const input = container.querySelector('.qe__input');
  const valueEl = container.querySelector('.qe__value');
  const readEl = container.querySelector('.qe__read');
  const editEl = container.querySelector('.qe__edit');
  
  // Update value
  valueEl.textContent = input.value;
  
  // Persist to localStorage
  const field = container.dataset.field;
  localStorage.setItem(`patient_${field}`, input.value);
  
  // Show success feedback
  container.classList.add('qe--success');
  setTimeout(() => container.classList.remove('qe--success'), 1500);
  
  // Return to read mode
  editEl.style.display = 'none';
  readEl.style.display = 'flex';
}

function cancelQuickEdit(btn) {
  const container = btn.closest('.qe');
  const readEl = container.querySelector('.qe__read');
  const editEl = container.querySelector('.qe__edit');
  const input = editEl.querySelector('.qe__input');
  const valueEl = container.querySelector('.qe__value');
  
  // Reset input to original value
  input.value = valueEl.textContent;
  
  // Return to read mode
  editEl.style.display = 'none';
  readEl.style.display = 'flex';
}
```

**CSS:**
```css
.qe { position: relative; }
.qe__read { display: flex; align-items: center; gap: .8rem; padding: .8rem 1.2rem; border-radius: .6rem; cursor: pointer; transition: background .15s; }
.qe__read:hover { background: var(--oxygen-color-semantic-neutral-subtle-weak); }
.qe__read:hover .qe__icon { opacity: 1; }
.qe__label { font-weight: 600; color: var(--oxygen-color-semantic-neutral-prominent-weak); }
.qe__value { flex: 1; color: var(--oxygen-color-semantic-neutral-prominent-strong); }
.qe__icon { opacity: 0; font-size: 1.2rem; color: var(--oxygen-color-semantic-neutral-prominent-weak); transition: opacity .15s; }
.qe__edit { display: flex; gap: .6rem; align-items: center; padding: .8rem 1.2rem; }
.qe__input { flex: 1; padding: .6rem 1rem; border: .1rem solid var(--oxygen-color-semantic-neutral-subtle-strong); border-radius: .6rem; }
.qe__save, .qe__cancel { width: 3.2rem; height: 3.2rem; border: none; border-radius: .6rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qe__save { background: var(--oxygen-color-semantic-brand-prominent-base); color: white; }
.qe__cancel { background: var(--oxygen-color-semantic-neutral-subtle-weak); color: var(--oxygen-color-semantic-neutral-prominent-strong); }
.qe--success { animation: successPulse .4s ease-out; }
@keyframes successPulse { 0%, 100% { background: transparent; } 50% { background: var(--oxygen-color-semantic-positive-subtle-weak); } }
```

---

### 2. ActionBar → WorkflowPanel Transition

**Pattern:** Click ActionBar card → Toolbox shows WorkflowPanel → Close returns to ActionBar

**HTML structure:**
```html
<!-- Toolbox container -->
<aside class="ws__toolbox" id="toolbox">
  
  <!-- ActionBar (default state) -->
  <div class="pf-actionbar" id="actionbar">
    <div class="pf-actionbar__card" onclick="openWorkflowPanel('invoice')">
      <h3>Nouvelle facture</h3>
      <p>Créer une facture pour la consultation</p>
    </div>
  </div>
  
  <!-- WorkflowPanel (hidden by default) -->
  <div class="pf-workflow" id="workflow-invoice" style="display:none">
    <div class="pf-workflow__header">
      <button class="pf-workflow__back" onclick="closeWorkflowPanel('invoice')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h2>Nouvelle facture</h2>
      <button class="pf-workflow__close" onclick="closeWorkflowPanel('invoice')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="pf-workflow__body">
      <!-- Form content -->
    </div>
    <div class="pf-workflow__footer">
      <button onclick="closeWorkflowPanel('invoice')">Annuler</button>
      <button class="primary" onclick="submitWorkflow('invoice')">Créer la facture</button>
    </div>
  </div>
  
</aside>
```

**JavaScript:**
```javascript
function openWorkflowPanel(panelId) {
  // Hide ActionBar
  document.getElementById('actionbar').style.display = 'none';
  
  // Show WorkflowPanel
  const panel = document.getElementById(`workflow-${panelId}`);
  panel.style.display = 'flex';
  
  // Add class to workspace for layout adjustment
  document.querySelector('.ws').classList.add('has-workflow');
  
  // Focus first input
  const firstInput = panel.querySelector('input, select, textarea');
  if (firstInput) firstInput.focus();
}

function closeWorkflowPanel(panelId) {
  // Hide WorkflowPanel
  const panel = document.getElementById(`workflow-${panelId}`);
  panel.style.display = 'none';
  
  // Show ActionBar
  document.getElementById('actionbar').style.display = 'block';
  
  // Remove workflow class
  document.querySelector('.ws').classList.remove('has-workflow');
  
  // Reset form if needed
  const form = panel.querySelector('form');
  if (form) form.reset();
}

function submitWorkflow(panelId) {
  const panel = document.getElementById(`workflow-${panelId}`);
  const form = panel.querySelector('form');
  
  // Validate
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Persist to localStorage
  const storageKey = `workflow_${panelId}_${Date.now()}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
  
  // Show success message
  showToast('✓ Facture créée avec succès');
  
  // Close panel
  closeWorkflowPanel(panelId);
  
  // Optionally: update UI to show new item
  refreshDataDisplay(panelId, data);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

**CSS:**
```css
.pf-workflow { display: none; flex-direction: column; height: 100%; background: white; border-radius: 1.2rem; overflow: hidden; }
.pf-workflow__header { display: flex; align-items: center; gap: 1.2rem; padding: 1.6rem; border-bottom: .1rem solid var(--oxygen-color-semantic-neutral-subtle-weak); }
.pf-workflow__back, .pf-workflow__close { width: 3.2rem; height: 3.2rem; border: none; background: transparent; border-radius: .6rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pf-workflow__back:hover, .pf-workflow__close:hover { background: var(--oxygen-color-semantic-neutral-subtle-weak); }
.pf-workflow__header h2 { flex: 1; font: var(--oxygen-font-semantic-title-m-bold); margin: 0; }
.pf-workflow__body { flex: 1; overflow-y: auto; padding: 2.4rem; }
.pf-workflow__footer { display: flex; gap: 1.2rem; justify-content: flex-end; padding: 1.6rem; border-top: .1rem solid var(--oxygen-color-semantic-neutral-subtle-weak); }
.toast { position: fixed; bottom: 2.4rem; right: 2.4rem; padding: 1.2rem 2.4rem; background: var(--oxygen-color-semantic-positive-prominent-base); color: white; border-radius: .8rem; font-weight: 600; opacity: 0; transform: translateY(2rem); transition: all .3s ease-out; z-index: 9999; }
.toast.show { opacity: 1; transform: translateY(0); }
```

---

### 3. Button Click Actions

**Every button must have an onclick handler.** Common patterns:

**Add new item:**
```html
<button onclick="openWorkflowPanel('consultation')">Ajouter</button>
```

**View all / Navigate:**
```html
<button onclick="navigateToView('consultations')">Voir toutes les consultations</button>
```

**Card expansion:**
```html
<div class="card" onclick="expandCard(this)">
  <!-- card content -->
</div>
```

**JavaScript helpers:**
```javascript
function navigateToView(viewName) {
  console.log(`Navigate to: ${viewName}`);
  showToast(`Navigation vers ${viewName} (prototype)`);
}

function expandCard(card) {
  card.classList.toggle('is-expanded');
}

function deleteItem(itemId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
    localStorage.removeItem(itemId);
    showToast('✓ Élément supprimé');
    // Remove from DOM or refresh
    document.querySelector(`[data-id="${itemId}"]`)?.remove();
  }
}
```

---

### 4. Form Validation

**Required fields, pattern validation, custom validation:**

```html
<form id="invoice-form" onsubmit="return handleSubmit(event)">
  <div class="form-field">
    <label for="amount">Montant *</label>
    <input 
      type="number" 
      id="amount" 
      name="amount" 
      required 
      min="0" 
      step="0.01"
      oninput="validateAmount(this)"
    >
    <span class="error-message" style="display:none">Le montant doit être supérieur à 0</span>
  </div>
  
  <div class="form-field">
    <label for="email">Email patient</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      oninput="validateEmail(this)"
    >
    <span class="error-message" style="display:none">Email invalide</span>
  </div>
  
  <button type="submit" class="primary">Soumettre</button>
</form>
```

**JavaScript:**
```javascript
function validateAmount(input) {
  const error = input.parentElement.querySelector('.error-message');
  const isValid = input.value > 0;
  
  if (!isValid && input.value !== '') {
    input.classList.add('error');
    error.style.display = 'block';
  } else {
    input.classList.remove('error');
    error.style.display = 'none';
  }
  
  return isValid;
}

function validateEmail(input) {
  const error = input.parentElement.querySelector('.error-message');
  const isValid = input.checkValidity();
  
  if (!isValid && input.value !== '') {
    input.classList.add('error');
    error.style.display = 'block';
  } else {
    input.classList.remove('error');
    error.style.display = 'none';
  }
  
  return isValid;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  
  // Process form...
  return false;
}
```

**CSS:**
```css
.form-field { margin-bottom: 1.6rem; }
.form-field label { display: block; font-weight: 600; margin-bottom: .6rem; }
.form-field input, .form-field select, .form-field textarea { width: 100%; padding: .8rem 1.2rem; border: .1rem solid var(--oxygen-color-semantic-neutral-subtle-strong); border-radius: .6rem; }
.form-field input.error { border-color: var(--oxygen-color-semantic-danger-prominent-base); }
.error-message { display: block; color: var(--oxygen-color-semantic-danger-prominent-base); font-size: 1.2rem; margin-top: .4rem; }
```

---

### 5. Data Persistence (localStorage)

**Pattern:** Save form data, user preferences, session state

```javascript
// Save data
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('localStorage save failed:', e);
    return false;
  }
}

// Load data
function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('localStorage load failed:', e);
    return defaultValue;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Restore patient data
  const phone = loadFromLocalStorage('patient_phone');
  if (phone) {
    document.querySelector('[data-field="phone"] .qe__value').textContent = phone;
  }
  
  // Restore form drafts
  const draftInvoice = loadFromLocalStorage('draft_invoice');
  if (draftInvoice) {
    document.getElementById('invoice-form')?.fillForm(draftInvoice);
  }
});

// Auto-save drafts
function autosaveDraft(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('input', debounce(() => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    saveToLocalStorage(`draft_${formId}`, data);
    console.log('Draft saved');
  }, 1000));
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

---

### 6. Loading States

**Show feedback during async operations:**

```html
<button id="save-btn" onclick="saveWithLoading(this)">
  <span class="btn-text">Enregistrer</span>
  <span class="btn-spinner" style="display:none">
    <i class="fa-solid fa-spinner fa-spin"></i>
  </span>
</button>
```

```javascript
async function saveWithLoading(btn) {
  // Disable button
  btn.disabled = true;
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-spinner').style.display = 'inline-block';
  
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success
    showToast('✓ Enregistré avec succès');
  } catch (error) {
    showToast('✗ Erreur lors de l\'enregistrement');
  } finally {
    // Re-enable button
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline-block';
    btn.querySelector('.btn-spinner').style.display = 'none';
  }
}
```

---

### Checklist: Before Delivering Prototype

- [ ] All buttons have onclick handlers (no dead buttons)
- [ ] Tab switching works
- [ ] QuickEdit works on editable fields
- [ ] ActionBar cards open WorkflowPanels
- [ ] WorkflowPanel back/close buttons work
- [ ] Form validation provides feedback
- [ ] Submit actions persist to localStorage
- [ ] Success/error messages appear via toast
- [ ] Loading states during actions
- [ ] Data loads from localStorage on page load

---

### Card
```html
<div class="ox-card ox-card--outlined">
  <p class="ox-paragraph ox-paragraph--label">CARD TITLE</p>
  <!-- card content -->
</div>
```
Variants: `ox-card--outlined` · `ox-card--elevated` · `ox-card--solid`

---

### Button
```html
<!-- Solid brand (primary CTA) -->
<button class="ox-button ox-button--variant-solid ox-button--ui-brand ox-button--size-medium" type="button">
  <span class="ox-button__innerWrapper">
    <span class="ox-button__hoverEffect"></span>
    <span class="ox-button__activeEffect"></span>
    <span class="ox-button__contentWrapper">+ Nouvelle facture</span>
  </span>
</button>

<!-- Outlined brand -->
<button class="ox-button ox-button--variant-outlined ox-button--ui-brand ox-button--size-small" type="button">
  <span class="ox-button__innerWrapper">
    <span class="ox-button__hoverEffect"></span>
    <span class="ox-button__activeEffect"></span>
    <span class="ox-button__contentWrapper">Modifier</span>
  </span>
</button>

<!-- Transparent neutral (cancel) -->
<button class="ox-button ox-button--variant-transparent ox-button--ui-neutral ox-button--size-medium" type="button">
  <span class="ox-button__innerWrapper">
    <span class="ox-button__contentWrapper">Annuler</span>
  </span>
</button>
```

---

### Badge / Status pill
```html
<!-- Badges use --ui-* modifiers, not semantic color names -->
<span class="ox-badge ox-badge--ui-brand">En cours</span>
<span class="ox-badge ox-badge--ui-neutral">En attente</span>
<span class="ox-badge ox-badge--ui-informative">Nouveau</span>

<!-- For status colors (success/warning/danger) not in ox-badge, use inline token: -->
<span class="ox-badge" style="background:var(--oxygen-color-semantic-positive-prominent-base);color:#fff">Payé</span>
<span class="ox-badge" style="background:var(--oxygen-color-semantic-warning-prominent-base);color:#fff">Partiel</span>
<span class="ox-badge" style="background:var(--oxygen-color-semantic-danger-prominent-base);color:#fff">En retard</span>
```

---

### PF ActionBar (left panel inside workspace)
The B2B template has no ActionBar — it goes from OS menu straight to workspace. For PF, add an ActionBar as the first child of `.ws`. Add this CSS to the cluster's `<style>` block:
```css
.pf-actionbar {
  width: 26rem;
  flex: none;
  background: var(--oxygen-color-primitive-white);
  border-radius: 1.2rem;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
}
.pf-actionbar__heading {
  font: var(--oxygen-font-semantic-body-xs-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--oxygen-color-semantic-neutral-prominent-weak);
  padding: 0.8rem 0.4rem 0.4rem;
}
.pf-actionbar__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.2rem;
  border-radius: 0.6rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  font: var(--oxygen-font-semantic-body-m-regular);
  color: var(--oxygen-color-semantic-neutral-prominent-stronger);
  text-decoration: none;
}
.pf-actionbar__item:hover { background: var(--oxygen-color-semantic-neutral-subtle-weak); }
.pf-actionbar__item.is-active {
  background: var(--oxygen-color-semantic-brand-subtle-weak);
  color: var(--oxygen-color-semantic-brand-prominent-base);
  font: var(--oxygen-font-semantic-body-m-bold);
}
.pf-actionbar__count {
  margin-left: auto;
  font: var(--oxygen-font-semantic-body-xs-bold);
  color: var(--oxygen-color-semantic-neutral-prominent-weak);
}
```

```html
<aside class="pf-actionbar">
  <p class="pf-actionbar__heading">Aujourd'hui</p>
  <a class="pf-actionbar__item" href="#">
    <i class="fa-solid fa-calendar-day"></i> Mon agenda
    <span class="pf-actionbar__count">8</span>
  </a>
  <a class="pf-actionbar__item" href="#">
    <i class="fa-solid fa-users"></i> Salle d'attente
    <span class="pf-actionbar__count">2</span>
  </a>
  <p class="pf-actionbar__heading">Patients</p>
  <a class="pf-actionbar__item is-active" href="#">
    <i class="fa-solid fa-user-group"></i> Tous les patients
  </a>
  <a class="pf-actionbar__item" href="#">
    <i class="fa-solid fa-star"></i> Favoris
  </a>
</aside>
```

---
The OS menu lives in the template's `<style>` block as `.ox-osmenu`. For PF, use these items:
```html
<nav class="ox-osmenu">
  <div class="ox-osmenu__brand">
    <!-- Doctolib D logo SVG here -->
  </div>
  <a class="ox-osmenu__item is-active" href="#" aria-current="page">
    <span class="ox-osmenu__icon"><i class="fa-solid fa-users"></i></span>
    <span class="ox-osmenu__label">Patients</span>
  </a>
  <a class="ox-osmenu__item" href="#">
    <span class="ox-osmenu__icon"><i class="fa-solid fa-calendar-days"></i></span>
    <span class="ox-osmenu__label">Agenda</span>
  </a>
  <a class="ox-osmenu__item" href="#">
    <span class="ox-osmenu__icon"><i class="fa-solid fa-file-invoice-dollar"></i></span>
    <span class="ox-osmenu__label">Factures</span>
  </a>
  <a class="ox-osmenu__item" href="#">
    <span class="ox-osmenu__icon"><i class="fa-solid fa-chart-line"></i></span>
    <span class="ox-osmenu__label">Stats</span>
  </a>
  <div class="ox-osmenu__spacer"></div>
  <div class="ox-osmenu__footer">
    <span class="ox-osmenu__avatar ox-osmenu__avatar--user">TG</span>
  </div>
</nav>
```
Note: Font Awesome is already imported in the template — use `fa-solid fa-*` icon classes.

---

### PatientFileHeader structure
```html
<div class="ws__pageheader">
  <div style="display:flex; align-items:center; gap:1.2rem;">
    <span class="ox-avatar ox-avatar--large ox-avatar--dark-primary">
      <span class="ox-avatar__circle">SM</span>
    </span>
    <div>
      <h1 style="font:var(--oxygen-font-semantic-title-xl-bold); color:var(--oxygen-color-semantic-neutral-prominent-stronger); margin:0">
        Sophie Mercier
      </h1>
      <p style="font:var(--oxygen-font-semantic-body-m-regular); color:var(--oxygen-color-semantic-neutral-prominent-base); margin:0">
        38 ans · F · Patiente depuis 2023
      </p>
    </div>
  </div>
  <div class="ws__pageheader__actions">
    <button class="ox-iconbutton ox-iconbutton--variant-transparent ox-iconbutton--ui-neutral ox-iconbutton--size-medium" aria-label="Favori">
      <span class="ox-iconbutton__innerWrapper">★</span>
    </button>
    <button class="ox-button ox-button--variant-solid ox-button--ui-brand ox-button--size-medium" type="button">
      <span class="ox-button__innerWrapper">
        <span class="ox-button__hoverEffect"></span>
        <span class="ox-button__activeEffect"></span>
        <span class="ox-button__contentWrapper">+ Nouvelle facture</span>
      </span>
    </button>
  </div>
</div>
```

---

### CardCollection (section with header)
```html
<section style="margin-bottom:2.4rem">
  <!-- MODULE: [name] -->
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.2rem">
    <h2 style="font:var(--oxygen-font-semantic-title-m-bold); color:var(--oxygen-color-semantic-neutral-prominent-stronger)">
      Suivi ostéopathique
    </h2>
    <button class="ox-button ox-button--variant-outlined ox-button--ui-brand ox-button--size-small" type="button">
      <span class="ox-button__innerWrapper">
        <span class="ox-button__hoverEffect"></span>
        <span class="ox-button__activeEffect"></span>
        <span class="ox-button__contentWrapper">Ajouter</span>
      </span>
    </button>
  </div>
  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem">
    <!-- Cards here -->
  </div>
</section>
```

---

### Form field (WorkflowPanel)
```html
<div class="ox-field">
  <label class="ox-field__label">Acte</label>
  <input class="ox-input" type="text" placeholder="Ex: Séance ostéopathie">
</div>
<div class="ox-field">
  <label class="ox-field__label">Montant</label>
  <input class="ox-input" type="number" placeholder="0.00">
</div>
<div class="ox-field">
  <label class="ox-field__label">Statut</label>
  <select class="ox-select">
    <option>Non payé</option>
    <option>Payé</option>
    <option>Partiel</option>
  </select>
</div>
```

---

### Table (DataGrid)
```html
<table class="ox-datagrid">
  <thead>
    <tr>
      <th>Acte</th>
      <th>Date</th>
      <th class="num">Montant</th>
      <th>Statut</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Séance ostéopathie</td>
      <td>12/05/2026</td>
      <td class="num">65,00 €</td>
      <td><span class="ox-badge ox-badge--success">Payé</span></td>
    </tr>
  </tbody>
</table>
```

---



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

**STOP. Do not write any HTML. Run this first:**

```bash
mkdir -p prototypes/[cluster]
cp boilerplate/B2B_Settings_Page_Template.html prototypes/[cluster]/[cluster].html
```

**Immediately verify the copy worked and the shell is intact:**
```bash
head -15 prototypes/[cluster]/[cluster].html
grep -c "ox-shell\|ox-osmenu\|ox-topbar" prototypes/[cluster]/[cluster].html
```

The second command must return at least 3. If it returns 0, the copy failed — stop and fix before proceeding.

**Now make only these 6 surgical changes to the copied file — nothing else:**

1. Update `<title>` to the cluster name
2. Update `<link>` hrefs: change all CSS paths to `../../boilerplate/[filename]`
3. **Remove** the entire `<nav class="ox-sb">...</nav>` settings sidebar block
4. **Replace** the `<header class="ws__pageheader">` content with PatientFileHeader markup
5. **Replace** the `<div class="settings-content">` content with PF CardCollections and Cards
6. **Replace** the `<div class="wp__body">` WorkflowPanel content for the cluster
7. **Remove** the `<div class="variant-switcher">` dev toolbar at the bottom

**Add** the PF ActionBar as the first child of `<div class="ws">`:
```html
<div class="ws" id="ws-[cluster]">
  <aside class="pf-actionbar"> ... </aside>  ← INSERT HERE
  <div class="ws__focus"> ... </div>
  <aside class="ws__workflow"> ... </aside>
</div>
```

**The `ox-shell` grid, `ox-osmenu`, `ox-topbar`, and all shell CSS must remain exactly as copied from the template. Never rewrite, never touch.**

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
