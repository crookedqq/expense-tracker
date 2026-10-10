export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Health', 'Fun', 'Other']

// YYYY-MM-DD in local time
export const todayString = () => new Date().toLocaleDateString('en-CA')

export const formatDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString() : 'No date'

// older saved expenses used "description" instead of "expName"
export const nameOf = (e) => e.expName ?? e.description

export const money = (n) => `$${n.toFixed(2)}`

export function categoriesOf(expense) {
  if (expense.categories?.length > 0) return expense.categories
  // imported category
  return [expense.category || 'Other']
}

// Defaults plus every tag already used, for the picker's dropdown
export const allCategories = (expenses) => [
  ...new Set([...CATEGORIES, ...expenses.flatMap(categoriesOf)]),
]

export const categoryOptionsFrom = (expenses) => [
  ...new Set([...CATEGORIES, ...expenses.map((e) => e.category).filter(Boolean)]),
]

// Trims, drops blanks, and treats "food" and "Food" as the same tag
export const normaliseTags = (values, options) => {
  const seen = new Set()
  const out = []
  for (const v of values) {
    const t = v.trim()
    if (!t) continue
    const tag = options.find((o) => o.toLowerCase() === t.toLowerCase()) ?? t
    if (!seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase())
      out.push(tag)
    }
  }
  return out
}

const TAG_COLORS = [
  { bg: '#e3f2fd', fg: '#0d47a1' },
  { bg: '#fce4ec', fg: '#880e4f' },
  { bg: '#e8f5e9', fg: '#1b5e20' },
  { bg: '#fff3e0', fg: '#e65100' },
  { bg: '#f3e5f5', fg: '#4a148c' },
  { bg: '#e0f2f1', fg: '#004d40' },
  { bg: '#fffde7', fg: '#f57f17' },
  { bg: '#efebe9', fg: '#3e2723' },
]

// The same tag name always gets the same colour, with nothing to store
export const tagColor = (label) =>
  TAG_COLORS[[...label].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % TAG_COLORS.length]