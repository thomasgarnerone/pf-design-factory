/* global React */
/* Tiny set of icon + button + chip primitives for the prototype.
   These mirror the look of the real Oxygen primitives without
   pulling in the React runtime; they're enough to compose the 7
   higher-level components convincingly. */

const { useState, useEffect, useRef, useLayoutEffect } = React;

// ---- Icon helpers ------------------------------------------------
function Icon({ name, size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...rest}>
      <use href={`#${name}`} />
    </svg>
  );
}

// ---- Solid/outlined Buttons (Oxygen ox-button look) -------------
function Button({ variant = 'solid', ui = 'brand', size = 'medium', icon, iconEnd, children, ...rest }) {
  const cls = `ox-button ox-button--variant-${variant} ox-button--ui-${ui} ox-button--size-${size}`;
  return (
    <button className={cls} {...rest}>
      <span className="ox-button__innerWrapper">
        <span className="ox-button__hoverEffect"></span>
        <span className="ox-button__activeEffect"></span>
        <span className="ox-button__contentWrapper" style={{display:'inline-flex', alignItems:'center', gap:'.6rem'}}>
          {icon && <Icon name={icon} size={16} />}
          {children}
          {iconEnd && <Icon name={iconEnd} size={16} />}
        </span>
      </span>
    </button>
  );
}

function IconButton({ icon, label, variant = 'transparent', ui = 'neutral', size = 'small', ...rest }) {
  const cls = `ox-iconbutton ox-iconbutton--variant-${variant} ox-iconbutton--ui-${ui} ox-iconbutton--size-${size}`;
  return (
    <button className={cls} aria-label={label} title={label} {...rest}>
      <span className="ox-iconbutton__innerWrapper">
        <Icon name={icon} size={16} />
      </span>
    </button>
  );
}

// ---- Lightweight floating popover -------------------------------
// Used by QuickEdit. Anchors a content div under/over its trigger.
function FloatingPopover({ open, anchorRef, onClose, children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'bottom' });

  useLayoutEffect(() => {
    if (!open) return;
    const a = anchorRef.current;
    const c = ref.current;
    if (!a || !c) return;
    const r = a.getBoundingClientRect();
    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    let left = Math.min(window.innerWidth - cw - 8, Math.max(8, r.left));
    let top = r.bottom + 8;
    let placement = 'bottom';
    if (top + ch > window.innerHeight - 8) {
      top = Math.max(8, r.top - ch - 8);
      placement = 'top';
    }
    setPos({ top, left, placement });
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current?.contains(e.target)) return;
      if (anchorRef.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div className="pd-popover-layer" aria-hidden={false}>
      <div ref={ref} style={{ top: pos.top, left: pos.left }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Icon, Button, IconButton, FloatingPopover });
