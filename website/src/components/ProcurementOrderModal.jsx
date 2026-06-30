import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import VendorSelect from './VendorSelect'
import { todayISO } from '../utils/helpers'

const PO_STATUSES = ['Pending Approval', 'Approved', 'Received', 'Rejected', 'Closed']
const APPROVAL_STATUSES = ['Pending', 'Level 1 Approved', 'Level 2 Approved', 'Rejected']
const INSPECTION_STATUSES = ['Pending', 'Passed', 'Failed', 'Partial']
const PAYMENT_STATUSES = ['Pending', 'Processing', 'Paid', 'On Hold']
const PAYMENT_METHODS = ['Bank Transfer', 'Cheque', 'UPI', 'Credit Terms']
const DEPARTMENTS = ['Kitchen', 'Housekeeping', 'F&B', 'Maintenance', 'General']
const REPORT_TAGS = ['Cost Saving', 'Urgent', 'Contract Renewal', 'Low Stock Replenishment', 'Standard']

const getEmpty = () => ({
  vendor: '', items: '', amount: '', status: 'Pending Approval',
  requestRef: '', requestedBy: '', requestDate: todayISO(), requestNotes: '',
  approver: '', approvalLevel: 'Level 1', approvalStatus: 'Pending',
  vendorContact: '', vendorRating: '',
  quote1Vendor: '', quote1Amount: '', quote2Vendor: '', quote2Amount: '', selectedQuote: '1',
  poDate: '', deliveryDate: '',
  poApprovalStatus: 'Pending', poApprovedBy: '',
  grnNumber: '', grnDate: '', receivedQty: '',
  inspectionStatus: 'Pending', inspectionNotes: '', inspectedBy: '',
  invoiceNumber: '', invoiceAmount: '', invoiceVerified: false,
  paymentStatus: 'Pending', paymentMethod: 'Bank Transfer', paymentDate: '',
  procurementHistory: '', historyNote: '',
  department: 'Kitchen', costCenter: '', masterCategory: 'Food & Beverage',
  reportTag: 'Standard', analyticsNotes: '',
  syncToInventory: true, inventorySku: '', stockUpdated: false,
  replenishmentTrigger: false, reorderQty: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    ...getEmpty(),
    ...editItem,
    amount: String(editItem.amount || '').replace(/[^\d.]/g, ''),
  }
}

