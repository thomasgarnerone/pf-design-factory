/* global React, ReactDOM, loadIconSprite,
   Workspace, Focus, ActionBar, ChildViewHeader, SectionMenu,
   CardCollection, Card, InlineButton, QuickEdit, WorkflowPanel,
   Button, IconButton, Icon */

const { useState, useEffect } = React;

const ICONS = [
  'ArrowLeft','ArrowRight','ChevronRight','ChevronDown','ChevronLeft',
  'XmarkLarge','Plus','Pencil','PenToSquare',
  { base: 'Bars', id: 'ellipsis' }, // fallback if no ellipsis specifically
  'CalendarDay','Calendar','CalendarPlus','Clock',
  'Phone','Envelope','MapPin','LocationDot',
  'User','UserDoctor','Stethoscope','HeartPulse','Pills','EPrescription','FileLines',
  'Bell','MagnifyingGlass','Star','Heart','Filter','Gear','InfoCircle',
  'Paperclip','Print','Share','TrashCan','CircleCheck','Sparkles',
];

// Add an ellipsis-style icon by re-using one if a real one isn't in the sprite
// (the real lib has 'EllipsisHorizontal' etc but only 'Bars' is guaranteed).

function App() {
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState('overview');
  const [actionBarItem, setActionBarItem] = useState('today');
  const [workflowOpen, setWorkflowOpen] = useState(false);

  // Editable patient fields (drive QuickEdit)
  const [patient, setPatient] = useState({
    phone: '+33 6 12 34 56 78',
    email: 'marie.leroy@example.com',
    address: '24 rue Saint-Antoine, 75004 Paris',
    bloodType: 'O+',
    allergies: 'Penicillin (severe)',
    occupation: '',
    emergency: 'Lucas Leroy · +33 6 98 76 54 32',
    insurance: 'CPAM Paris · #1 65 04 75 108 213 42',
  });

  // Consultation note draft (workflow panel)
  const [note, setNote] = useState({
    title: 'Follow-up · Hypertension',
    reason: '',
    exam: '',
    plan: '',
    chips: ['Hypertension','Annual check-up'],
  });

  useEffect(() => {
    loadIconSprite(ICONS).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  const setField = (k, v) => setPatient((p) => ({ ...p, [k]: v }));

  const actionBarGroups = [
    {
      heading: 'Today',
      items: [
        { id: 'today', label: 'My agenda', icon: 'calendar-day', count: 14 },
        { id: 'waitingroom', label: 'Waiting room', icon: 'user-group' in window ? 'user-group' : 'user', count: 3 },
        { id: 'messages', label: 'Messages', icon: 'envelope', count: 7 },
      ],
    },
    {
      heading: 'Patients',
      items: [
        { id: 'patients', label: 'All patients', icon: 'user' },
        { id: 'starred', label: 'Starred', icon: 'star' },
        { id: 'recent', label: 'Recently seen', icon: 'clock' },
      ],
    },
    {
      heading: 'Practice',
      items: [
        { id: 'prescriptions', label: 'Prescriptions', icon: 'e-prescription' },
        { id: 'documents', label: 'Documents', icon: 'file-lines' },
        { id: 'settings', label: 'Settings', icon: 'gear' },
      ],
    },
  ];

  const sectionItems = [
    { id: 'overview',     label: 'Overview',      icon: 'user' },
    { id: 'history',      label: 'Medical history', icon: 'heart-pulse' },
    { id: 'prescriptions',label: 'Prescriptions', icon: 'pills' },
    { id: 'documents',    label: 'Documents',     icon: 'file-lines' },
    { id: 'billing',      label: 'Billing',       icon: 'info-circle' },
  ];
  const liveItem = workflowOpen ? { id: 'consultation', label: 'Consultation note' } : undefined;

  // The Overview tab is the most densely composed: it contains 4
  // CardCollections, each holding several Cards which themselves
  // host QuickEdit and InlineButton fields.
  const overview = (
    <>
      <CardCollection
        label="Identity & contact"
        primaryAction={{ label: 'Edit identity', icon: 'pen-to-square', onClick: () => alert('Edit identity (demo)') }}
        actions={[{ icon: 'paperclip', label: 'Attach' }]}
        childView={{ ariaLabel: 'Open full identity record', onClick: () => alert('Open identity child view (demo)') }}
      >
        <Card title="Contact" icon="phone" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row"><span className="pd-card__rowlabel">Phone</span>
              <QuickEdit label="Phone" value={patient.phone} type="tel" icon="phone"
                         onSave={(v) => setField('phone', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Email</span>
              <QuickEdit label="Email" value={patient.email} type="email" icon="envelope"
                         onSave={(v) => setField('email', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Address</span>
              <QuickEdit label="Address" value={patient.address} icon="map-pin"
                         onSave={(v) => setField('address', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Occupation</span>
              <QuickEdit label="Occupation" value={patient.occupation}
                         placeholder="e.g. Architect"
                         onSave={(v) => setField('occupation', v)} /></div>
          </div>
        </Card>

        <Card title="Emergency & coverage" icon="info-circle" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row"><span className="pd-card__rowlabel">Contact</span>
              <QuickEdit label="Emergency contact" value={patient.emergency}
                         hint="Name and phone number of next of kin"
                         onSave={(v) => setField('emergency', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Insurance</span>
              <QuickEdit label="Insurance" value={patient.insurance}
                         onSave={(v) => setField('insurance', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Blood type</span>
              <QuickEdit label="Blood type" value={patient.bloodType} type="select"
                         options={['O−','O+','A−','A+','B−','B+','AB−','AB+'].map(v => ({label:v,value:v}))}
                         onSave={(v) => setField('bloodType', v)} /></div>
            <div className="pd-card__row"><span className="pd-card__rowlabel">Allergies</span>
              <QuickEdit label="Allergies" value={patient.allergies} type="textarea"
                         hint="Free text · use commas to separate"
                         onSave={(v) => setField('allergies', v)} /></div>
          </div>
        </Card>
      </CardCollection>

      <CardCollection
        label="Active care"
        primaryAction={{ label: 'New consultation', icon: 'plus',
                         onClick: () => setWorkflowOpen(true) }}
        actions={[{ icon: 'filter', label: 'Filter' }]}
      >
        <Card title="Conditions" icon="heart-pulse" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Active</span>
              <span className="pd-card__rowvalue">
                <InlineButton label="Hypertension" color="brand" icon="chevron-right" iconPosition="end"
                              onClick={() => alert('Open Hypertension record')} />
              </span>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel"></span>
              <span className="pd-card__rowvalue">
                <InlineButton label="Type 2 diabetes" color="brand" icon="chevron-right" iconPosition="end"
                              onClick={() => alert('Open Diabetes record')} />
              </span>
            </div>
            <div className="pd-card__row">
              <InlineButton label="Add condition" color="brand" icon="plus"
                            onClick={() => alert('Add condition')} />
            </div>
          </div>
        </Card>

        <Card title="Treatments" icon="pills" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{textAlign:'left'}}>
                <strong>Amlodipine 5 mg</strong><br/>
                <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-base)', fontSize:'1.2rem'}}>1 tablet daily · since Mar 2024</span>
              </span>
              <InlineButton label="Renew" icon="e-prescription"
                            onClick={() => alert('Renew Amlodipine')} />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{textAlign:'left'}}>
                <strong>Metformin 500 mg</strong><br/>
                <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-base)', fontSize:'1.2rem'}}>2 tablets daily · since Jan 2023</span>
              </span>
              <InlineButton label="Renew" icon="e-prescription"
                            onClick={() => alert('Renew Metformin')} />
            </div>
          </div>
        </Card>

        <Card title="Next visit" icon="calendar-day" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{flexDirection:'column', alignItems:'flex-start', gap:'.4rem'}}>
              <span style={{font:'600 1.6rem/1.3 var(--oxygen-font-primitive-fontFamily-base)'}}>Tue 14 Oct · 10:30</span>
              <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-base)', fontSize:'1.3rem'}}>30-min follow-up · in person</span>
            </div>
            <div className="pd-card__row" style={{borderTop:'.1rem dashed var(--oxygen-color-semantic-neutral-subtle-base)', paddingTop:'.8rem'}}>
              <InlineButton label="Reschedule" icon="calendar" color="neutral" />
              <InlineButton label="Cancel" color="neutral" />
            </div>
          </div>
        </Card>
      </CardCollection>

      <CardCollection
        label="Recent activity"
        actions={[{ icon: 'filter', label: 'Filter' }]}
        childView={{ ariaLabel: 'See full timeline', onClick: () => alert('Open timeline (demo)') }}
      >
        <Card title="Last consultation" icon="stethoscope" size="medium">
          <p style={{margin:0, color:'var(--oxygen-color-semantic-neutral-prominent-strong)', fontSize:'1.4rem', lineHeight:1.5}}>
            Tension stable à 13/8. Patient signale meilleure tolérance depuis l'ajustement de l'amlodipine.
            HbA1c en attente. À revoir dans 3 mois.
          </p>
          <div style={{display:'inline-flex', gap:'.8rem'}}>
            <InlineButton label="Open note" icon="file-lines" />
            <InlineButton label="Print" icon="print" color="neutral" />
          </div>
        </Card>

        <Card title="Latest documents" icon="file-lines" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <InlineButton label="Bilan sanguin – 22 Sep 2025" icon="file-lines" />
              <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-weak)', fontSize:'1.2rem'}}>PDF · 412 kB</span>
            </div>
            <div className="pd-card__row">
              <InlineButton label="Ordonnance – 14 Sep 2025" icon="e-prescription" />
              <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-weak)', fontSize:'1.2rem'}}>PDF · 88 kB</span>
            </div>
            <div className="pd-card__row">
              <InlineButton label="Compte-rendu cardio – 02 Sep 2025" icon="file-lines" />
              <span style={{color:'var(--oxygen-color-semantic-neutral-prominent-weak)', fontSize:'1.2rem'}}>PDF · 1.1 MB</span>
            </div>
          </div>
        </Card>
      </CardCollection>
    </>
  );

  const placeholder = (label) => (
    <div className="pd-cardcollection">
      <h2 className="pd-cardcollection__title">{label}</h2>
      <p className="pd-card__empty" style={{padding:'2.4rem 0'}}>Demo content lives on the Overview tab — switch back to see all 7 components composed.</p>
    </div>
  );

  return (
    <div className="pd-app">
      <header className="pd-topbar">
        <div className="pd-topbar__brand">
          <span className="pd-topbar__brand-mark">Dr</span>
          Doctolib
        </div>
        <div className="pd-topbar__crumbs">
          <span>Patients</span>
          <Icon name="chevron-right" size={12} />
          <strong>Marie Leroy</strong>
        </div>
        <div className="pd-topbar__right">
          <IconButton icon="magnifying-glass" label="Search" variant="outlined" />
          <IconButton icon="bell" label="Notifications" variant="outlined" />
          <div className="pd-avatar" style={{width:'3.6rem', height:'3.6rem', font:'700 1.3rem/1 var(--oxygen-font-primitive-fontFamily-base)'}}>JM</div>
        </div>
      </header>

      <Workspace actionBar={
        <ActionBar groups={actionBarGroups} activeId={actionBarItem} onSelect={setActionBarItem} />
      }>
        <Focus>
          <ChildViewHeader
            avatar="ML"
            label="Marie Leroy"
            sub={['58 yo · F', 'Patient since 2019', 'Last visit 22 Sep 2025']}
            onBack={() => alert('Back to patient list (demo)')}
            actions={[
              { icon: 'star', label: 'Star patient' },
              { icon: 'share', label: 'Share record' },
            ]}
            primaryAction={{
              label: 'Start consultation',
              icon: 'stethoscope',
              onClick: () => setWorkflowOpen(true),
            }}
          />

          <SectionMenu
            items={sectionItems}
            liveItem={liveItem}
            selectedId={section}
            onSelectionChange={setSection}
          >
            <div id="overview">{overview}</div>
            <div id="history">{placeholder('Medical history')}</div>
            <div id="prescriptions">{placeholder('Prescriptions')}</div>
            <div id="documents">{placeholder('Documents')}</div>
            <div id="billing">{placeholder('Billing')}</div>
            {workflowOpen && <div id="consultation">{placeholder('Consultation note (in-progress)')}</div>}
          </SectionMenu>
        </Focus>

        {workflowOpen && (
          <WorkflowPanel
            label="New consultation note"
            stepBack={{ onClick: () => setWorkflowOpen(false) }}
            actions={[{ icon: 'paperclip', label: 'Attach file' }]}
            onClose={() => setWorkflowOpen(false)}
            cancelButton={{ label: 'Discard', onClick: () => setWorkflowOpen(false) }}
            alternativeButton={{ label: 'Save draft', onClick: () => setWorkflowOpen(false) }}
            confirmButton={{ label: 'Sign & save', onClick: () => { alert('Signed (demo)'); setWorkflowOpen(false); } }}
          >
            <div className="pd-field">
              <label className="pd-field__label">Title</label>
              <input className="pd-field__input" value={note.title}
                     onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))} />
            </div>
            <div className="pd-field">
              <label className="pd-field__label">Reasons for the visit</label>
              <div className="pd-chiprow">
                {note.chips.map((c, i) => (
                  <button key={i} className="pd-chip"
                          onClick={() => setNote((n) => ({ ...n, chips: n.chips.filter((_, j) => j !== i) }))}>
                    {c}<Icon name="xmark-large" size={10} />
                  </button>
                ))}
                <button className="pd-chip pd-chip--neutral"
                        onClick={() => {
                          const v = prompt('Add reason');
                          if (v) setNote((n) => ({ ...n, chips: [...n.chips, v] }));
                        }}>
                  <Icon name="plus" size={10} /> Add
                </button>
              </div>
            </div>
            <div className="pd-field">
              <label className="pd-field__label">Examination</label>
              <textarea className="pd-field__input pd-textarea"
                        value={note.exam}
                        placeholder="Vitals, findings, observations…"
                        onChange={(e) => setNote((n) => ({ ...n, exam: e.target.value }))} />
            </div>
            <div className="pd-field">
              <label className="pd-field__label">Plan</label>
              <textarea className="pd-field__input pd-textarea"
                        value={note.plan}
                        placeholder="Tests, treatments, next appointment…"
                        onChange={(e) => setNote((n) => ({ ...n, plan: e.target.value }))} />
            </div>
          </WorkflowPanel>
        )}
      </Workspace>

      <div className="pd-legend">
        <div>
          <strong>Composed prototype</strong> — <code>Workspace</code> hosts <code>ActionBar</code> + <code>Focus</code>;
          inside Focus, <code>ChildViewHeader</code> + <code>SectionMenu</code> wrap <code>CardCollection</code>s of cards
          using <code>QuickEdit</code> and <code>InlineButton</code> fields. Click <em>Start consultation</em> to slide in the <code>WorkflowPanel</code>.
        </div>
        <Button variant="outlined" ui="brand" size="small"
                onClick={() => setWorkflowOpen((v) => !v)}>
          {workflowOpen ? 'Close workflow' : 'Open workflow'}
        </Button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
