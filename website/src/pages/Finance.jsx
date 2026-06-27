import { useMemo, useState } from 'react'
import { financeRevenueSummary, financeExpenseSummary } from '../data/initialState'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, StatCard, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import FinanceTransactionModal, { formatTransactionRow } from '../components/FinanceTransactionModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatINR, nextId } from '../utils/helpers'

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

  const totals = useMemo(() => {
    const parseAmt = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0
    let revenue = 12400000
    let expense = 6850000
    store.transactions.forEach((t) => {
      const amt = parseAmt(t.amount)
      if (t.type === 'Revenue') revenue += amt
      else expense += amt
    })
    return [
      { label: 'Total Revenue (MTD)', value: formatINR(revenue), type: 'revenue' },
      { label: 'Total Expenses (MTD)', value: formatINR(expense), type: 'expense' },
      { label: 'Net P&L (MTD)', value: formatINR(revenue - expense), type: 'profit' },
    ]
  }, [store.transactions])

  return (
    <PageShell title="Finance" description="Billing, GST, revenue, expenses — integrated with all operations">
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
        <KpiGrid items={financeRevenueSummary} />
      </section>

      <section className="panel">
        <SectionHeader title="Expenses" />
        <KpiGrid items={financeExpenseSummary} />
      </section>

      <section className="panel">
        <SectionHeader title="Transactions" action={<button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>+ Record Transaction</button>} />
        <CrudTable columns={cols} rows={store.transactions} onView={crud.openView} onEdit={(item) => setModal({ open: true, item })} onDelete={crud.openDelete} />
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
