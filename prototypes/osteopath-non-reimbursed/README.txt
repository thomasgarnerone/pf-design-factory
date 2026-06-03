PATIENT FILE PROTOTYPE: Non-reimbursed Osteopathy Care
=======================================================

Location: ~/doctolib/pf-design-factory/prototypes/osteopath-non-reimbursed/index.html

Patient: Sophie Mercier · 38 ans · F · Patiente depuis 2023
Persona: Osteopath, private practice, high volume of non-reimbursed acts
Market: France B2B (BMS-FR)

STRUCTURE
---------
✅ OS Menu (left rail) - 8rem width, Doctolib brand
✅ Top Bar - search, telehealth controls, system icons
✅ PF ActionBar (26rem width) - Aujourd'hui, Patients, Cabinet sections
✅ PatientFileHeader - patient identity + "Nouvelle facture" CTA
✅ 4 Tabs: Santé, Financier, Historique, Administratif
✅ WorkflowPanel - bill creation form with act selection, payment method, total

CARD COLLECTIONS (Santé tab)
----------------------------
1. Suivi ostéopathique (3 cards)
   - Dernière consultation: 15 mai 2026, 65€
   - Prochaine séance: 12 juin 2026
   - Total séances: 8 depuis mars 2023

2. Motifs de consultation (2 cards)
   - Lombalgie chronique (Actif, 6 séances)
   - Cervicalgie post-accident (Résolu, 2 séances)

3. Factures récentes (3 cards)
   - 15/05/2026: 65€ Payé
   - 03/04/2026: 65€ Payé
   - 18/02/2026: 60€ Payé

4. Solde patient (4 cards)
   - Total facturé: 510€
   - Total payé: 510€
   - En attente: 0€
   - En retard: 0€

WORKFLOW PANEL
--------------
Nouvelle facture form:
- Patient (readonly)
- Date de la séance
- Acte (dropdown with prices)
- Montant
- Mode de paiement (CB, Espèces, Chèque, Virement)
- Statut (Payé, Non payé, Paiement partiel)
- Envoi facture (Email, SMS, Imprimer, Ne pas envoyer)
- Notes (optional textarea)
- Total summary (HT, TVA 0%, TTC)

INTERACTIONS
------------
- Click "Nouvelle facture" → opens WorkflowPanel
- Click close (X) in WorkflowPanel → closes panel
- Tab switching enabled
- Comfort mode toggle (expand WorkflowPanel width)

CSS REFERENCES
--------------
All CSS files linked via relative paths to boilerplate/:
- ../../boilerplate/colors_and_type.css
- ../../boilerplate/base.css
- ../../boilerplate/components.css

SERVING
-------
cd ~/doctolib/pf-design-factory/prototypes && python3 -m http.server 3000
http://localhost:3000/osteopath-non-reimbursed/index.html
