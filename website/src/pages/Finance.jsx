import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PageShell, SectionHeader, StatCard, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import DateRangeFilter from '../components/DateRangeFilter'
import FinanceTransactionModal, { formatTransactionRow } from '../components/FinanceTransactionModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { currentMonthRange, formatDisplayDate, formatINR, getRangeLabel, nextId, todayISO } from '../utils/helpers'
import {
  computeExpenseBreakdown,
  computeFinanceTotals,
  computeRevenueBreakdown,
  filterApprovedFinanceTransactions,
  filterFinanceTransactions,
} from '../utils/financeMetrics'

function KpiGrid({ items }) {
  return (
    <div className="stats-grid finance-kpi-grid">
      {items.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.value}
          trend={s.type === 'expense' ? 'down' : 'neutral'}
        />
      ))}
    </div>
  )
}

function gmApprovalBadge(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

export default function Finance() {
  const store = useStore()
  const { user, canGmApprove } = useAuth()
  const crud = useCrudModal()
  const [modal, setModal] = useState({ open: false, item: null })
  const { start: defaultStart, end: defaultEnd } = currentMonthRange()
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const handleStartChange = (value) => {
    setStartDate(value)
    if (value > endDate) setEndDate(value)
  }

  const pendingTransactions = useMemo(
    () => store.transactions.filter((t) => t.gmApprovalStatus === 'Pending'),
    [store.transactions],
  )

  const cols = [
    { key: 'id', label: 'Ref' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant={r.type === 'Revenue' ? 'success' : 'warning'}>{r.type}</Badge> },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'gmApprovalStatus',
      label: 'GM Approval',
      render: (r) => (
        <Badge variant={gmApprovalBadge(r.gmApprovalStatus || 'Approved')}>
          {r.gmApprovalStatus || 'Approved'}
        </Badge>
      ),
    },
    { key: 'paymentStatus', label: 'Payment', render: (r) => r.paymentStatus || '—' },
    { key: 'date', label: 'Date' },
  ]

  const viewFields = [
    ...cols,
    { key: 'invoiceNumber', label: 'Invoice' },
    { key: 'folioRef', label: 'Folio' },
    { key: 'vatRate', label: 'VAT Rate', render: (r) => ((r.vatRate ?? r.gstRate) ? `${r.vatRate ?? r.gstRate}%` : '—') },
    { key: 'accountCode', label: 'Account' },
    { key: 'sourceModule', label: 'Source Module' },
    { key: 'recordedBy', label: 'Recorded By', render: (r) => r.recordedBy || '—' },
    { key: 'approvedBy', label: 'Approved By', render: (r) => r.approvedBy || '—' },
  ]

  const filteredTransactions = useMemo(
    () => filterFinanceTransactions(store.transactions, startDate, endDate),
    [store.transactions, startDate, endDate],
  )

  const approvedTransactions = useMemo(
    () => filterApprovedFinanceTransactions(store.transactions, startDate, endDate),
    [store.transactions, startDate, endDate],
  )

  const totals = useMemo(() => {
    const { revenue, expense, profit } = computeFinanceTotals(approvedTransactions)
    const rangeLabel = getRangeLabel(startDate, endDate)
    return [
      { label: `Total Revenue (${rangeLabel})`, value: formatINR(revenue), type: 'revenue' },
      { label: `Total Expenses (${rangeLabel})`, value: formatINR(expense), type: 'expense' },
      { label: `Net P&L (${rangeLabel})`, value: formatINR(profit), type: 'profit' },
    ]
  }, [approvedTransactions, startDate, endDate])

  const revenueKpis = useMemo(
    () => computeRevenueBreakdown(approvedTransactions),
    [approvedTransactions],
  )

  const expenseKpis = useMemo(
    () => computeExpenseBreakdown(approvedTransactions),
    [approvedTransactions],
  )

  const handleApproveTransaction = (txn) => {
    store.update('transactions', 'Finance', txn.id, {
      ...txn,
      gmApprovalStatus: 'Approved',
      approvedBy: 'General Manager',
      approvalDate: todayISO(),
    })
  }

  const handleRejectTransaction = (txn) => {
    store.update('transactions', 'Finance', txn.id, {
      ...txn,
      gmApprovalStatus: 'Rejected',
      approvedBy: 'General Manager',
      approvalDate: todayISO(),
    })
  }

  return (
    <PageShell
      title="Finance"
      description="Billing, VAT, revenue, expenses — integrated with all operations"
      headerAction={(
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={handleStartChange}
          onEndChange={setEndDate}
        />
      )}
    >
      {canGmApprove && (
        <section className="panel">
          <SectionHeader
            title="GM Approval"
            subtitle="Review recorded transactions before they are posted to financial reports"
          />
          {pendingTransactions.length === 0 ? (
            <div className="approval-queue-empty">
              <span className="approval-queue-empty-icon" aria-hidden>✓</span>
              <p>All caught up — no pending transactions.</p>
            </div>
          ) : (
            <>
              <div className="approval-queue-summary">
                <div className="approval-queue-total">
                  <span className="approval-queue-count">{pendingTransactions.length}</span>
                  <span className="approval-queue-label">pending transaction{pendingTransactions.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="approval-queue">
                {pendingTransactions.map((txn) => (
                  <article key={txn.id} className="approval-card approval-card--issue">
                    <div className="approval-card-header">
                      <div className="approval-card-heading">
                        <h3 className="approval-card-title">{txn.description}</h3>
                        <span className="approval-card-id">{txn.id}</span>
                      </div>
                      <div className="approval-card-badges">
                        <Badge variant={txn.type === 'Revenue' ? 'success' : 'warning'}>{txn.type}</Badge>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </div>
                    <dl className="approval-card-meta">
                      <div className="approval-card-meta-item">
                        <dt>Amount</dt>
                        <dd>{txn.amount}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Category</dt>
                        <dd>{txn.category}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Recorded by</dt>
                        <dd>{txn.recordedBy || '—'}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Date</dt>
                        <dd>{formatDisplayDate(txn.dateIso)}</dd>
                      </div>
                    </dl>
                    <div className="approval-card-actions">
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleApproveTransaction(txn)}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => handleRejectTransaction(txn)}>
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="stats-grid">
        {totals.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.type === 'profit' ? 'up' : s.type === 'expense' ? 'down' : 'neutral'}
          />
        ))}
      </div>

      <section className="panel">
        <SectionHeader title="Revenue" />
        <KpiGrid items={revenueKpis} />
      </section>

      <section className="panel">
        <SectionHeader title="Expenses" />
        <KpiGrid items={expenseKpis} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Transactions"
          action={(
            <button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>
              + Record Transaction
            </button>
          )}
        />
        <CrudTable
          columns={cols}
          rows={filteredTransactions}
          onView={crud.openView}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={crud.openDelete}
        />
      </section>

      <FinanceTransactionModal
        open={modal.open}
        editItem={modal.item}
        requiresGmApproval={!canGmApprove}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={(txn) => {
          const gmStatus = canGmApprove ? 'Approved' : 'Pending'
          const payload = {
            ...txn,
            gmApprovalStatus: modal.item?.gmApprovalStatus ?? gmStatus,
            recordedBy: modal.item?.recordedBy ?? user?.name,
            approvedBy: gmStatus === 'Approved' ? 'General Manager' : '',
          }
          if (modal.item) {
            store.update('transactions', 'Finance', modal.item.id, formatTransactionRow(payload, modal.item.id, modal.item.date))
          } else {
            store.create('transactions', 'TXN-', 'Finance', formatTransactionRow(payload, nextId('TXN-', store.transactions)))
          }
          setModal({ open: false, item: null })
        }}
      />

      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Transaction" data={crud.item} fields={viewFields} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('transactions', 'Finance', crud.deleteTarget.id)} itemName={crud.deleteTarget?.id} />
    </PageShell>
  )
}
