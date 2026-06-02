/* global React, ReactDOM, loadIconSprite,
   Workspace, Focus, ActionBar, ChildViewHeader, SectionMenu,
   TabSante, TabFinancier, TabHistorique, TabAdministratif, BillCreationPanel,
   Button, IconButton, Icon */

const { useState, useEffect } = React;

const ICONS = [
  'ArrowLeft','ArrowRight','ChevronRight','ChevronDown',
  'XmarkLarge','Plus','Pencil','PenToSquare',
  'CalendarDay','Calendar','CalendarPlus','Clock',
  'Phone','Envelope','MapPin',
  'User','Stethoscope','Pills','FileLines',
  'Bell','MagnifyingGlass','Star','Filter','Gear','InfoCircle',
  'Paperclip','Print','Share','CircleCheck',
];

// ================================================================
// Patient data fixture (osteopath context)
// ================================================================
const INITIAL_PATIENT = {
  name: 'Sophie Mercier',
  initials: 'SM',
  ageSex: '38 ans · F',
  sinceLabel: 'Patiente depuis 2023',
  lastVisit: '14 mai 2026',
  phone: '+33 6 45 78 12 34',
  email: 'sophie.mercier@example.com',
  address: '17 rue de la Paix, 69001 Lyon',
  dob: '1987-09-12',
  occupation: 'Ergothérapeute',
  // Osteopathy-specific health data
  motifPrincipal: 'Douleurs cervicales chroniques et céphalées de tension · Suivi postural suite à scoliose légère (< 10°)',
  frequenceSuivi: 'monthly',
  nbSeances: 12,
  zones: ['Cervical', 'Thoracique', 'Lombaire', 'Bassin', 'Épaule droite'],
  chirurgies: 'Appendicectomie (2015)',
  pathologies: 'Scoliose légère (8°) · Migraines de tension récurrentes',
  contreIndications: 'Aucune contre-indication ostéopathique connue',
  medicaments: 'Ibuprofène 400 mg (au besoin) · Magnésium 300 mg/j',
  autresPraticiens: 'Kinésithérapeute (Dr. Arnaud Blanc) · Médecin traitant (Dr. Isabelle Fontaine)',
  // Administrative
  emergencyName: 'Julien Mercier',
  emergencyPhone: '+33 6 87 65 43 21',
  emergencyRelation: 'Conjoint',
  paymentMethod: 'cb',
  invoiceDelivery: 'email',
  mutuelle: 'MAAF Santé · couverture partielle actes para-médicaux',
  reminderMode: 'sms',
  autoReminders: 'on',
};

// ================================================================
// Bills data fixture
// ================================================================
const INITIAL_BILLS = [
  {
    id: 'F2026-018',
    date: '14 mai 2026',
    description: 'Séance du 14/05/2026',
    actes: ['Consultation ostéopathique (adulte)'],
    amount: '75 €',
    amountRaw: 75,
    status: 'pending',
  },
  {
    id: 'F2026-011',
    date: '30 avr. 2026',
    description: 'Séance du 30/04/2026',
    actes: ['Consultation ostéopathique (adulte)'],
    amount: '75 €',
    amountRaw: 75,
    status: 'paid',
  },
  {
    id: 'F2026-007',
    date: '5 avr. 2026',
    description: 'Séance du 05/04/2026',
    actes: ['Consultation ostéopathique (adulte)', 'Rééducation posturale'],
    amount: '135 €',
    amountRaw: 135,
    status: 'overdue',
  },
  {
    id: 'F2026-003',
    date: '12 mars 2026',
    description: 'Séance du 12/03/2026',
    actes: ['Consultation ostéopathique (adulte)'],
    amount: '75 €',
    amountRaw: 75,
    status: 'paid',
  },
];

// ================================================================
// Consultations data fixture
// ================================================================
const CONSULTATIONS = [
  {
    date: '14 mai 2026',
    zones: ['Cervical', 'Thoracique'],
    note: 'Amélioration rotation axiale gauche (+15°). Céphalées de tension diminuées. 3 séances complémentaires prescrites.',
    billStatus: 'pending',
    amount: '75 €',
  },
  {
    date: '30 avr. 2026',
    zones: ['Thoracique', 'Lombaire'],
    note: 'Mobilisation T4-T8 et L3-S1. Contractures paravertébrales droites persistantes. Exercices prescrits.',
    billStatus: 'paid',
    amount: '75 €',
  },
  {
    date: '5 avr. 2026',
    zones: ['Lombaire', 'Bassin', 'Épaule droite'],
    note: 'Séance rééducation posturale + traitement lombaire. Douleur épaule droite (TOS suspectée). Bilan radiologique suggéré.',
    billStatus: 'overdue',
    amount: '135 €',
  },
  {
    date: '12 mars 2026',
    zones: ['Cervical'],
    note: 'Séance ciblée cervicale. Forte tension C2-C4. Amélioration immédiate de la flexion.',
    billStatus: 'paid',
    amount: '75 €',
  },
];

