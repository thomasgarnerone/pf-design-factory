# PF Design Factory

A Claude Code skill for designing Doctolib Patient File interfaces. Given a feature list for a cluster, market, or persona, it asks the right questions, then generates a hi-fi HTML/CSS prototype using real Oxygen DS components — always respecting the PF foundational layout.

**Maintained by:** DS Core  
**Runtime:** Claude Code only

---

## What it does

1. Reads live sources from disk (Oxygen DS, PF layout spec, B2B guidelines)
2. Maps features to the correct PF zones (Tab → CardCollection → Card → Component)
3. Asks clarifying questions before designing anything
4. Generates a cluster prototype you can open in a browser immediately
5. Maintains a master index of all generated Patient Files

---

## Repos involved

| Repo | Role |
|---|---|
| `github.com/doctolib/oxygen` | Primary DS — baseline for all components, tokens, and design compliance |
| `github.com/doctolib/pro-frontend` | B2B extensions — PF-specific overrides and components not (yet) in Oxygen |
| `github.com/doctolib/pf-design-factory` | This repo — skill, layout spec, guidelines, prototypes |

---

## Quick start

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

Then paste a feature list:

```
Use the patient-file-design skill.

Cluster: Cardiology
Market: France B2B — EHR
Persona: Cardiologist, specialist, high volume

Features:
- ECG results viewer           | P0 | PDF + structured data
- Medication history timeline  | P0
- Referral letter generation   | P1 | WorkflowPanel
- Alerts / contraindications   | P0
- Appointment history 12mo     | P1
```

Open the result:

```bash
open prototypes/cardiology/cardiology.html
```

Full setup: [`SETUP.md`](./SETUP.md)

---

## File structure

```
pf-design-factory/
├── README.md              ← you are here
├── SETUP.md               ← full setup and usage guide
├── SKILL.md               ← agent entry point
├── oxygen-ds.md           ← Oxygen DS component reference
├── pf-layout.md           ← PF layout spec (zones, CSS, constraints)
├── b2b-guidelines.md      ← B2B UX principles and patterns
└── prototypes/            ← generated output
    ├── index.html         ← master index of all Patient Files
    └── [cluster]/
        ├── [cluster].html
        ├── [cluster].app.jsx
        ├── [cluster].composed.jsx
        ├── [cluster].primitives.jsx
        └── [cluster].css
```

---

## Keeping things up to date

```bash
# Latest generic DS
cd ~/doctolib/oxygen && git pull

# Latest B2B-specific components and framework guidelines
cd ~/doctolib/pro-frontend && git pull

# Latest skill, guidelines, layout spec
cd ~/doctolib/pf-design-factory && git pull
```

---

## Contributing

**Skill behavior** (workflow, constraints, output format) → edit `SKILL.md`  
**PF layout spec** → edit `pf-layout.md`  
**B2B guidelines** → edit `b2b-guidelines.md`  
**DS component reference** → edit `oxygen-ds.md`  

All contributions via PR. Changes to `SKILL.md` and `pf-layout.md` affect every future prototype — review carefully.

---

## Status

| File | Status |
|---|---|
| `SKILL.md` | ✅ Ready |
| `oxygen-ds.md` | ✅ Auto-populated from boilerplate |
| `pf-layout.md` | 🟡 Partially filled — 6 Figma items pending |
| `b2b-guidelines.md` | ⬜ Needs content |
