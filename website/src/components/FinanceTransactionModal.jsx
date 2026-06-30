import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import VendorSelect from './VendorSelect'
import { formatDisplayDate, formatINR } from '../utils/helpers'

const CATEGORIES = ['Room', 'F&B', 'Add-on', 'Operations', 'Payroll', 'Utilities', 'VAT', 'Maintenance']
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Room Folio', 'Corporate']
const PAYMENT_STATUSES = ['Pending', 'Completed', 'Partial', 'Refunded']
const INVOICE_STATUSES = ['Draft', 'Issued', 'Paid', 'Cancelled']
const LEDGER_TYPES = ['Asset', 'Liability', 'Revenue', 'Expense']
const REPORT_PERIODS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual']
const SYNC_STATUSES = ['Synced', 'Pending', 'Failed', 'Manual']

const getEmpty = () => ({
  type: 'Expense', category: 'Operations', description: '', amount: '',
  invoiceNumber: '', invoiceDate: '', invoiceStatus: 'Draft',
  folioRef: '', guestName: '', roomNumber: '',
  revenueSource: '', expenseType: '', vendor: '',
  vatRate: '18', vatAmount: '', taxInclusive: true,
  accountCode: '', accountName: '', ledgerType: 'Expense',
  paymentMethod: 'Bank Transfer', paymentStatus: 'Pending', paymentDate: '',
  reportPeriod: 'Monthly', reportTag: '',
  budgetCode: '', budgetVariance: '',
  auditNote: '', recordedBy: '',
  sourceModule: 'Finance', syncStatus: 'Synced',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  const vatRate = editItem.vatRate ?? editItem.gstRate ?? '18'
  const vatAmount = editItem.vatAmount ?? editItem.gstAmount ?? ''
  return {
    ...getEmpty(),
    ...editItem,
    vatRate,
    vatAmount,
    amount: parseFloat(String(editItem.amount).replace(/[^\d.]/g, '')) || '',
  }
}

export function formatTransactionRow(txn, id, date) {
  const dateIso = txn.dateIso || new Date().toISOString().slice(0, 10)
  return {
    ...txn,
    id,
    dateIso,
    amount: formatINR(typeof txn.amount === 'number' ? txn.amount : parseFloat(txn.amount) || 0),
    date: date || formatDisplayDate(dateIso),
  }
}

export default function FinanceTransactionModal({ open, onClose, onSubmit, editItem = null, requiresGmApproval = false }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'amount' || field === 'vatRate') {
        const amt = parseFloat(field === 'amount' ? value : prev.amount) || 0
        const rate = parseFloat(field === 'vatRate' ? value : prev.vatRate) || 0
        if (amt && rate) next.vatAmount = ((amt * rate) / (100 + (prev.taxInclusive ? rate : 0))).toFixed(2)
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.description.trim()) next.description = 'Description is required'
    if (!form.vendor) next.vendor = 'Vendor name is required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Record Transaction'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Invoice Management" subtitle="Create and track invoices for guests and vendors">
          <div className="form-grid">
            <FormField label="Invoice Number">
              <input type="text" value={form.invoiceNumber} placeholder="INV-2026-001" onChange={(e) => update('invoiceNumber', e.target.value)} />
            </FormField>
            <FormField label="Invoice Date">
              <input type="date" value={form.invoiceDate} onChange={(e) => update('invoiceDate', e.target.value)} />
            </FormField>
            <FormField label="Invoice Status">
              <select value={form.invoiceStatus} onChange={(e) => update('invoiceStatus', e.target.value)}>
                {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Guest Folio Management" subtitle="Link transactions to guest room folios">
          <div className="form-grid">
            <FormField label="Folio Reference">
              <input type="text" value={form.folioRef} placeholder="FOL-501" onChange={(e) => update('folioRef', e.target.value)} />
            </FormField>
            <FormField label="Guest Name">
              <input type="text" value={form.guestName} onChange={(e) => update('guestName', e.target.value)} />
            </FormField>
            <FormField label="Room Number">
              <input type="text" value={form.roomNumber} onChange={(e) => update('roomNumber', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Revenue Management" subtitle="Track revenue by source and category">
          <div className="form-grid">
            <FormField label="Transaction Type">
              <select value={form.type} onChange={(e) => update('type', e.target.value)}>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
            </FormField>
            <FormField label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Revenue Source">
              <input type="text" value={form.revenueSource} placeholder="Rooms, F&B, Spa..." onChange={(e) => update('revenueSource', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Expense Management" subtitle="Record operational and departmental expenses">
          <div className="form-grid">
            <FormField label="Expense Type">
              <input type="text" value={form.expenseType} placeholder="Utilities, Supplies, Payroll..." onChange={(e) => update('expenseType', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Vendor" subtitle="Supplier or payee for this transaction">
          <div className="form-grid">
            <FormField label="Vendor Name" required error={errors.vendor} full>
              <VendorSelect value={form.vendor} onChange={(e) => update('vendor', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="VAT & Tax Management" subtitle="Apply VAT rates and tax calculations">
          <div className="form-grid">
            <FormField label="VAT Rate (%)">
              <select value={form.vatRate} onChange={(e) => update('vatRate', e.target.value)}>
                {['0', '5', '12', '18', '28'].map((r) => <option key={r} value={r}>{r}%</option>)}
              </select>
            </FormField>
            <FormField label="VAT Amount (OMR)">
              <input type="text" value={form.vatAmount} readOnly placeholder="Auto-calculated" />
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.taxInclusive} onChange={(e) => update('taxInclusive', e.target.checked)} />
                Tax inclusive pricing
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Accounts Management" subtitle="Map transactions to chart of accounts">
          <div className="form-grid">
            <FormField label="Account Code">
              <input type="text" value={form.accountCode} placeholder="4100-ROOM" onChange={(e) => update('accountCode', e.target.value)} />
            </FormField>
            <FormField label="Account Name">
              <input type="text" value={form.accountName} onChange={(e) => update('accountName', e.target.value)} />
            </FormField>
            <FormField label="Ledger Type">
              <select value={form.ledgerType} onChange={(e) => update('ledgerType', e.target.value)}>
                {LEDGER_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Transaction Recording" subtitle="Core transaction details">
          <div className="form-grid">
            <FormField label="Description" required error={errors.description} full>
              <input type="text" value={form.description} onChange={(e) => update('description', e.target.value)} />
            </FormField>
            <FormField label="Amount (OMR)" required error={errors.amount}>
              <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
            </FormField>
            <FormField label="Recorded By">
              <input type="text" value={form.recordedBy} onChange={(e) => update('recordedBy', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Payment Management" subtitle="Payment method, status and settlement date">
          <div className="form-grid">
            <FormField label="Payment Method">
              <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="Payment Status">
              <select value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Payment Date">
              <input type="date" value={form.paymentDate} onChange={(e) => update('paymentDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Financial Reporting" subtitle="Tag transactions for P&L and financial reports">
          <div className="form-grid">
            <FormField label="Report Period">
              <select value={form.reportPeriod} onChange={(e) => update('reportPeriod', e.target.value)}>
                {REPORT_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Report Tag">
              <input type="text" value={form.reportTag} placeholder="MTD, Q2, Annual..." onChange={(e) => update('reportTag', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Budget & Cost Control" subtitle="Track spending against departmental budgets">
          <div className="form-grid">
            <FormField label="Budget Code">
              <input type="text" value={form.budgetCode} placeholder="BUD-FNB-2026" onChange={(e) => update('budgetCode', e.target.value)} />
            </FormField>
            <FormField label="Budget Variance">
              <input type="text" value={form.budgetVariance} placeholder="Under / over budget" onChange={(e) => update('budgetVariance', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Audit Trail" subtitle="Notes for financial audit and compliance">
          <FormField label="Audit Notes" full>
            <textarea rows={2} value={form.auditNote} onChange={(e) => update('auditNote', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Integration Management" subtitle="Source module and sync status with other ERP modules">
          <div className="form-grid">
            <FormField label="Source Module">
              <select value={form.sourceModule} onChange={(e) => update('sourceModule', e.target.value)}>
                {['Finance', 'Front Office', 'POS', 'Procurement', 'HRMS', 'CRM'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Sync Status">
              <select value={form.syncStatus} onChange={(e) => update('syncStatus', e.target.value)}>
                {SYNC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        {requiresGmApproval && !isEdit && (
          <p className="field-hint">Transactions are sent to the General Manager for approval before posting.</p>
        )}

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? 'Update Transaction' : (requiresGmApproval ? 'Submit for GM Approval' : 'Record Transaction')}
        />
      </form>
    </Modal>
  )
}
