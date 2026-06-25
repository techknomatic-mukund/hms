import { Modal } from './UI'

export default function InfoModal({ open, onClose, title, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="info-modal-body">{children}</div>
      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>Got it</button>
      </div>
    </Modal>
  )
}
