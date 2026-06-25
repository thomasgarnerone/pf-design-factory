# Architecture Decisions

**Prototype:** Psychologue France — Non remboursé
**Version:** Option A Conservative (4 onglets)

---

## Contexte

- **Persona :** Psychologue libéral, France
- **Marché :** France, non remboursé (secteur 3 / hors convention)
- **Approche :** TCC (thérapie cognitive et comportementale)
- **Workflow clé :** Relation thérapeutique longue durée — séances hebdomadaires, paiement direct en fin de séance, notes cliniques confidentielles

---

## Option A : Conservative (4 onglets)

**Structure :** `Santé` | `Finance` | `Historique` | `Administratif`

### Onglet Santé
- Notes de séance (dernière en tête, confidential banner)
- Objectifs thérapeutiques (En cours / Résolu / Suivi)
- Anamnèse (motif initial, antécédents psy et médicaux, approche)

### Onglet Finance
- Solde patient (facturé / payé / en attente / en retard)
- Factures récentes
- Attestations de paiement (trimestrielles pour mutuelle)

### Onglet Historique
- Timeline des séances (date + numéro + résumé + statut paiement)

### Onglet Administratif
- Informations de contact (QuickEdit)
- Médecin traitant
- Contact d'urgence
- Documents (consentement éclairé, bilan initial)

---

## Décisions spécifiques au psychologue

### Confidentialité des notes cliniques
**Décision :** Bandeau d'avertissement "accès restreint" en tête de l'onglet Santé.  
**Rationale :** Les notes cliniques en psychologie ont un statut de confidentialité renforcée (secret professionnel). Le bandeau alerte visuellement sans bloquer l'accès au praticien.

### Attestations de paiement trimestrielles
**Décision :** Module dédié dans l'onglet Finance.  
**Rationale :** Le psychologue non remboursé génère régulièrement des attestations pour la prise en charge partielle par les mutuelles. Workflow fréquent (~tous les 2-3 mois).

### Objectifs thérapeutiques dans Santé (pas dans Historique)
**Décision :** Les objectifs sont dans l'onglet Santé, pas Historique.  
**Rationale :** Les objectifs sont des éléments vivants (mis à jour en cours de suivi), pas des archives. Ils appartiennent à l'état clinique actuel.

### Toolbox : Note de séance en CTA primaire
**Décision :** "Note de séance" est le CTA principal (bouton solid brand) dans le header ET l'ActionBar.  
**Rationale :** C'est l'action la plus fréquente après chaque séance. Priorité maximale.

---

## Trade-offs de l'Option A

| | Pour | Contre |
|---|---|---|
| Cohérence | Structure identique aux autres spécialités | "Santé" est un terme médical inadapté à la psychologie |
| Navigation | Familière pour les utilisateurs Doctolib | Notes → Facture = 2 onglets (Santé → Finance) |
| Découverte | Toutes les sections sont nommées explicitement | L'onglet Santé mélange notes, objectifs et anamnèse |

---

## Plan de validation

1. **Avant séance :** Le psychologue va-t-il naturellement dans "Santé" pour relire les notes ?
2. **Après séance :** La bascule Santé → Finance pour facturer est-elle un frein ou acceptable ?
3. **Attestations :** Le module Finance est-il trouvé facilement ou cherché dans Administratif ?
4. **Confidential banner :** Utile ou bruit visuel ?

---

*Prototype créé le 25 juin 2026*
