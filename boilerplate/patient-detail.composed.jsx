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
