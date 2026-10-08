export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Health', 'Fun', 'Other']

// YYYY-MM-DD in local time
export const todayString = () => new Date().toLocaleDateString('en-CA')

export const formatDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString() : 'No date'

// older saved expenses used "description" instead of "expName"
export const nameOf = (e) => e.expName ?? e.description

export const money = (n) => `$${n.toFixed(2)}`