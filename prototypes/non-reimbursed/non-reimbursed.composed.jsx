/* global React, CardCollection, Card, QuickEdit, InlineButton, WorkflowPanel, Button, Icon, BillStatusBadge, ZoneChip */
/* Composed tab components for non-reimbursed cluster */

const { useState } = React;

// ================================================================
// TabSante — Health information and treatment zones
// ================================================================
function TabSante({ patient, onUpdatePatient }) {
  return (
    <>
      <CardCollection
        label="Suivi ostéopathique"
        primaryAction={{
          label: 'Nouvelle séance',
          icon: 'plus',
          onClick: () => alert('Créer nouvelle séance (démo)'),
        }}
      >
        <Card title="Motif principal" icon="stethoscope" size="large">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <QuickEdit
                label="Motif principal"
                value={patient.motifPrincipal}
                type="textarea"
                onSave={(v) => onUpdatePatient('motifPrincipal', v)}
              />
            </div>
          </div>
        </Card>

        <Card title="Zones de traitement" icon="user" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
                {patient.zones.map((zone) => (
                  <ZoneChip key={zone} label={zone} selected />
                ))}
              </div>
            </div>
            <div className="pd-card__row">
              <InlineButton
                label="Modifier les zones"
                icon="pencil"
                onClick={() => alert('Modifier zones (démo)')}
              />
            </div>
          </div>
        </Card>

        <Card title="Fréquence de suivi" icon="calendar" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Rythme</span>
              <QuickEdit
                label="Fréquence"
                value={patient.frequenceSuivi === 'monthly' ? 'Mensuel' : patient.frequenceSuivi}
                type="select"
                options={[
                  { label: 'Hebdomadaire', value: 'weekly' },
                  { label: 'Bi-mensuel', value: 'biweekly' },
                  { label: 'Mensuel', value: 'monthly' },
                  { label: 'Trimestriel', value: 'quarterly' },
                ]}
                onSave={(v) => onUpdatePatient('frequenceSuivi', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Nombre de séances</span>
              <span className="pd-card__rowvalue">{patient.nbSeances} séances au total</span>
            </div>
          </div>
        </Card>
      </CardCollection>

      <CardCollection label="Historique médical">
        <Card title="Chirurgies et pathologies" icon="file-lines" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Chirurgies</span>
              <QuickEdit
                label="Chirurgies"
                value={patient.chirurgies}
                type="textarea"
                onSave={(v) => onUpdatePatient('chirurgies', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Pathologies</span>
              <QuickEdit
                label="Pathologies"
                value={patient.pathologies}
                type="textarea"
                onSave={(v) => onUpdatePatient('pathologies', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Contre-indications</span>
              <QuickEdit
                label="Contre-indications"
                value={patient.contreIndications}
                type="textarea"
                onSave={(v) => onUpdatePatient('contreIndications', v)}
              />
            </div>
          </div>
        </Card>

        <Card title="Médicaments actuels" icon="pills" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <QuickEdit
                label="Médicaments"
                value={patient.medicaments}
                type="textarea"
                hint="Liste des médicaments avec posologie"
                onSave={(v) => onUpdatePatient('medicaments', v)}
              />
            </div>
          </div>
        </Card>

        <Card title="Autres praticiens" icon="user" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <QuickEdit
                label="Autres praticiens"
                value={patient.autresPraticiens}
                type="textarea"
                hint="Médecin traitant, kinésithérapeute, etc."
                onSave={(v) => onUpdatePatient('autresPraticiens', v)}
              />
            </div>
          </div>
        </Card>
      </CardCollection>
    </>
  );
}

// ================================================================
// TabFinancier — Bills and payment tracking
// ================================================================
function TabFinancier({ bills, onCreateBill, onViewBill, onSendBill, onRemindBill }) {
  const stats = {
    total: bills.reduce((sum, b) => sum + b.amountRaw, 0),
    paid: bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amountRaw, 0),
    pending: bills.filter((b) => b.status === 'pending').reduce((sum, b) => sum + b.amountRaw, 0),
    overdue: bills.filter((b) => b.status === 'overdue').reduce((sum, b) => sum + b.amountRaw, 0),
  };

  return (
    <>
      <CardCollection
        label="Facturation"
        primaryAction={{
          label: 'Nouvelle facture',
          icon: 'plus',
          onClick: onCreateBill,
        }}
      >
        <Card title="Résumé financier" icon="info-circle" size="large">
          <div className="nr-financial-summary">
            <div className="nr-financial-stat">
              <span className="nr-financial-stat__label">Total facturé</span>
              <span className="nr-financial-stat__value">{stats.total} €</span>
            </div>
            <div className="nr-financial-stat nr-financial-stat--success">
              <span className="nr-financial-stat__label">Payé</span>
              <span className="nr-financial-stat__value">{stats.paid} €</span>
            </div>
            <div className="nr-financial-stat nr-financial-stat--warning">
              <span className="nr-financial-stat__label">En attente</span>
              <span className="nr-financial-stat__value">{stats.pending} €</span>
            </div>
            <div className="nr-financial-stat nr-financial-stat--danger">
              <span className="nr-financial-stat__label">Impayé</span>
              <span className="nr-financial-stat__value">{stats.overdue} €</span>
            </div>
          </div>
        </Card>
      </CardCollection>

      <CardCollection label="Factures">
        {bills.map((bill) => (
          <Card key={bill.id} title={`Facture ${bill.id}`} icon="file-lines" size="medium">
            <div className="pd-card__rows">
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Date</span>
                <span className="pd-card__rowvalue">{bill.date}</span>
              </div>
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Actes</span>
                <span className="pd-card__rowvalue" style={{ textAlign: 'right' }}>
                  {bill.actes.join(', ')}
                </span>
              </div>
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Montant</span>
                <span className="pd-card__rowvalue" style={{ fontWeight: 600 }}>
                  {bill.amount}
                </span>
              </div>
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Statut</span>
                <BillStatusBadge status={bill.status} />
              </div>
              <div className="pd-card__row" style={{ paddingTop: '.8rem', gap: '.8rem', flexWrap: 'wrap' }}>
                <InlineButton
                  label="Voir"
                  icon="file-lines"
                  onClick={() => onViewBill(bill)}
                />
                {bill.status !== 'paid' && (
                  <InlineButton
                    label="Envoyer"
                    icon="envelope"
                    onClick={() => onSendBill(bill)}
                  />
                )}
                {bill.status === 'overdue' && (
                  <InlineButton
                    label="Relancer"
                    icon="bell"
                    onClick={() => onRemindBill(bill)}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </CardCollection>
    </>
  );
}

// ================================================================
// TabHistorique — Consultation history
// ================================================================
function TabHistorique({ consultations }) {
  return (
    <CardCollection label="Historique des consultations">
      {consultations.map((consult, idx) => (
        <Card key={idx} title={consult.date} icon="calendar-day" size="large">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Zones traitées</span>
              <span className="pd-card__rowvalue" style={{ textAlign: 'right' }}>
                {consult.zones.join(', ')}
              </span>
            </div>
            <div className="pd-card__row" style={{ display: 'block' }}>
              <span className="pd-card__rowlabel">Notes de séance</span>
              <p style={{ margin: '.8rem 0 0', color: 'var(--oxygen-color-semantic-neutral-prominent-base)' }}>
                {consult.note}
              </p>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Facturation</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                <BillStatusBadge status={consult.billStatus} />
                <span style={{ fontWeight: 600 }}>{consult.amount}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </CardCollection>
  );
}

// ================================================================
// TabAdministratif — Administrative information
// ================================================================
function TabAdministratif({ patient, onUpdatePatient }) {
  return (
    <>
      <CardCollection label="Coordonnées">
        <Card title="Contact principal" icon="phone" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Téléphone</span>
              <QuickEdit
                label="Téléphone"
                value={patient.phone}
                type="tel"
                icon="phone"
                onSave={(v) => onUpdatePatient('phone', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Email</span>
              <QuickEdit
                label="Email"
                value={patient.email}
                type="email"
                icon="envelope"
                onSave={(v) => onUpdatePatient('email', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Adresse</span>
              <QuickEdit
                label="Adresse"
                value={patient.address}
                icon="map-pin"
                onSave={(v) => onUpdatePatient('address', v)}
              />
            </div>
          </div>
        </Card>

        <Card title="Contact d'urgence" icon="bell" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Nom</span>
              <QuickEdit
                label="Nom du contact"
                value={patient.emergencyName}
                onSave={(v) => onUpdatePatient('emergencyName', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Téléphone</span>
              <QuickEdit
                label="Téléphone"
                value={patient.emergencyPhone}
                type="tel"
                onSave={(v) => onUpdatePatient('emergencyPhone', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Lien</span>
              <QuickEdit
                label="Relation"
                value={patient.emergencyRelation}
                onSave={(v) => onUpdatePatient('emergencyRelation', v)}
              />
            </div>
          </div>
        </Card>
      </CardCollection>

      <CardCollection label="Préférences">
        <Card title="Paiement et facturation" icon="info-circle" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mode de paiement</span>
              <QuickEdit
                label="Mode de paiement"
                value={patient.paymentMethod === 'cb' ? 'Carte bancaire' : patient.paymentMethod}
                type="select"
                options={[
                  { label: 'Carte bancaire', value: 'cb' },
                  { label: 'Espèces', value: 'cash' },
                  { label: 'Chèque', value: 'check' },
                  { label: 'Virement', value: 'transfer' },
                ]}
                onSave={(v) => onUpdatePatient('paymentMethod', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Envoi factures</span>
              <QuickEdit
                label="Mode d'envoi"
                value={patient.invoiceDelivery === 'email' ? 'Email' : patient.invoiceDelivery}
                type="select"
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Courrier', value: 'mail' },
                  { label: 'Sur place', value: 'inperson' },
                ]}
                onSave={(v) => onUpdatePatient('invoiceDelivery', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mutuelle</span>
              <QuickEdit
                label="Mutuelle"
                value={patient.mutuelle}
                type="textarea"
                hint="Nom et niveau de couverture"
                onSave={(v) => onUpdatePatient('mutuelle', v)}
              />
            </div>
          </div>
        </Card>

        <Card title="Rappels" icon="bell" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mode</span>
              <QuickEdit
                label="Mode de rappel"
                value={patient.reminderMode === 'sms' ? 'SMS' : patient.reminderMode}
                type="select"
                options={[
                  { label: 'SMS', value: 'sms' },
                  { label: 'Email', value: 'email' },
                  { label: 'Aucun', value: 'none' },
                ]}
                onSave={(v) => onUpdatePatient('reminderMode', v)}
              />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Rappels automatiques</span>
              <QuickEdit
                label="Rappels automatiques"
                value={patient.autoReminders === 'on' ? 'Activés' : 'Désactivés'}
                type="select"
                options={[
                  { label: 'Activés', value: 'on' },
                  { label: 'Désactivés', value: 'off' },
                ]}
                onSave={(v) => onUpdatePatient('autoReminders', v)}
              />
            </div>
          </div>
        </Card>
      </CardCollection>
    </>
  );
}

// ================================================================
// BillCreationPanel — Workflow panel for creating new bills
// ================================================================
function BillCreationPanel({ patient, onClose, onConfirm }) {
  const [selectedActes, setSelectedActes] = useState([
    { id: 'consult', label: 'Consultation ostéopathique (adulte)', price: 75, selected: true },
  ]);
  const [sendMethod, setSendMethod] = useState('email');

  const availableActes = [
    { id: 'consult', label: 'Consultation ostéopathique (adulte)', price: 75 },
    { id: 'posture', label: 'Rééducation posturale', price: 60 },
    { id: 'sport', label: 'Ostéopathie sportive', price: 80 },
    { id: 'pediatric', label: 'Consultation pédiatrique', price: 65 },
  ];

  const toggleActe = (id) => {
    setSelectedActes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const total = selectedActes.filter((a) => a.selected).reduce((sum, a) => sum + a.price, 0);

  const handleConfirm = () => {
    const actes = selectedActes.filter((a) => a.selected);
    onConfirm({ actes, total, sendMethod });
  };

  return (
    <WorkflowPanel
      label="Nouvelle facture"
      onClose={onClose}
      confirmButton={{ label: 'Créer et envoyer', onClick: handleConfirm }}
      cancelButton={{ label: 'Annuler', onClick: onClose }}
    >
      <div className="nr-bill-form">
        <section className="nr-bill-form__section">
          <h3 className="nr-bill-form__section-title">Patient</h3>
          <div className="nr-bill-form__field">
            <span className="nr-bill-form__field-label">Nom</span>
            <span className="nr-bill-form__field-value">{patient.name}</span>
          </div>
          <div className="nr-bill-form__field">
            <span className="nr-bill-form__field-label">Date</span>
            <span className="nr-bill-form__field-value">28 mai 2026</span>
          </div>
        </section>

        <section className="nr-bill-form__section">
          <h3 className="nr-bill-form__section-title">Actes réalisés</h3>
          {availableActes.map((acte) => {
            const isSelected = selectedActes.find((a) => a.id === acte.id)?.selected;
            return (
              <label key={acte.id} className="nr-bill-form__checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleActe(acte.id)}
                />
                <span className="nr-bill-form__checkbox-label">
                  {acte.label}
                  <span className="nr-bill-form__checkbox-price">{acte.price} €</span>
                </span>
              </label>
            );
          })}
        </section>

        <section className="nr-bill-form__section">
          <h3 className="nr-bill-form__section-title">Envoi</h3>
          <div className="nr-bill-form__field">
            <label className="nr-bill-form__field-label">Mode d'envoi</label>
            <select
              className="pd-field__input"
              value={sendMethod}
              onChange={(e) => setSendMethod(e.target.value)}
            >
              <option value="email">Email ({patient.email})</option>
              <option value="print">Imprimer</option>
              <option value="none">Enregistrer sans envoyer</option>
            </select>
          </div>
        </section>

        <section className="nr-bill-form__total">
          <span className="nr-bill-form__total-label">Total</span>
          <span className="nr-bill-form__total-value">{total} €</span>
        </section>
      </div>
    </WorkflowPanel>
  );
}

Object.assign(window, {
  TabSante,
  TabFinancier,
  TabHistorique,
  TabAdministratif,
  BillCreationPanel,
});
