import { useEffect, useState } from 'react'

export default function useExpenses() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const sorted = [...expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  const addExpense = (expense) =>
    setExpenses((prev) => [...prev, { id: crypto.randomUUID(), ...expense }])

  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id))

  return { expenses: sorted, total, addExpense, deleteExpense }
}