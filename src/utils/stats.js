export function totalsByCategory(expenses) {
  const totals = {}
  expenses.forEach((e) => {
    const c = e.category || 'Other'
    totals[c] = (totals[c] ?? 0) + e.amount
  })
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

// "2026-10" style key; offset -1 = last month
export function currentMonthKey(offset = 0) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  return d.toLocaleDateString('en-CA').slice(0, 7)
}

export function totalForMonth(expenses, key) {
  return expenses
    .filter((e) => e.date?.startsWith(key))
    .reduce((sum, e) => sum + e.amount, 0)
}

export function totalsByMonth(expenses, months = 6) {
  return Array.from({ length: months }, (_, i) => {
    const key = currentMonthKey(i - (months - 1))
    const [y, m] = key.split('-')
    const month = new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'short' })
    return { month, total: totalForMonth(expenses, key) }
  })
}