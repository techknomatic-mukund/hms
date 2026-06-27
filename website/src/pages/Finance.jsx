import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, StatCard, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import DateRangeFilter from '../components/DateRangeFilter'
import FinanceTransactionModal, { formatTransactionRow } from '../components/FinanceTransactionModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { currentMonthRange, formatINR, getRangeLabel, nextId } from '../utils/helpers'
import {
  computeExpenseBreakdown,
  computeFinanceTotals,
  computeRevenueBreakdown,
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

export default function Finance() {
  const store = useStore()
  const crud = useCrudModal()
  const [modal, setModal] = useState({ open: false, item: null })
  const { start: defaultStart, end: defaultEnd } = currentMonthRange()
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const handleStartChange = (value) => {
    setStartDate(value)
    if (value > endDate) setEndDate(value)
  }

  const cols = [
    { key: 'id', label: 'Ref' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant={r.type === 'Revenue' ? 'success' : 'warning'}>{r.type}</Badge> },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentStatus', label: 'Payment', render: (r) => r.paymentStatus || '—' },
    { key: 'date', label: 'Date' },
  ]

  const viewFields = [
    ...cols,
    { key: 'invoiceNumber', label: 'Invoice' },
    { key: 'folioRef', label: 'Folio' },
    { key: 'gstRate', label: 'GST Rate', render: (r) => (r.gstRate ? `${r.gstRate}%` : '—') },
    { key: 'accountCode', label: 'Account' },
    { key: 'sourceModule', label: 'Source Module' },
  ]

  const filteredTransactions = useMemo(
    () => filterFinanceTransactions(store.transactions, startDate, endDate),
    [store.transactions, startDate, endDate],
  )

  const totals = useMemo(() => {
    const { revenue, expense, profit } = computeFinanceTotals(filteredTransactions)
    const rangeLabel = getRangeLabel(startDate, endDate)
    return [
      { label: `Total Revenue (${rangeLabel})`, value: formatINR(revenue), type: 'revenue' },
      { label: `Total Expenses (${rangeLabel})`, value: formatINR(expense), type: 'expense' },
      { label: `Net P&L (${rangeLabel})`, value: formatINR(profit), type: 'profit' },
    ]
  }, [filteredTransactions, startDate, endDate])

  const revenueKpis = useMemo(
    () => computeRevenueBreakdown(filteredTransactions),
    [filteredTransactions],
  )

  const expenseKpis = useMemo(
    () => computeExpenseBreakdown(filteredTransactions),
    [filteredTransactions],
  )

  return (
    <PageShell
      title="Finance"
      description="Billing, GST, revenue, expenses — integrated with all operations"
      headerAction={(
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={handleStartChange}
          onEndChange={setEndDate}
        />
      )}
    >
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
        <SectionHeader title="Transactions" action={<button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>+ Record Transaction</button>} />
        <CrudTable columns={cols} rows={filteredTransactions} onView={crud.openView} onEdit={(item) => setModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>
      <FinanceTransactionModal
        open={modal.open}
        editItem={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={(txn) => {
          if (modal.item) store.update('transactions', 'Finance', modal.item.id, formatTransactionRow(txn, modal.item.id, modal.item.date))
          else store.create('transactions', 'TXN-', 'Finance', formatTransactionRow(txn, nextId('TXN-', store.transactions)))
          setModal({ open: false, item: null })
        }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Transaction" data={crud.item} fields={viewFields} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('transactions', 'Finance', crud.deleteTarget.id)} itemName={crud.deleteTarget?.id} />
    </PageShell>
  )
}
