import { useMemo, useState } from 'react'
import { financeSummary as initialSummary } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, StatCard, DataTable, Badge } from '../components/UI'
import RecordTransactionModal, { formatTransactionRow } from '../components/RecordTransactionModal'
import { formatINR, nextId } from '../utils/helpers'

const features = ['P&L', 'Expenses', 'Revenue', 'Financial reports', 'Hotel operations integration']

const initialTransactions = [
  { id: 'TXN-301', type: 'Revenue', category: 'Room', description: 'Room revenue — Jun 24', amount: '₹82,000', date: '24 Jun' },
  { id: 'TXN-302', type: 'Expense', category: 'Utilities', description: 'Electricity bill', amount: '₹18,500', date: '23 Jun' },
]

export default function Finance() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [modalOpen, setModalOpen] = useState(false)

  const stats = useMemo(() => {
    const parseAmt = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0
    let revenue = 12400000
    let expense = 6850000
    transactions.forEach((t) => {
      const amt = parseAmt(t.amount)
      if (t.type === 'Revenue') revenue += amt
      else expense += amt
    })
    const profit = revenue - expense
    return [
      { label: 'Total Revenue (MTD)', value: formatINR(revenue), type: 'revenue' },
      { label: 'Total Expenses (MTD)', value: formatINR(expense), type: 'expense' },
      { label: 'Net P&L (MTD)', value: formatINR(profit), type: 'profit' },
      ...initialSummary.slice(3),
    ]
  }, [transactions])

  return (
    <PageShell
      title="Finance Module"
      description="P&L, revenue, expenses & integrated financial reporting"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.type === 'profit' ? 'up' : s.type === 'expense' ? 'down' : 'neutral'}
          />
        ))}
      </div>

      <section className="panel">
        <SectionHeader
          title="Recent Transactions"
          subtitle="Revenue and expense entries"
          action={<button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Record Transaction</button>}
        />
        <DataTable
          columns={[
            { key: 'id', label: 'Ref' },
            {
              key: 'type',
              label: 'Type',
              render: (row) => <Badge variant={row.type === 'Revenue' ? 'success' : 'warning'}>{row.type}</Badge>,
            },
            { key: 'category', label: 'Category' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'date', label: 'Date' },
          ]}
          rows={transactions}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Revenue Breakdown" subtitle="Integrated from Front Office, POS & Add-ons" />
          <div className="bar-chart">
            {[
              { label: 'Room Revenue', pct: 66, color: '#1e3a5f' },
              { label: 'F&B Revenue', pct: 23, color: '#c9a227' },
              { label: 'Add-on Services', pct: 11, color: '#2d6a4f' },
            ].map((bar) => (
              <div key={bar.label} className="bar-row">
                <span className="bar-label">{bar.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${bar.pct}%`, background: bar.color }} />
                </div>
                <span className="bar-pct">{bar.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionHeader title="Data Migration" subtitle="Legacy system import" />
          <ul className="info-list">
            <li>Minimum 2 years of historical data</li>
            <li>Preferably 5 years of reservation & finance data</li>
            <li>Finance data migration from existing systems</li>
            <li>Reservation history migration</li>
          </ul>
        </section>
      </div>

      <RecordTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(txn) => {
          setTransactions((prev) => [
            formatTransactionRow(txn, nextId('TXN-', prev)),
            ...prev,
          ])
          setModalOpen(false)
        }}
      />
    </PageShell>
  )
}