function App() {
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState('sante');
  const [actionBarItem, setActionBarItem] = useState('agenda');
  const [billPanelOpen, setBillPanelOpen] = useState(false);

  const [patient, setPatient] = useState(INITIAL_PATIENT);
  const [bills, setBills] = useState(INITIAL_BILLS);

  useEffect(() => {
    loadIconSprite(ICONS, { spriteUrl: '../../boilerplate/_icon_sprite.json' })
      .then(() => setReady(true));
  }, []);

  if (!ready) return null;

  const updatePatient = (key, value) => {
    setPatient((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateBill = () => {
    setBillPanelOpen(true);
  };

  const handleBillConfirm = ({ actes, total, sendMethod }) => {
    const newBill = {
      id: `F2026-0${bills.length + 19}`,
      date: '28 mai 2026',
      description: 'Séance du 28/05/2026',
      actes: actes.map((a) => a.label),
      amount: `${total} €`,
      amountRaw: total,
      status: sendMethod === 'none' ? 'draft' : 'sent',
    };
    setBills((prev) => [newBill, ...prev]);
    setBillPanelOpen(false);
    setSection('financier');
  };

  const actionBarGroups = [
    {
      heading: "Aujourd'hui",
      items: [
        { id: 'agenda', label: 'Mon agenda', icon: 'calendar-day', count: 9 },
        { id: 'messages', label: 'Messages', icon: 'envelope', count: 2 },
      ],
    },
    {
      heading: 'Patients',
      items: [
        { id: 'patients', label: 'Tous les patients', icon: 'user' },
        { id: 'starred', label: 'Favoris', icon: 'star' },
        { id: 'recent', label: 'Récents', icon: 'clock' },
      ],
    },
    {
      heading: 'Cabinet',
      items: [
        { id: 'bills', label: 'Factures', icon: 'file-lines', count: 3 },
        { id: 'stats', label: 'Statistiques', icon: 'info-circle' },
        { id: 'settings', label: 'Paramètres', icon: 'gear' },
      ],
    },
  ];

  const sectionItems = [
    { id: 'sante', label: 'Santé', icon: 'stethoscope' },
    { id: 'financier', label: 'Financier', icon: 'info-circle' },
    { id: 'historique', label: 'Historique', icon: 'clock' },
    { id: 'administratif', label: 'Administratif', icon: 'file-lines' },
  ];

  return (
    <div className="pd-app">
      {/* TopBar */}
      <header className="pd-topbar">
        <div className="pd-topbar__brand">
          <span className="pd-topbar__brand-mark">Os</span>
          Cabinet d'ostéopathie
        </div>
        <div className="pd-topbar__crumbs">
          <span>Patients</span>
          <Icon name="chevron-right" size={12} />
          <strong>Sophie Mercier</strong>
        </div>
        <div className="pd-topbar__right">
          <IconButton icon="magnifying-glass" label="Rechercher" variant="outlined" />
          <IconButton icon="bell" label="Notifications" variant="outlined" />
          <div
            className="pd-avatar"
            style={{
              width: '3.6rem',
              height: '3.6rem',
              font: '700 1.3rem/1 var(--oxygen-font-primitive-fontFamily-base)',
            }}
          >
            LB
          </div>
        </div>
      </header>

      <Workspace
        actionBar={
          <ActionBar
            groups={actionBarGroups}
            activeId={actionBarItem}
            onSelect={setActionBarItem}
          />
        }
      >
        <Focus>
          <ChildViewHeader
            avatar="SM"
            label="Sophie Mercier"
            sub={['38 ans · F', 'Patiente depuis 2023', `Dernière séance : ${patient.lastVisit}`]}
            onBack={() => alert('Retour à la liste des patients (démo)')}
            actions={[
              { icon: 'star', label: 'Mettre en favori' },
              { icon: 'share', label: 'Partager le dossier' },
            ]}
            primaryAction={{
              label: 'Nouvelle facture',
              icon: 'plus',
              onClick: handleCreateBill,
            }}
          />

          <SectionMenu
            items={sectionItems}
            selectedId={section}
            onSelectionChange={setSection}
          >
            <div id="sante">
              <TabSante patient={patient} onUpdatePatient={updatePatient} />
            </div>
            <div id="financier">
              <TabFinancier
                bills={bills}
                onCreateBill={handleCreateBill}
                onViewBill={(b) => alert(`Voir facture ${b.id} (démo)`)}
                onSendBill={(b) => alert(`Envoyer facture ${b.id} (démo)`)}
                onRemindBill={(b) => alert(`Relancer facture ${b.id} (démo)`)}
              />
            </div>
            <div id="historique">
              <TabHistorique consultations={CONSULTATIONS} />
            </div>
            <div id="administratif">
              <TabAdministratif patient={patient} onUpdatePatient={updatePatient} />
            </div>
          </SectionMenu>
        </Focus>

        {billPanelOpen && (
          <BillCreationPanel
            patient={patient}
            onClose={() => setBillPanelOpen(false)}
            onConfirm={handleBillConfirm}
          />
        )}
      </Workspace>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
