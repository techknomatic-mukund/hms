import { Modal } from './UI'
import { FormActions } from './FormFields'

export default function DeleteConfirmModal({ open, onClose, onConfirm, itemName }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete">
      <p className="info-text">
        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={() => { onConfirm(); onClose() }}>Delete</button>
      </div>
    </Modal>
  )
}

export function ViewDetailModal({ open, onClose, title, data, fields }) {
  if (!open || !data) return null
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <dl className="detail-list">
        {fields.map(({ key, label, render }) => (
          <div key={key} className="detail-row">
            <dt>{label}</dt>
            <dd>{render ? render(data) : data[key]}</dd>
          </div>
        ))}
      </dl>
      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  )
}
