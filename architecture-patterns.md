# Patient File Architecture Patterns

**Purpose:** Catalog of proven architecture patterns for different markets, workflows, and priorities.

**Last updated:** 2026-06-03  
**Status:** Living document — add new patterns as they're validated with users

---

## Pattern A: Conservative (4-tab EHR Standard)

**Tabs:** Santé | Finance | Historique | Administratif

### When to use
- **Consistency matters:** Market where practitioners use multiple EHR systems and expect standard structure
- **Regulatory requirement:** Compliance needs may dictate familiar tab organization
- **Mixed specialties:** General medical software needs to work across many specialties
- **Training investment:** Org has already trained staff on 4-tab EHR pattern

### Module placement

| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi clinique / Health tracking | Santé | Clinical data, diagnosis, treatment plans |
| Motifs de consultation / Conditions | Santé | Active and resolved conditions |
| Examens / Lab results | Santé | Test results, imaging |
| Factures / Invoices | Finance | Billing history |
| Solde patient / Balance | Finance | Financial overview, payment status |
| Moyens de paiement / Payment methods | Finance | Preferred payment methods, insurance |
| Historique RDV / Appointment history | Historique | Timeline of all visits |
| Documents médicaux / Medical docs | Historique | Consultation notes, referrals, certificates |
| Contact info | Administratif | Phone, email, address (QuickEdit) |
| Documents administratifs | Administratif | ID, insurance cards, consent forms |

### Trade-offs

✅ **Gains:**
- Familiar structure across specialties and software
- Easy onboarding (staff already know the pattern)
- Clear separation of concerns (health vs finance vs admin)
- Compliance-friendly (matches regulatory expectations)

❌ **Losses:**
- More tabs = more navigation overhead (2-3 clicks per workflow)
- May split related workflows (e.g., session → billing requires 2 tabs)
- Generic naming doesn't optimize for specialty workflows
- Higher cognitive load (4 tabs to remember)

### Validated for:
- EHR France (general practitioners, specialists)
- EHR Germany (mixed practice types)
- BMS Germany (administrative-focused, 4 tabs but different set)

---

## Pattern B: Optimized (3-tab Session-centric)

**Tabs:** Séances | Paiements | Dossier

### When to use
- **Efficiency is priority:** Workflow speed matters more than consistency
- **Session-centric workflow:** Practitioners work session-by-session (arrival → treatment → payment)
- **Non-reimbursed care:** Simplified billing (no insurance claims processing)
- **Single specialty:** Software tailored to one specialty's specific workflow
- **Small practices:** Practitioners want fewer clicks, faster navigation

### Module placement

| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi clinique / Health tracking | Séances | Session-centric view of treatment progress |
| Motifs de consultation / Conditions | Séances | Conditions tied to session history |
| Historique RDV / Appointment history | Séances | **MERGED:** Session history co-located with clinical tracking |
| Prochaine séance / Next appointment | Séances | Scheduling integrated with session view |
| Factures / Invoices | Paiements | End-of-session billing |
| Solde patient / Balance | Paiements | Financial overview |
| Moyens de paiement / Payment methods | Paiements | All payment workflow in one place |
| Contact info | Dossier | Administrative patient info (QuickEdit) |
| Documents administratifs | Dossier | ID, consent, insurance cards |
| Notes administratives | Dossier | Non-clinical notes |

### Trade-offs

✅ **Gains:**
- **25% less navigation:** 3 tabs instead of 4 = fewer clicks
- **Workflow-aligned:** Matches session → payment flow
- **History co-located:** See treatment patterns without tab switching
- **Specialty-optimized:** "Séances" speaks to osteopaths' mental model
- **Faster end-of-session:** One click from clinical to billing

❌ **Losses:**
- Diverges from standard EHR structure (training needed)
- "Dossier" tab less frequently used (admin is lower priority)
- History merged into Séances may feel dense
- Practitioners switching between software see different layout

### Validated for:
- France osteopathy (non-reimbursed)
- Physiotherapy practices (session-focused)
- Alternative medicine (acupuncture, chiropractic)

