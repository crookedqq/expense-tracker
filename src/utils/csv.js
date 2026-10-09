// Splits CSV text into rows of cells. Handles quotes, line breaks inside
// quotes, a leading BOM, and comma / semicolon / tab separators.
export function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '')
  const firstLine = clean.split(/\r?\n/, 1)[0]
  const delimiter = [',', ';', '\t']
    .map((d) => [d, firstLine.split(d).length])
    .sort((a, b) => b[1] - a[1])[0][0]

  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i]
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === delimiter) {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += c
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim()))
}

// Header names we recognise (lowercase). Earlier names win, so "merchant name"
// is preferred over "transaction details" when a file has both.
const ALIASES = {
  name: ['name', 'expname', 'expense', 'expense name', 'merchant name', 'merchant', 'payee', 'title', 'description', 'transaction details', 'details'],
  fallbackName: ['transaction details', 'description', 'details', 'narrative'],
  amount: ['amount', 'cost', 'price', 'value', 'total', 'debit'],
  date: ['date', 'transaction date', 'posted date', 'posted', 'day'],
  category: ['category', 'categories', 'tag'],
}

// Keeps the sign: "-8.4", "(8.40)" and "8.40-" are negative.
// Also copes with "$1,234.50" and European "1.234,50".
export function parseAmount(raw) {
  const text = String(raw ?? '').trim()
  const negative = /^[-−–]/.test(text) || /^\(.*\)$/.test(text) || /-$/.test(text)
  let s = text.replace(/[^0-9.,]/g, '')
  if (!s) return NaN
  if (s.includes(',') && s.includes('.')) {
    s = s.lastIndexOf(',') > s.lastIndexOf('.')
      ? s.replace(/\./g, '').replace(',', '.') // 1.234,56
      : s.replace(/,/g, '')                    // 1,234.56
  } else if (s.includes(',')) {
    s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '')
  }
  const n = parseFloat(s)
  if (!Number.isFinite(n)) return NaN
  return (negative ? -1 : 1) * Math.round(n * 100) / 100
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Returns "YYYY-MM-DD", or "" if it can't be read as a real date.
// Understands 2026-04-30, 30/04/2026, 30-Apr-26 and 30 April 2026.
// For all-number dates like 03/04/2026, dayFirst decides day vs month.
export function parseDate(raw, dayFirst = true) {
  const s = String(raw ?? '').trim()
  let y, m, d, match
  if ((match = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/))) {
    ;[, y, m, d] = match
  } else if ((match = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/))) {
    const [, a, b, yy] = match
    y = yy.length === 2 ? '20' + yy : yy
    ;[d, m] = dayFirst ? [a, b] : [b, a]
  } else if ((match = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3,9})[-/ ,]*(\d{2,4})$/))) {
    const [, dd, mon, yy] = match
    const idx = MONTHS.indexOf(mon.slice(0, 3).toLowerCase())
    if (idx === -1) return ''
    d = dd
    m = idx + 1
    y = yy.length === 2 ? '20' + yy : yy
  } else {
    return ''
  }
  const check = new Date(+y, +m - 1, +d)
  if (check.getFullYear() !== +y || check.getMonth() !== +m - 1 || check.getDate() !== +d) return ''
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// Turns raw rows into checked items. The first row must be a header.
export function analyseRows(rows, { dayFirst }) {
  const [header = [], ...body] = rows
  const names = header.map((h) => h.trim().toLowerCase())
  const find = (options) => {
    for (const o of options) {
      const i = names.indexOf(o)
      if (i !== -1) return i
    }
    return -1
  }
  const col = {
    name: find(ALIASES.name),
    amount: find(ALIASES.amount),
    date: find(ALIASES.date),
    category: find(ALIASES.category),
  }
  const fallback = find(ALIASES.fallbackName)
  col.fallback = fallback === col.name ? -1 : fallback

  const missing = ['name', 'amount', 'date'].filter((f) => col[f] === -1)
  if (missing.length) return { missing, items: [] }

  const cell = (r, i) => (i >= 0 ? (r[i] ?? '').trim() : '')
  const signed = body.map((r) => parseAmount(r[col.amount]))
  // Bank exports mark spending as negative. If any row is negative,
  // treat positives as money coming in (salary, refunds) and skip them.
  const hasDebits = signed.some((n) => n < 0)

  const items = body.map((r, i) => {
    const s = signed[i]
    const name = cell(r, col.name) || cell(r, col.fallback)
    const date = parseDate(r[col.date], dayFirst)
    const category = cell(r, col.category)
    let error = ''
    let credit = false
    if (!name) error = 'Missing name'
    else if (!Number.isFinite(s) || s === 0) error = 'Invalid amount'
    else if (!date) error = 'Invalid date'
    else if (hasDebits && s > 0) credit = true
    return { line: i + 2, name, amount: Math.abs(s), date, category: category || 'Other', error, credit }
  })
  return { missing: [], items }
}

// Used to spot rows that already exist
export const dupKey = (name, amount, date) =>
  `${String(name).trim().toLowerCase()}|${Number(amount).toFixed(2)}|${date}`

// The ONE place that decides what an imported expense looks like.
// If your expense shape changes (e.g. several categories), edit this.
export const toExpense = (item) => ({
  expName: item.name,
  amount: item.amount,
  category: item.category,
  date: item.date,
})