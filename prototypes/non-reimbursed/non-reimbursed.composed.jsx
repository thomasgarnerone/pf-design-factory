/* global React, Icon, Button, IconButton, FloatingPopover */

const { useState, useRef, useId } = React;

// ---- ChildViewHeader -------------------------------------------
function ChildViewHeader({ avatar, label, sub, onBack, primaryAction, actions = [] }) {
  return (
    <header className="pd-cvheader" data-comp="ChildViewHeader">
      <div className="pd-cvheader__left">
        <IconButton icon="arrow-left" label="Back" onClick={onBack} />
        {avatar && <div className="pd-avatar">{avatar}</div>}
        <div className="pd-cvheader__title">
          <h1 className="pd-cvheader__name">{label}</h1>
          {sub && (
            <div className="pd-cvheader__sub">
              {sub.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="dot"></span>}
                  <span>{s}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="pd-cvheader__actions">
        {actions.map((a, i) => (
          <IconButton key={i} icon={a.icon} label={a.label} onClick={a.onClick} variant="outlined" />
        ))}
        {primaryAction && (
          <Button variant="solid" ui="brand" icon={primaryAction.icon} onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
      </div>
    </header>
  );
}

// ---- ActionBar --------------------------------------------------
function ActionBar({ groups, activeId, onSelect }) {
  return (
    <aside className="pd-actionbar" data-comp="ActionBar">
      {groups.map((g, gi) => (
        <div key={gi} className="pd-actionbar__group">
          {g.heading && <div className="pd-actionbar__heading">{g.heading}</div>}
          {g.items.map((it) => (
            <button
              key={it.id}
              className={`pd-actionbar__item ${activeId === it.id ? 'is-active' : ''}`}
              onClick={() => onSelect(it.id)}
            >
              <Icon name={it.icon} size={16} />
              <span>{it.label}</span>
              {it.count !== undefined && <span className="pd-actionbar__count">{it.count}</span>}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

// ---- SectionMenu (tabs + panels) -------------------------------
function SectionMenu({ items, liveItem, selectedId, onSelectionChange, children }) {
  const all = liveItem ? [...items, liveItem] : items;
  return (
    <section className="pd-sectionmenu" data-comp="SectionMenu">
      <div role="tablist" className="pd-sectionmenu__tabs">
        {items.map((it) => (
          <button
            key={it.id}
            role="tab"
            aria-selected={selectedId === it.id}
            className="pd-sectionmenu__tab"
            onClick={() => onSelectionChange(it.id)}
          >
            {it.icon && <Icon name={it.icon} size={16} />}
            <span>{it.label}</span>
          </button>
        ))}
        {liveItem && (
          <button
            role="tab"
            aria-selected={selectedId === liveItem.id}
            className="pd-sectionmenu__tab pd-sectionmenu__tab--live"
            onClick={() => onSelectionChange(liveItem.id)}
            title="Live consultation in progress"
          >
            <span className="pd-sectionmenu__live-dot"></span>
            <span>{liveItem.label}</span>
          </button>
        )}
      </div>
      <div className="pd-sectionmenu__panels">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          const id = child.props.id;
          const hidden = id !== selectedId;
          return (
            <div role="tabpanel" hidden={hidden}
                 className={`pd-sectionmenu__panel ${hidden ? 'pd-sectionmenu__panel--hidden' : ''}`}>
              {child}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---- CardCollection --------------------------------------------
function CardCollection({ label, primaryAction, actions = [], childView, children }) {
  return (
    <section className="pd-cardcollection" data-comp="CardCollection">
      <header className="pd-cardcollection__header">
        <h2 className="pd-cardcollection__title">
          {label}
          {childView && (
            <a href="#" onClick={(e) => { e.preventDefault(); childView.onClick?.(); }} className="pd-forward" aria-label={childView.ariaLabel}>
              <Icon name="arrow-right" size={14} />
            </a>
          )}
        </h2>
        <div className="pd-cardcollection__header-actions">
          {actions.map((a, i) => <IconButton key={i} icon={a.icon} label={a.label} onClick={a.onClick} />)}
          {primaryAction && (
            <Button variant="outlined" ui="brand" size="small" icon={primaryAction.icon} onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
        </div>
      </header>
      <div className="pd-cardcollection__grid">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          const size = child.props.size || 'medium';
          return <div data-card-size={size}>{child}</div>;
        })}
      </div>
    </section>
  );
}

// Card primitive used inside CardCollection
function Card({ title, icon, children }) {
  return (
    <article className="pd-card">
      {title && <h3 className="pd-card__title">{icon && <Icon name={icon} size={14} />}{title}</h3>}
      {children}
    </article>
  );
}

// ---- InlineButton ----------------------------------------------
function InlineButton({ label, icon, iconPosition = 'start', color = 'brand', onClick }) {
  const cls = `pd-inlinebutton ${color === 'neutral' ? 'pd-inlinebutton--neutral' : ''} ${iconPosition === 'end' ? 'pd-inlinebutton--end' : ''}`;
  return (
    <button className={cls} onClick={onClick} data-comp="InlineButton">
      {icon && <Icon name={icon} size={14} />}
      <span>{label}</span>
    </button>
  );
}

// ---- QuickEdit -------------------------------------------------
// Renders an inline trigger button; opening the floating popover
// shows a single-field form. Returns { trigger element + popover }.
function QuickEdit({ label, value, onSave, type = 'text', placeholder, options, hint, icon = 'pencil' }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const triggerRef = useRef(null);
  const inputId = useId();

  const startEdit = () => { setDraft(value ?? ''); setOpen(true); };
  const cancel = () => setOpen(false);
  const submit = (e) => { e?.preventDefault?.(); onSave(draft || null); setOpen(false); };

  const isEmpty = value == null || value === '';

  return (
    <>
      <button
        ref={triggerRef}
        className={`pd-quickedit-trigger ${isEmpty ? 'pd-quickedit-trigger--empty' : ''}`}
        onClick={startEdit}
        data-comp="QuickEdit"
      >
        <span>{isEmpty ? `Add ${label.toLowerCase()}` : value}</span>
        <Icon name={icon} size={14} />
      </button>
      <FloatingPopover open={open} anchorRef={triggerRef} onClose={cancel}>
        <form className="pd-quickedit-popover" onSubmit={submit}>
          <div>
            <label className="pd-quickedit-popover__label" htmlFor={inputId}>{label}</label>
            {hint && <div className="pd-quickedit-popover__hint">{hint}</div>}
          </div>
          {type === 'select' ? (
            <select id={inputId} className="pd-field__input" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus>
              <option value="">—</option>
              {(options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : type === 'textarea' ? (
            <textarea id={inputId} className="pd-field__input pd-textarea"
              value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder} autoFocus />
          ) : (
            <input id={inputId} type={type} className="pd-field__input"
              value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder} autoFocus />
          )}
          <div className="pd-quickedit-popover__actions">
            <Button variant="transparent" ui="neutral" size="small" type="button" onClick={cancel}>Cancel</Button>
            <Button variant="outlined" ui="brand" size="small" type="submit">{isEmpty ? 'Add' : 'Save'}</Button>
          </div>
        </form>
      </FloatingPopover>
    </>
  );
}

// ---- WorkflowPanel ---------------------------------------------
function WorkflowPanel({ label, stepBack, actions = [], onClose, confirmButton, cancelButton, alternativeButton, children }) {
  return (
    <section className="pd-workflowpanel" role="complementary" aria-label={label} data-comp="WorkflowPanel">
      <header className="pd-workflowpanel__header">
        <h2 className="pd-workflowpanel__title">
          {stepBack && <IconButton icon="arrow-left" label="Back" onClick={stepBack.onClick} />}
          <span>{label}</span>
        </h2>
        <div className="pd-workflowpanel__title-actions">
          {actions.map((a, i) => <IconButton key={i} icon={a.icon} label={a.label} onClick={a.onClick} />)}
          <IconButton icon="ellipsis" label="More" />
          <IconButton icon="xmark-large" label="Close" onClick={onClose} />
        </div>
      </header>
      <div className="pd-workflowpanel__body">{children}</div>
      <footer className="pd-workflowpanel__footer">
        {alternativeButton && <Button variant="outlined" ui="brand" onClick={alternativeButton.onClick}>{alternativeButton.label}</Button>}
        {cancelButton && <Button variant="transparent" ui="neutral" onClick={cancelButton.onClick}>{cancelButton.label}</Button>}
        {confirmButton && <Button variant="solid" ui="brand" onClick={confirmButton.onClick}>{confirmButton.label}</Button>}
      </footer>
    </section>
  );
}

// ---- Workspace + Focus -----------------------------------------
function Workspace({ actionBar, children }) {
  return (
    <div className="pd-workspace" data-comp="Workspace">
      {actionBar}
      {children}
    </div>
  );
}
function Focus({ children }) {
  return <main className="pd-focus" data-comp="Focus">{children}</main>;
}

Object.assign(window, {
  ChildViewHeader, ActionBar, SectionMenu, CardCollection, Card,
  InlineButton, QuickEdit, WorkflowPanel, Workspace, Focus,
});

// ================================================================
// Non-reimbursed cluster — Tab components (pure Oxygen DS)
// ================================================================

/* global CardCollection, Card, QuickEdit, InlineButton, WorkflowPanel */

// Tab Santé
function TabSante({ patient, onUpdatePatient }) {
  return (
    <>
      {/* MODULE: Suivi ostéopathique */}
      <CardCollection label="Suivi ostéopathique" primaryAction={{
        label: 'Nouvelle séance', icon: 'plus', onClick: () => alert('Créer nouvelle séance (démo)')
      }}>
        <Card title="Motif principal" icon="stethoscope" size="large">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <QuickEdit label="Motif principal" value={patient.motifPrincipal} type="textarea"
                onSave={(v) => onUpdatePatient('motifPrincipal', v)} />
            </div>
          </div>
        </Card>
        <Card title="Zones de traitement" icon="user" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
                {patient.zones.map((zone) => (
                  <span key={zone} className="ox-chip ox-chip--selected">{zone}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card title="Fréquence de suivi" icon="calendar" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Rythme</span>
              <span className="pd-card__rowvalue">Mensuel</span>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Nombre de séances</span>
              <span className="pd-card__rowvalue">{patient.nbSeances} séances</span>
            </div>
          </div>
        </Card>
      </CardCollection>

      {/* MODULE: Historique médical */}
      <CardCollection label="Historique médical">
        <Card title="Chirurgies et pathologies" icon="file-lines" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Chirurgies</span>
              <QuickEdit label="Chirurgies" value={patient.chirurgies} type="textarea"
                onSave={(v) => onUpdatePatient('chirurgies', v)} />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Pathologies</span>
              <QuickEdit label="Pathologies" value={patient.pathologies} type="textarea"
                onSave={(v) => onUpdatePatient('pathologies', v)} />
            </div>
          </div>
        </Card>
        <Card title="Médicaments actuels" icon="pills" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row" style={{ display: 'block' }}>
              <QuickEdit label="Médicaments" value={patient.medicaments} type="textarea"
                onSave={(v) => onUpdatePatient('medicaments', v)} />
            </div>
          </div>
        </Card>
      </CardCollection>
    </>
  );
}

// Tab Financier
function TabFinancier({ bills, onCreateBill, onViewBill, onSendBill, onRemindBill }) {
  const stats = {
    total: bills.reduce((sum, b) => sum + b.amountRaw, 0),
    paid: bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amountRaw, 0),
    pending: bills.filter((b) => b.status === 'pending').reduce((sum, b) => sum + b.amountRaw, 0),
    overdue: bills.filter((b) => b.status === 'overdue').reduce((sum, b) => sum + b.amountRaw, 0),
  };
  
  return (
    <>
      {/* MODULE: Facturation */}
      <CardCollection label="Facturation" primaryAction={{ label: 'Nouvelle facture', icon: 'plus', onClick: onCreateBill }}>
        <Card title="Total facturé" icon="info-circle" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{fontSize: '2rem', fontWeight: 700}}>{stats.total} €</span>
            </div>
          </div>
        </Card>
        <Card title="Payé" icon="circle-check" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{fontSize: '2rem', fontWeight: 700, color: 'var(--oxygen-color-semantic-success-prominent-stronger)'}}>{stats.paid} €</span>
            </div>
          </div>
        </Card>
        <Card title="En attente" icon="clock" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{fontSize: '2rem', fontWeight: 700, color: 'var(--oxygen-color-semantic-warning-prominent-stronger)'}}>{stats.pending} €</span>
            </div>
          </div>
        </Card>
        <Card title="Impayé" icon="bell" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowvalue" style={{fontSize: '2rem', fontWeight: 700, color: 'var(--oxygen-color-semantic-danger-prominent-stronger)'}}>{stats.overdue} €</span>
            </div>
          </div>
        </Card>
      </CardCollection>

      {/* MODULE: Factures */}
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
                <span className="pd-card__rowvalue">{bill.actes.join(', ')}</span>
              </div>
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Montant</span>
                <span className="pd-card__rowvalue" style={{fontWeight: 600}}>{bill.amount}</span>
              </div>
              <div className="pd-card__row">
                <span className="pd-card__rowlabel">Statut</span>
                <span className={`ox-pill ox-pill--${bill.status === 'paid' ? 'success' : bill.status === 'pending' ? 'warning' : 'danger'} ox-pill--subtle`}>
                  {bill.status === 'paid' ? 'Payée' : bill.status === 'pending' ? 'En attente' : 'Impayée'}
                </span>
              </div>
              <div className="pd-card__row" style={{paddingTop: '.8rem', gap: '.8rem'}}>
                <InlineButton label="Voir" icon="file-lines" onClick={() => onViewBill(bill)} />
                {bill.status !== 'paid' && <InlineButton label="Envoyer" icon="envelope" onClick={() => onSendBill(bill)} />}
                {bill.status === 'overdue' && <InlineButton label="Relancer" icon="bell" onClick={() => onRemindBill(bill)} />}
              </div>
            </div>
          </Card>
        ))}
      </CardCollection>
    </>
  );
}

// Tab Historique
function TabHistorique({ consultations }) {
  return (
    <CardCollection label="Historique des consultations">
      {consultations.map((consult, idx) => (
        <Card key={idx} title={consult.date} icon="calendar-day" size="large">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Zones traitées</span>
              <span className="pd-card__rowvalue">{consult.zones.join(', ')}</span>
            </div>
            <div className="pd-card__row" style={{ display: 'block' }}>
              <span className="pd-card__rowlabel">Notes de séance</span>
              <p style={{margin: '.8rem 0 0', color: 'var(--oxygen-color-semantic-neutral-prominent-base)'}}>{consult.note}</p>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Facturation</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '.8rem'}}>
                <span className={`ox-pill ox-pill--${consult.billStatus === 'paid' ? 'success' : consult.billStatus === 'pending' ? 'warning' : 'danger'} ox-pill--subtle`}>
                  {consult.billStatus === 'paid' ? 'Payée' : consult.billStatus === 'pending' ? 'En attente' : 'Impayée'}
                </span>
                <span style={{fontWeight: 600}}>{consult.amount}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </CardCollection>
  );
}

// Tab Administratif
function TabAdministratif({ patient, onUpdatePatient }) {
  return (
    <>
      {/* MODULE: Coordonnées */}
      <CardCollection label="Coordonnées">
        <Card title="Contact principal" icon="phone" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Téléphone</span>
              <QuickEdit label="Téléphone" value={patient.phone} type="tel" icon="phone"
                onSave={(v) => onUpdatePatient('phone', v)} />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Email</span>
              <QuickEdit label="Email" value={patient.email} type="email" icon="envelope"
                onSave={(v) => onUpdatePatient('email', v)} />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Adresse</span>
              <QuickEdit label="Adresse" value={patient.address} icon="map-pin"
                onSave={(v) => onUpdatePatient('address', v)} />
            </div>
          </div>
        </Card>
        <Card title="Contact d'urgence" icon="bell" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Nom</span>
              <QuickEdit label="Nom du contact" value={patient.emergencyName}
                onSave={(v) => onUpdatePatient('emergencyName', v)} />
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Téléphone</span>
              <QuickEdit label="Téléphone" value={patient.emergencyPhone} type="tel"
                onSave={(v) => onUpdatePatient('emergencyPhone', v)} />
            </div>
          </div>
        </Card>
      </CardCollection>

      {/* MODULE: Préférences */}
      <CardCollection label="Préférences">
        <Card title="Paiement et facturation" icon="info-circle" size="medium">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mode de paiement</span>
              <span className="pd-card__rowvalue">Carte bancaire</span>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mutuelle</span>
              <QuickEdit label="Mutuelle" value={patient.mutuelle} type="textarea"
                onSave={(v) => onUpdatePatient('mutuelle', v)} />
            </div>
          </div>
        </Card>
        <Card title="Rappels" icon="bell" size="small">
          <div className="pd-card__rows">
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Mode</span>
              <span className="pd-card__rowvalue">SMS</span>
            </div>
            <div className="pd-card__row">
              <span className="pd-card__rowlabel">Rappels automatiques</span>
              <span className="pd-card__rowvalue">Activés</span>
            </div>
          </div>
        </Card>
      </CardCollection>
    </>
  );
}

// BillCreationPanel
function BillCreationPanel({ patient, onClose, onConfirm }) {
  const [selectedActes, setSelectedActes] = React.useState([
    { id: 'consult', label: 'Consultation ostéopathique (adulte)', price: 75, selected: true },
    { id: 'posture', label: 'Rééducation posturale', price: 60, selected: false },
    { id: 'sport', label: 'Ostéopathie sportive', price: 80, selected: false },
  ]);
  const [sendMethod, setSendMethod] = React.useState('email');
  
  const toggleActe = (id) => {
    setSelectedActes((prev) => prev.map((a) => a.id === id ? { ...a, selected: !a.selected } : a));
  };
  
  const total = selectedActes.filter((a) => a.selected).reduce((sum, a) => sum + a.price, 0);
  
  return (
    <WorkflowPanel label="Nouvelle facture" onClose={onClose}
      confirmButton={{ label: 'Créer et envoyer', onClick: () => onConfirm({ actes: selectedActes.filter(a => a.selected), total, sendMethod }) }}
      cancelButton={{ label: 'Annuler', onClick: onClose }}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '2.4rem'}}>
        <section>
          <h3 style={{font: '600 1.4rem/1.4 var(--oxygen-font-primitive-fontFamily-base)', marginBottom: '1.2rem'}}>Patient</h3>
          <div className="pd-card__row">
            <span className="pd-card__rowlabel">Nom</span>
            <span className="pd-card__rowvalue">{patient.name}</span>
          </div>
        </section>
        
        <section>
          <h3 style={{font: '600 1.4rem/1.4 var(--oxygen-font-primitive-fontFamily-base)', marginBottom: '1.2rem'}}>Actes réalisés</h3>
          {selectedActes.map((acte) => (
            <div key={acte.id} className="pd-card__row">
              <label style={{display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer'}}>
                <input type="checkbox" checked={acte.selected} onChange={() => toggleActe(acte.id)}
                  style={{width: '1.8rem', height: '1.8rem'}} />
                <span style={{flex: 1}}>{acte.label}</span>
                <span style={{fontWeight: 600, color: 'var(--oxygen-color-semantic-brand-prominent-base)'}}>{acte.price} €</span>
              </label>
            </div>
          ))}
        </section>
        
        <section>
          <h3 style={{font: '600 1.4rem/1.4 var(--oxygen-font-primitive-fontFamily-base)', marginBottom: '1.2rem'}}>Envoi</h3>
          <div className="pd-card__row">
            <label className="pd-card__rowlabel">Mode d'envoi</label>
            <select value={sendMethod} onChange={(e) => setSendMethod(e.target.value)}
              style={{padding: '0.8rem 1.2rem', border: '0.1rem solid var(--oxygen-color-semantic-neutral-subtle-base)', borderRadius: '0.6rem'}}>
              <option value="email">Email ({patient.email})</option>
              <option value="print">Imprimer</option>
              <option value="none">Enregistrer sans envoyer</option>
            </select>
          </div>
        </section>
        
        <div className="pd-card__row" style={{padding: '1.6rem', background: 'var(--oxygen-color-semantic-brand-subtle-weak)', borderRadius: '0.8rem'}}>
          <span style={{fontSize: '1.6rem', fontWeight: 600}}>Total</span>
          <span style={{fontSize: '2.4rem', fontWeight: 700, color: 'var(--oxygen-color-semantic-brand-prominent-strong)'}}>{total} €</span>
        </div>
      </div>
    </WorkflowPanel>
  );
}

Object.assign(window, { TabSante, TabFinancier, TabHistorique, TabAdministratif, BillCreationPanel });
