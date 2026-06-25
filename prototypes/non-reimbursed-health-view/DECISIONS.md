# Architecture Decisions

**Prototype:** Non-reimbursed · Vue Santé (Health view)
**Figma source:** `v6trSWUC4pahjYF2GJL747` node `1:26317`
**Date:** 2026-06-25

---

## Context

- **Persona:** Praticien secteur privé non remboursé (ostéopathe, naturopathe, coach santé…)
- **Patient:** Madame Sylviane ADAM — dossier de soins EHR complet, 2 événements de santé actifs
- **Market:** France, non remboursé (pas de remboursement Sécurité Sociale)
- **Priority:** Vue Santé — premier onglet affiché, vue centrale du praticien sur l'état de santé du patient
- **Key insight:** Le praticien non remboursé a besoin de toute l'information clinique dès l'arrivée en consultation, sans naviguer entre plusieurs onglets. La richesse médicale (antécédents, déterminants sociaux) est aussi importante que les événements de santé récents.

---

## Options Explorées

### Option A — EHR Complet (6 onglets) — Fidèle au Figma

**Structure :**  
`Santé` | `Historique` | `Factures` | `Administratif` | `Antécédents médicaux` | `Déterminants sociaux`

**Vue Santé contient :**
- Aperçu du patient (synthèse contextuelle : profession, situation, tabac, dernières consultations, derniers documents)
- Événements de santé (cards : Entorse cheville, Douleur Lombaire, Dyslipidémie ghost)

**Rationale :**
Reproduit fidèlement la maquette Figma. La séparation Antécédents / Déterminants sociaux en onglets dédiés suit la logique EHR standard : chaque dimension médicale a son espace propre. Cohérent avec le pattern Patient File canonique.

**Trade-offs :**
- ✅ Fidèle au Figma, aucune interprétation ajoutée
- ✅ Clarté : chaque onglet a une responsabilité unique
- ✅ Scalable — chaque onglet peut s'enrichir indépendamment
- ❌ 6 onglets = overflow possible sur petits écrans / viewports < 1280px
- ❌ Le praticien doit faire 2 clics pour passer de Santé à Déterminants sociaux
- ❌ Risque de "tab fatigue" pour les praticiens qui consultent tous les onglets à chaque RDV

---

### Option B — Simplifié (4 onglets)

**Structure :**  
`Santé` | `Historique` | `Factures` | `Administratif`

**Vue Santé contient :**
- Aperçu du patient (même que A)
- Événements de santé (condensé)
- Contexte patient (antécédents + déterminants sociaux fusionnés en une collection)

**Rationale :**
Pour un praticien non remboursé qui voit peu de patients mais connaît bien son dossier, la consultation rapide d'un dossier doit être en 1 clic. Fusionner Antécédents et Déterminants sociaux dans Santé évite la navigation multi-onglets. 4 onglets restent visibles sans overflow sur tous les viewports.

**Trade-offs :**
- ✅ Moins de navigation — tout le contexte clinique est dans Santé
- ✅ 4 onglets = stable sur tous les écrans sans scrolling du tab bar
- ✅ Réduit la complexité cognitive pour les praticiens "généralistes" du non remboursé
- ❌ Vue Santé plus chargée (3 collections vs 2)
- ❌ Diverge du Figma d'origine
- ❌ Moins adapté aux spécialistes qui gèrent beaucoup d'antécédents complexes

---

## Modules communs aux deux options

| Module | Emplacement | Contenu |
|---|---|---|
| GUX - Patient file header | Haut du Focus Zone | Sylviane ADAM, née LIGNAC, Femme, 28/02/1991, 00 22 44 66 88, badge Privé |
| GUX - Patient file menu | Tab bar | Tabs + CTA "Démarrer une observation" |
| Aperçu du patient | Santé tab | Synthèse contextuelle avec pills consultations + documents |
| Événements de santé | Santé tab | 3 event cards (dont 1 ghost/placeholder opacity:0.25) |
| Toolbox | ws__toolbox right | Observation, Documents, Facturation |

---

## Validation Plan

1. **Est-ce que les praticiens non remboursés consultent Antécédents médicaux à chaque RDV ?** → Si oui, Option B (fusionné dans Santé) réduit leur friction. Si non, Option A (onglet séparé) est suffisant.
2. **Tab bar overflow** → Tester Option A sur 1280×800 pour vérifier que les 6 onglets tiennent sans scroll.
3. **Ghost card (Dyslipidémie opacity:0.25)** → Confirmer avec design si c'est un placeholder pour une 3ème card future ou une invitation à l'ajout.
4. **CTA "Démarrer une observation"** → Confirmer que le raccourci est utile dans la tab bar ou si un bouton dans la Toolbox suffit.
