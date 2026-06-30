import { useMemo } from 'react'
import { SectionHeader, StatCard } from './UI'
import { formatINR, getRangeLabel } from '../utils/helpers'
import {
  computeExpenseBreakdown,
  computeFinanceTotals,
  computeRevenueBreakdown,
  filterApprovedFinanceTransactions,
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

export default function FinanceKpiPanels({ transactions, startDate, endDate }) {
  const approvedTransactions = useMemo(
    () => filterApprovedFinanceTransactions(transactions, startDate, endDate),
    [transactions, startDate, endDate],
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

  return (
    <>
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
    </>
  )
}
