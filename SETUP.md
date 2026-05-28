# Patient File Design Skill — Setup Guide
**Runtime:** Claude Code only  
**Last updated:** 2026-05-12

---

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- GitHub access to `github.com/doctolib/oxygen`
- GitHub access to `github.com/doctolib/pf-design-factory`
- Git configured with your Doctolib credentials locally

---

## Repo layout (expected on disk)

```
~/doctolib/
├── oxygen/                          ← git clone github.com/doctolib/oxygen
│   ├── preview/
│   │   ├── _base.css
│   │   ├── _components.css
│   │   ├── patientfileheader.html
│   │   ├── patientfilemenu.html
│   │   └── patientfileactionbar.html
│   ├── prototype/
│   │   ├── patient-detail.html
│   │   ├── patient-detail.app.jsx
│   │   ├── patient-detail.composed.jsx
│   │   ├── patient-detail.primitives.jsx
│   │   ├── patient-detail.css
│   │   └── icon-sprite.js
│   └── packages/tokens/src/tokens.css
│
├── pro-frontend/                    ← git clone github.com/doctolib/pro-frontend
│   ├── docs/
│   │   ├── patient-file-v3/action-bar/
│   │   ├── pro-frontend-architecture.md
│   │   ├── pro-app-shell-overview.md
│   │   └── pro-sdks-guidelines.md
│   └── specs/
│       ├── patient-file-architecture.md
│       ├── card-component-spec.md
│       ├── card-collection-component-s*.md
│       ├── quick-edit-component-spec.md
│       ├── section-menu-component-sp*.md
│       ├── workflow-panel-component-s*.md
│       ├── patient-file-menu-component*.md
│       └── patient-file-header-status-pills/
│
└── pf-design-factory/               ← git clone github.com/doctolib/pf-design-factory
    ├── README.md
    ├── SETUP.md                     ← you are here
    ├── SKILL.md                     ← agent entry point
    ├── oxygen-ds.md                 ← DS component reference
    ├── pf-layout.md                 ← PF layout spec
    ├── b2b-guidelines.md            ← B2B UX guidelines
    └── prototypes/                  ← generated output
        ├── index.html
        └── [cluster]/
```

---

## Initial setup

```bash
# 1. Clone all three repos
cd ~/doctolib
git clone git@github.com:doctolib/oxygen.git
git clone git@github.com:doctolib/pro-frontend.git
git clone git@github.com:doctolib/pf-design-factory.git

# 2. Enter the factory and launch Claude Code
cd pf-design-factory
claude
```

---

## Running the skill

Once inside Claude Code, paste a feature list:

```
Use the patient-file-design skill.

Cluster: Cardiology
Market: France B2B — EHR (Health / Financial / Administrative / History)
Persona: Cardiologist, specialist, high appointment volume

Features:
- ECG results viewer           | P0 | PDF + structured data
- Medication history timeline  | P0
- Referral letter generation   | P1 | WorkflowPanel
- Alerts / contraindications   | P0
- Appointment history 12mo     | P1
```

Claude Code will:
1. Read `SKILL.md`
2. Read `pf-layout.md`, `b2b-guidelines.md`, `oxygen-ds.md` from the same folder
3. Read the prototype boilerplate from `~/doctolib/oxygen/prototype/`
4. Follow the mandatory workflow (parse → clarify → plan → generate → index)

---

## Viewing prototypes

```bash
open prototypes/cardiology/cardiology.html
```

CSS is referenced from `../../oxygen/preview/` — no build step, open directly in browser.

---

## Keeping everything up to date

```bash
# Latest generic DS (tokens, components, new previews)
cd ~/doctolib/oxygen && git pull

# Latest B2B-specific components and framework guidelines
cd ~/doctolib/pro-frontend && git pull

# Latest skill, guidelines, and layout spec
cd ~/doctolib/pf-design-factory && git pull
```

---

## Troubleshooting

**"File not found" when reading guidelines or layout**  
→ Make sure you launched Claude Code from inside `~/doctolib/pf-design-factory/`

**Prototype CSS not loading in browser**  
→ CSS paths are relative (`../../oxygen/preview/`). If your folder layout differs from the one above, adjust the `href` in the cluster `.html` file.

**"b2b-guidelines.md has unfilled placeholders"**  
→ Open a PR against `pf-design-factory` to add content to `b2b-guidelines.md`.
