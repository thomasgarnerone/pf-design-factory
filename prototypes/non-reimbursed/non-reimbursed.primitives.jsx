/* global React, Icon */
/* Cluster-specific primitives for non-reimbursed care */

const { useState } = React;

// ---- BillStatusBadge -------------------------------------------
// Visual indicator for bill payment status
function BillStatusBadge({ status }) {
  const config = {
    paid: { label: 'Payée', color: 'success' },
    pending: { label: 'En attente', color: 'warning' },
    overdue: { label: 'Impayée', color: 'danger' },
    draft: { label: 'Brouillon', color: 'neutral' },
    sent: { label: 'Envoyée', color: 'info' },
  };

  const { label, color } = config[status] || config.pending;

  return (
    <span className={`nr-bill-badge nr-bill-badge--${color}`} data-status={status}>
      {label}
    </span>
  );
}

// ---- ZoneChip --------------------------------------------------
// Chip for anatomical treatment zones
function ZoneChip({ label, selected, onClick }) {
  return (
    <button
      className={`nr-zone-chip ${selected ? 'nr-zone-chip--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

Object.assign(window, {
  BillStatusBadge,
  ZoneChip,
});
