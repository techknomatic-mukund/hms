import { useEffect, useState } from 'react'
import { Modal, Badge } from './UI'
import { FormActions, FormField } from './FormFields'
import { QC_CHECKLIST } from '../utils/laundryHelpers'

export default function QualityInspectionModal({ open, onClose, onSubmit, order }) {
  const [checks, setChecks] = useState([])
  const [inspector, setInspector] = useState('')
  const [notes, setNotes] = useState('')
  const [passed, setPassed] = useState(null)

  useEffect(() => {
    if (!open || !order) return
    const qc = order.qualityCheck
    setChecks(qc?.checks || [])
    setInspector(qc?.inspector || '')
    setNotes(qc?.notes || '')
    setPassed(qc?.passed ?? null)
  }, [open, order])

  const toggleCheck = (item) => {
    setChecks((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!order) return
    const allPassed = checks.length === QC_CHECKLIST.length
    onSubmit(order.id, {
      passed: allPassed,
      inspector: inspector.trim() || 'QC Staff',
      notes: notes.trim(),
      checks: [...checks],
      time: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    })
    onClose()
  }

  if (!open || !order) return null

  return (
    <Modal open={open} onClose={onClose} title={`Quality Inspection — ${order.id}`}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="qc-header">
          <p><strong>{order.guest}</strong> · Room {order.room} · {order.items}</p>
          {order.qualityCheck?.passed != null && (
            <Badge variant={order.qualityCheck.passed ? 'success' : 'warning'}>
              {order.qualityCheck.passed ? 'Previously Passed' : 'Failed — Re-inspect'}
            </Badge>
          )}
        </div>
        <div className="form-field form-field-full">
          <span>Inspection Checklist</span>
          <ul className="qc-checklist">
            {QC_CHECKLIST.map((item) => (
              <li key={item}>
                <label className={`checklist-item${checks.includes(item) ? ' done' : ''}`}>
                  <input type="checkbox" checked={checks.includes(item)} onChange={() => toggleCheck(item)} />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-grid">
          <FormField label="Inspector">
            <input type="text" value={inspector} placeholder="Staff name" onChange={(e) => setInspector(e.target.value)} />
          </FormField>
          <FormField label="Notes" full>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        </div>
        {checks.length === QC_CHECKLIST.length && (
          <p className="qc-pass-msg">All checks passed — ready for delivery.</p>
        )}
        <FormActions onCancel={onClose} submitLabel="Complete Inspection" />
      </form>
    </Modal>
  )
}