---

## Pattern C: Radical (Dashboard + Journey)

**Tabs:** Aujourd'hui | Parcours patient | Facturation

### When to use
- **Daily dashboard needed:** Practitioners want "today's context" on opening file
- **Longitudinal view priority:** Treatment journey over months/years is central
- **Task-oriented workflow:** Matches "what am I doing now?" mental model
- **Willing to retrain staff:** Org ready to invest in new paradigm

### Module placement

| Module | Tab | Rationale |
|--------|-----|-----------|
| RDV du jour / Today's appointments | Aujourd'hui | Daily dashboard context |
| Dernière séance / Last session | Aujourd'hui | Quick access to most recent visit |
| Actions rapides / Quick actions | Aujourd'hui | Fast actions: invoice, message, document |
| Alertes / Alerts | Aujourd'hui | Urgent items (unpaid invoices, missed appointments) |
| Timeline complète / Full timeline | Parcours patient | **ALL** sessions, notes, docs, invoices chronologically |
| Motifs de consultation / Conditions | Parcours patient | Conditions in longitudinal context |
| Progrès / Progress tracking | Parcours patient | Treatment evolution over time |
| Factures & paiements / Invoices | Facturation | All financial in one view |
| Statistiques revenus / Revenue stats | Facturation | Financial analytics |

### Trade-offs

✅ **Gains:**
- Dashboard view = instant context on opening file
- Timeline view = clear treatment evolution
- Task-oriented tabs match practitioner workflow
- "Aujourd'hui" reduces time to action (today's work front-and-center)

❌ **Losses:**
- **Steep learning curve:** Completely new paradigm
- Diverges from ALL existing patterns = risky
- "Aujourd'hui" requires dynamic content (today's appointments)
- May confuse practitioners switching between software
- Higher implementation complexity

### Validated for:
- ⚠️ **Not yet validated** — experimental pattern
- Candidates: Pediatrics (long-term patient journeys), chronic disease management

---

## How to Choose a Pattern

```
START
  ↓
Is consistency with existing software important?
  YES → Pattern A: Conservative
  NO  ↓
     ↓
Is the workflow session-centric (session → billing)?
  YES → Pattern B: Optimized
  NO  ↓
     ↓
Is longitudinal patient journey the priority?
  YES → Pattern C: Radical (experimental)
  NO  → Start with Pattern A, customize as needed
```

---

## Adding New Patterns

When you validate a new architecture with real users:

1. **Document the pattern:**
   - Tab structure
   - Module placement table
   - When to use (conditions)
   - Trade-offs (gains vs losses)

2. **Add validation data:**
   - Which market/specialty tested it
   - User feedback quotes
   - Metrics (if available): time-on-task, navigation clicks, satisfaction ratings

3. **Update this file** with a new "Pattern D/E/F" section

4. **Link from SKILL.md** Architecture Iteration Process → reference this file for proven patterns

---

## Comparison Table

| Aspect | Pattern A: Conservative | Pattern B: Optimized | Pattern C: Radical |
|--------|------------------------|----------------------|-------------------|
| **Tab count** | 4 tabs | 3 tabs | 3 tabs |
| **Learning curve** | Low (familiar) | Medium (new structure) | High (new paradigm) |
| **Navigation clicks** | 2-3 per workflow | 1-2 per workflow | 1-2 per workflow |
| **Specialty alignment** | Generic | Session-centric | Journey-centric |
| **Consistency** | High | Medium | Low |
| **Efficiency** | Medium | High | High |
| **Risk** | Low | Medium | High |
| **Validation status** | ✅ Proven (FR, DE) | ✅ Proven (FR osteo) | ⚠️ Experimental |

---

## References

- [SKILL.md Architecture Iteration Process](./SKILL.md#architecture-iteration-process) — How to generate and validate options
- [pf-layout.md](./pf-layout.md) — Foundational layout specification
- [patient-file-menu-component-spec.md](../pro-frontend/specs/patient-file-menu-component-spec.md) — PatientFileMenu component spec
