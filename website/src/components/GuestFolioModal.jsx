import { useEffect, useState } from 'react'
import { Modal, Badge } from './UI'
import { FormField } from './FormFields'
import { folioTotals, formatINRAmount } from '../utils/frontOfficeHelpers'

const CHARGE_CATEGORIES = ['Room', 'Restaurant', 'Laundry', 'Spa', 'Add-on', 'Misc']

export default function GuestFolioModal({
  open, onClose, folios, reservations, preselectedId = null,
  onAddCharge, onAddPayment,
}) {
  const [folioId, setFolioId] = useState('')
  const [showCharge, setShowCharge] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [chargeForm, setChargeForm] = useState({ category: 'Misc', description: '', amount: '' })
  const [paymentForm, setPaymentForm] = useState({ method: 'Cash', type: 'Partial', amount: '' })

  useEffect(() => {
    if (!open) return
    setFolioId(preselectedId || folios[0]?.id || '')
    setShowCharge(false)
    setShowPayment(false)
  }, [open, preselectedId, folios])

  const folio = folios.find((f) => f.id === folioId)
  const totals = folio ? folioTotals(folio) : null

  const handleAddCharge = (e) => {
    e.preventDefault()
    if (!folio || !chargeForm.description || !chargeForm.amount) return
    const amount = parseFloat(chargeForm.amount)
    onAddCharge(folio.id, {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      category: chargeForm.category,
      description: chargeForm.description,
      amount,
      tax: Math.round(amount * 0.05),
    })
    setChargeForm({ category: 'Misc', description: '', amount: '' })
    setShowCharge(false)
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    if (!folio || !paymentForm.amount) return
    onAddPayment(folio.id, {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      method: paymentForm.method,
      type: paymentForm.type,
      amount: parseFloat(paymentForm.amount),
    })
    setPaymentForm({ method: 'Cash', type: 'Partial', amount: '' })
    setShowPayment(false)
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Guest Folio" wide>
      <div className="folio-modal">
        <FormField label="Select Guest Folio" full>
          <select value={folioId} onChange={(e) => setFolioId(e.target.value)}>
            <option value="">— Select folio —</option>
            {folios.map((f) => (
              <option key={f.id} value={f.id}>{f.guest} — {f.room} ({f.id})</option>
            ))}
            {folios.length === 0 && reservations.filter((r) => r.status === 'Checked In').map((r) => (
              <option key={r.id} value={r.id} disabled>{r.guest} — No folio yet</option>
            ))}
          </select>
        </FormField>

        {folio && totals && (
          <>
            <div className="folio-header">
              <div>
                <h3>{folio.guest}</h3>
                <p className="info-text">Room {folio.room} · Folio {folio.id} · <Badge variant={folio.status === 'Open' ? 'info' : 'muted'}>{folio.status}</Badge></p>
              </div>
              <div className="folio-summary-cards">
                <div className="folio-stat"><span>Charges</span><strong>{formatINRAmount(totals.subtotal + totals.tax)}</strong></div>
                <div className="folio-stat"><span>Paid</span><strong>{formatINRAmount(totals.paid)}</strong></div>
                <div className={`folio-stat${totals.balance > 0 ? ' folio-balance-due' : ''}`}>
                  <span>Balance</span><strong>{formatINRAmount(totals.balance)}</strong>
                </div>
              </div>
            </div>

            <div className="folio-section">
              <div className="folio-section-head">
                <h4>Charges</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCharge(!showCharge)}>+ Add Charge</button>
              </div>
              {showCharge && (
                <form className="folio-inline-form" onSubmit={handleAddCharge}>
                  <select value={chargeForm.category} onChange={(e) => setChargeForm((p) => ({ ...p, category: e.target.value }))}>
                    {CHARGE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Description" value={chargeForm.description} onChange={(e) => setChargeForm((p) => ({ ...p, description: e.target.value }))} />
                  <input type="number" placeholder="Amount" value={chargeForm.amount} onChange={(e) => setChargeForm((p) => ({ ...p, amount: e.target.value }))} />
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              )}
              <table className="folio-table">
                <thead>
                  <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Tax</th></tr>
                </thead>
                <tbody>
                  {folio.charges.map((c) => (
                    <tr key={c.id}>
                      <td>{c.date}</td>
                      <td>{c.category}</td>
                      <td>{c.description}</td>
                      <td>{formatINRAmount(c.amount)}</td>
                      <td>{formatINRAmount(c.tax || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="folio-section">
              <div className="folio-section-head">
                <h4>Payments</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPayment(!showPayment)}>+ Record Payment</button>
              </div>
              {showPayment && (
                <form className="folio-inline-form" onSubmit={handleAddPayment}>
                  <select value={paymentForm.method} onChange={(e) => setPaymentForm((p) => ({ ...p, method: e.target.value }))}>
                    {['Cash', 'Credit Card', 'UPI', 'Bank Transfer'].map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <select value={paymentForm.type} onChange={(e) => setPaymentForm((p) => ({ ...p, type: e.target.value }))}>
                    {['Advance', 'Partial', 'Final Settlement'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <input type="number" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                  <button type="submit" className="btn btn-primary btn-sm">Record</button>
                </form>
              )}
              <table className="folio-table">
                <thead>
                  <tr><th>Date</th><th>Method</th><th>Type</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {folio.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>{p.method}</td>
                      <td>{p.type}</td>
                      <td>{formatINRAmount(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="folio-lines folio-totals">
              <li><span>Subtotal</span><span>{formatINRAmount(totals.subtotal)}</span></li>
              <li><span>GST / Taxes</span><span>{formatINRAmount(totals.tax)}</span></li>
              <li><span>Total Charges</span><span>{formatINRAmount(totals.total)}</span></li>
              <li><span>Total Payments</span><span>{formatINRAmount(totals.paid)}</span></li>
              <li className="folio-total"><span>Balance Due</span><span>{formatINRAmount(totals.balance)}</span></li>
            </ul>
          </>
        )}
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  )
}