export default function ProcurementOrderModal({ open, onClose, onSubmit, editItem = null, requiresGmApproval = false }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const appendHistory = () => {
    if (!form.historyNote.trim()) return
    const stamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const line = `${stamp} — ${form.approvalStatus}: ${form.historyNote.trim()}`
    setForm((prev) => ({
      ...prev,
      procurementHistory: prev.procurementHistory ? `${line}\n${prev.procurementHistory}` : line,
      historyNote: '',
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.vendor) next.vendor = 'Vendor name is required'
    if (!form.items.trim()) next.items = 'Items are required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      vendor: form.vendor.trim(),
      items: form.items.trim(),
      requestRef: form.requestRef.trim() || `PR-${Date.now().toString().slice(-6)}`,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Purchase Order' : 'New Purchase Order'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Purchase Request Management" subtitle="Internal purchase request before PO creation">
          <div className="form-grid">
            <FormField label="Request Ref">
              <input type="text" value={form.requestRef} placeholder="Auto-generated" onChange={(e) => update('requestRef', e.target.value)} />
            </FormField>
            <FormField label="Requested By">
              <input type="text" value={form.requestedBy} onChange={(e) => update('requestedBy', e.target.value)} />
            </FormField>
            <FormField label="Request Date">
              <input type="date" value={form.requestDate} onChange={(e) => update('requestDate', e.target.value)} />
            </FormField>
            <FormField label="Request Notes" full>
              <input type="text" value={form.requestNotes} onChange={(e) => update('requestNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        {!requiresGmApproval && (
          <FormSection title="Approval Workflow" subtitle="Multi-level approval before procurement proceeds">
            <div className="form-grid">
              <FormField label="Approver">
                <input type="text" value={form.approver} placeholder="Department head / Manager" onChange={(e) => update('approver', e.target.value)} />
              </FormField>
              <FormField label="Approval Level">
                <select value={form.approvalLevel} onChange={(e) => update('approvalLevel', e.target.value)}>
                  {['Level 1', 'Level 2', 'Level 3', 'Finance'].map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormField>
              <FormField label="Workflow Status">
                <select value={form.approvalStatus} onChange={(e) => update('approvalStatus', e.target.value)}>
                  {APPROVAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </div>
          </FormSection>
        )}

        <FormSection title="Vendor Management" subtitle="Vendor details and performance rating">
          <div className="form-grid">
            <FormField label="Vendor Name" required error={errors.vendor} full>
              <VendorSelect value={form.vendor} onChange={(e) => update('vendor', e.target.value)} />
            </FormField>
            <FormField label="Vendor Contact">
              <input type="text" value={form.vendorContact} placeholder="Phone / email" onChange={(e) => update('vendorContact', e.target.value)} />
            </FormField>
            <FormField label="Vendor Rating (1–5)">
              <input type="number" min="1" max="5" value={form.vendorRating} onChange={(e) => update('vendorRating', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Quotation Comparison" subtitle="Compare vendor quotes before selecting supplier">
          <div className="form-grid">
            <FormField label="Quote 1 — Vendor">
              <input type="text" value={form.quote1Vendor} onChange={(e) => update('quote1Vendor', e.target.value)} />
            </FormField>
            <FormField label="Quote 1 — Amount (OMR)">
              <input type="number" min="0" value={form.quote1Amount} onChange={(e) => update('quote1Amount', e.target.value)} />
            </FormField>
            <FormField label="Quote 2 — Vendor">
              <input type="text" value={form.quote2Vendor} onChange={(e) => update('quote2Vendor', e.target.value)} />
            </FormField>
            <FormField label="Quote 2 — Amount (OMR)">
              <input type="number" min="0" value={form.quote2Amount} onChange={(e) => update('quote2Amount', e.target.value)} />
            </FormField>
            <FormField label="Selected Quote">
              <select value={form.selectedQuote} onChange={(e) => update('selectedQuote', e.target.value)}>
                <option value="1">Quote 1</option>
                <option value="2">Quote 2</option>
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Purchase Order Creation" subtitle="Create PO with items, amount and delivery schedule">
          <div className="form-grid">
            <FormField label="Items" required error={errors.items} full>
              <input type="text" value={form.items} placeholder="Vegetables, Dairy, Linen..." onChange={(e) => update('items', e.target.value)} />
            </FormField>
            <FormField label="Amount (OMR)" required error={errors.amount}>
              <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
            </FormField>
            <FormField label="PO Date">
              <input type="date" value={form.poDate} onChange={(e) => update('poDate', e.target.value)} />
            </FormField>
            <FormField label="Expected Delivery">
              <input type="date" value={form.deliveryDate} onChange={(e) => update('deliveryDate', e.target.value)} />
            </FormField>
            <FormField label="PO Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {PO_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        {!requiresGmApproval && (
          <FormSection title="Purchase Order Approval" subtitle="Final PO sign-off before sending to supplier">
            <div className="form-grid">
              <FormField label="PO Approval Status">
                <select value={form.poApprovalStatus} onChange={(e) => update('poApprovalStatus', e.target.value)}>
                  {APPROVAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Approved By">
                <input type="text" value={form.poApprovedBy} onChange={(e) => update('poApprovedBy', e.target.value)} />
              </FormField>
            </div>
          </FormSection>
        )}

        <FormSection title="Goods Receipt Note (GRN) Management" subtitle="Record goods received against purchase order">
          <div className="form-grid">
            <FormField label="GRN Number">
              <input type="text" value={form.grnNumber} placeholder="GRN-301" onChange={(e) => update('grnNumber', e.target.value)} />
            </FormField>
            <FormField label="GRN Date">
              <input type="date" value={form.grnDate} onChange={(e) => update('grnDate', e.target.value)} />
            </FormField>
            <FormField label="Received Quantity">
              <input type="text" value={form.receivedQty} placeholder="Full / partial qty" onChange={(e) => update('receivedQty', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Quality Inspection & Verification" subtitle="Inspect received goods before accepting into stock">
          <div className="form-grid">
            <FormField label="Inspection Status">
              <select value={form.inspectionStatus} onChange={(e) => update('inspectionStatus', e.target.value)}>
                {INSPECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Inspected By">
              <input type="text" value={form.inspectedBy} onChange={(e) => update('inspectedBy', e.target.value)} />
            </FormField>
            <FormField label="Inspection Notes" full>
              <textarea rows={2} value={form.inspectionNotes} onChange={(e) => update('inspectionNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Invoice Verification" subtitle="Match vendor invoice against PO and GRN">
          <div className="form-grid">
            <FormField label="Invoice Number">
              <input type="text" value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} />
            </FormField>
            <FormField label="Invoice Amount (OMR)">
              <input type="number" min="0" value={form.invoiceAmount} onChange={(e) => update('invoiceAmount', e.target.value)} />
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.invoiceVerified} onChange={(e) => update('invoiceVerified', e.target.checked)} />
                Invoice verified against PO & GRN
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Payment Processing" subtitle="Process vendor payment after invoice verification">
          <div className="form-grid">
            <FormField label="Payment Status">
              <select value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Payment Method">
              <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="Payment Date">
              <input type="date" value={form.paymentDate} onChange={(e) => update('paymentDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Procurement History" subtitle="Audit trail of all procurement activities">
          {form.procurementHistory && <pre className="interaction-log">{form.procurementHistory}</pre>}
          <FormField label="Add History Entry" full>
            <div className="inline-field-row">
              <input type="text" value={form.historyNote} placeholder="e.g. PO approved by finance" onChange={(e) => update('historyNote', e.target.value)} />
              <button type="button" className="btn btn-secondary btn-sm" onClick={appendHistory}>Add Entry</button>
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Master Data Management" subtitle="Department, cost centre and category classification">
          <div className="form-grid">
            <FormField label="Department">
              <select value={form.department} onChange={(e) => update('department', e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Cost Centre">
              <input type="text" value={form.costCenter} placeholder="CC-KITCHEN-01" onChange={(e) => update('costCenter', e.target.value)} />
            </FormField>
            <FormField label="Category">
              <input type="text" value={form.masterCategory} onChange={(e) => update('masterCategory', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Procurement Analytics & Reports" subtitle="Tag POs for spend analysis and reporting">
          <div className="form-grid">
            <FormField label="Report Tag">
              <select value={form.reportTag} onChange={(e) => update('reportTag', e.target.value)}>
                {REPORT_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNotes} onChange={(e) => update('analyticsNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Inventory Integration" subtitle="Auto-update inventory stock on goods receipt">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.syncToInventory} onChange={(e) => update('syncToInventory', e.target.checked)} />
                Sync received goods to inventory on GRN
              </label>
            </div>
            <FormField label="Inventory SKU">
              <input type="text" value={form.inventorySku} placeholder="INV-101" onChange={(e) => update('inventorySku', e.target.value)} />
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.stockUpdated} onChange={(e) => update('stockUpdated', e.target.checked)} />
                Stock already updated in inventory
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Low Stock Replenishment" subtitle="Auto-trigger PO from low stock alerts">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.replenishmentTrigger} onChange={(e) => update('replenishmentTrigger', e.target.checked)} />
                Triggered by low stock alert
              </label>
            </div>
            <FormField label="Reorder Quantity">
              <input type="number" min="0" value={form.reorderQty} onChange={(e) => update('reorderQty', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        {requiresGmApproval && !isEdit && (
          <p className="field-hint">Purchase orders are sent to the General Manager for approval before proceeding.</p>
        )}

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? 'Update PO' : (requiresGmApproval ? 'Submit for GM Approval' : 'Create PO')}
        />
      </form>
    </Modal>
  )
}
