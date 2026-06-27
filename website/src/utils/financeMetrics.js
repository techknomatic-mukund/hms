import { filterByDateRange, formatINR, getRecordDateISO, parseAmountINR } from './helpers'

const REVENUE_LABELS = {
  Room: 'Room Revenue',
  'F&B': 'F&B Revenue',
  'Add-on': 'Add-on Revenue',
}

const EXPENSE_BUCKETS = {
  'Staff Salary': ['Payroll'],
  'Kitchen Inventory': ['Kitchen', 'Food'],
  'Housekeeping Inventory': ['Housekeeping', 'Linen'],
  Miscellaneous: ['Utilities', 'Operations', 'Maintenance', 'GST'],
}

function resolveExpenseBucket(txn) {
  if (txn.expenseBucket) return txn.expenseBucket
  for (const [bucket, categories] of Object.entries(EXPENSE_BUCKETS)) {
    if (categories.includes(txn.category) || categories.includes(txn.expenseType)) return bucket
  }
  return 'Miscellaneous'
}

export function filterFinanceTransactions(transactions, start, end) {
  return filterByDateRange(transactions, start, end, (t) => getRecordDateISO(t))
}

export function computeFinanceTotals(transactions) {
  let revenue = 0
  let expense = 0
  transactions.forEach((t) => {
    const amt = parseAmountINR(t.amount)
    if (t.type === 'Revenue') revenue += amt
    else expense += amt
  })
  return { revenue, expense, profit: revenue - expense }
}

export function computeRevenueBreakdown(transactions) {
  const revenueTxns = transactions.filter((t) => t.type === 'Revenue')
  const labels = [...new Set(Object.values(REVENUE_LABELS))]
  return labels.map((label) => {
    const categories = Object.entries(REVENUE_LABELS)
      .filter(([, l]) => l === label)
      .map(([cat]) => cat)
    const total = revenueTxns
      .filter((t) => categories.includes(t.category))
      .reduce((sum, t) => sum + parseAmountINR(t.amount), 0)
    return { label, value: formatINR(total), type: 'revenue' }
  })
}

export function computeExpenseBreakdown(transactions) {
  const expenseTxns = transactions.filter((t) => t.type !== 'Revenue')
  const labels = Object.keys(EXPENSE_BUCKETS)
  return labels.map((label) => {
    const total = expenseTxns
      .filter((t) => resolveExpenseBucket(t) === label)
      .reduce((sum, t) => sum + parseAmountINR(t.amount), 0)
    return { label, value: formatINR(total), type: 'expense' }
  })
}
