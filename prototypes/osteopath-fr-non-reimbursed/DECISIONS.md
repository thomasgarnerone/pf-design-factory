# Architecture Decisions Log

**Prototype:** France Osteopathy (Non-reimbursed)  
**Created:** 2026-06-03  
**Status:** Awaiting user validation

---

## Context

**Persona:** Osteopath practitioner  
**Market:** France, non-reimbursed care  
**Priority:** Efficiency over consistency  
**Device:** Desktop-first  
**Patient:** Sophie Mercier, 38 ans, chronic back pain since 2023

**Key Insight:** Osteopaths work session-by-session with immediate billing. Standard 4-tab EHR may add unnecessary navigation overhead.

**User Research Finding:** "Usually they bill at every session" → Session → Billing workflow must be fast.

---

## Options Explored

We generated 2 architecture options to test different hypotheses about workflow efficiency.

### Option A: Conservative (4 tabs)

**Tabs:** Santé | Finance | Historique | Administratif

**Hypothesis:** Familiar structure reduces training time and matches other French EHR software.

**Module placement:**
| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi ostéopathique | Santé | Clinical tracking |
| Motifs de consultation | Santé | Diagnosis/conditions |
| Factures récentes | Finance | Billing history |
| Solde patient | Finance | Financial overview |
| Historique RDV | Historique | Appointment timeline |
| Contact info | Administratif | Personal data (QuickEdit) |

**Trade-offs:**
- ✅ Familiar to practitioners who use other EHR systems
- ✅ Clear separation of concerns
- ❌ Session → billing workflow requires 2 tab switches
- ❌ 4 tabs = higher cognitive load

---

### Option B: Optimized (3 tabs)

**Tabs:** Séances | Paiements | Dossier

**Hypothesis:** Fewer tabs + session-centric naming optimizes for osteopath daily workflow.

**Module placement:**
| Module | Tab | Rationale |
|--------|-----|-----------|
| Suivi ostéopathique | Séances | Session-centric view |
| Motifs de consultation | Séances | Conditions tied to sessions |
| Historique RDV | Séances | **MERGED:** History co-located with tracking |
| Factures récentes | Paiements | End-of-session billing |
| Solde patient | Paiements | Financial overview |
| Moyens de paiement | Paiements | Payment methods |
| Contact info | Dossier | Administrative data (QuickEdit) |
| Documents | Dossier | Admin documents |

**Trade-offs:**
- ✅ 25% fewer tabs = reduced navigation
- ✅ Session → billing = 1 tab switch (not 2)
- ✅ "Séances" speaks to osteopath workflow
- ✅ History co-located with clinical tracking
- ❌ Diverges from standard EHR structure
- ❌ Requires training (new tab structure)

---

## Rationale for These Options

**Why Conservative (Option A)?**
- Baseline for comparison
- Matches existing French EHR training
- Low-risk option if consistency matters more than we thought

**Why Optimized (Option B)?**
- Tests efficiency hypothesis ("fewer tabs = faster workflow")
- User research: "efficiency matters more than consistency"
- Session-centric naming matches mental model
- Billing at every session → optimize session-to-payment flow

**Why NOT a 3rd Radical option?**
- User didn't request experimental approaches
- 2 options sufficient for A/B testing
- Can iterate based on validation feedback

---

## Validation Plan

**Metrics to measure:**
1. Time to complete session → invoice workflow
2. Number of tab switches per patient visit
3. Subjective preference ratings
4. Which variant gets more "time spent" (analytics)

**Success criteria:**
- Option B should show ≥20% faster session → billing workflow
- If not, Option A preferred for training consistency

---

## Implementation Notes

**Variant Switcher:**
- Placed in Top Bar (always visible)
- localStorage tracks which variant user last viewed
- Namespaced storage per variant (no data conflicts)

**Shared Components:**
- OS Menu, Top Bar, ChildViewHeader, Toolbox identical
- Only tabs and panel content differ between variants

**All 9 Mandatory Interactions Implemented:**
1. Tab switching
2. QuickEdit (phone/email/address)
3. ActionBar → WorkflowPanel
4. Working forms with validation
5. Back/close buttons
6. All "Ajouter" buttons functional
7. localStorage persistence
8. Loading states
9. Toast notifications

---

## Open Questions

1. **"Séances" terminology:** Will French osteopaths immediately understand this term vs "Santé"?
2. **History merge:** Does co-locating history with clinical tracking feel natural or cluttered?
3. **Mobile:** How do 3 vs 4 tabs perform on mobile devices? (Not tested in this prototype)

---

## Next Steps

1. Test with 3-5 osteopaths
2. Measure session → billing workflow time
3. Collect subjective feedback
4. Iterate based on findings
5. Update this log with validation results

---

## References

- [SKILL.md Architecture Iteration Process](../../SKILL.md#architecture-iteration-process)
- [pf-layout.md](../../pf-layout.md)
- User research input: "efficiency matters more than consistency"
