import { useEffect, useState } from 'react'

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

export default function useExpenses() {
  const [expenses, setExpenses] = useState(() => load('expenses'))
  const [events, setEvents] = useState(() => load('events'))

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const sorted = [...expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  const addExpense = (expense) =>
    setExpenses((prev) => [...prev, { id: crypto.randomUUID(), ...expense }])

  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id))

  const addEvent = (name, icon = 'flight', color = '#0288d1') => {
    const id = crypto.randomUUID()
    setEvents((prev) => [...prev, { id, name: name.trim(), icon, color }])
    return id
  }

  const renameEvent = (id, name, icon, color) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, name: name.trim(), icon, color } : ev
      )
    )
  }

  // deleting an event keeps its expenses, they just become ungrouped
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
    setExpenses((prev) => prev.map((e) => (e.eventId === id ? { ...e, eventId: undefined } : e)))
  }

  // eventId = undefined removes the expenses from whatever event they're in
  const assignToEvent = (ids, eventId) =>
    setExpenses((prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, eventId } : e)))

  return {
    expenses: sorted, events, total,
    addExpense, deleteExpense,
    addEvent, renameEvent, deleteEvent, assignToEvent,
  }
}