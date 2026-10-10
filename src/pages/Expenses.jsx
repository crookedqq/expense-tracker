import { useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Box, Button, Divider, Menu, MenuItem, Paper, Snackbar, Stack, Typography,
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import EventNameDialog from '../components/EventNameDialog'
import { allCategories, categoryOptionsFrom } from '../utils/format'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ImportDialog from '../components/ImportDialog'
import { parseCSV, toExpense } from '../utils/csv'
import EditExpenseDialog from '../components/EditExpenseDialog'


const plural = (n) => `${n} expense${n === 1 ? '' : 's'}`

export default function Expenses() {
  const { expenses, events, addExpense, addMany, deleteExpense, addEvent, assignToEvent, updateExpense } = useOutletContext()
  const [selected, setSelected] = useState([])
  const [anchor, setAnchor] = useState(null)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState('')
  const fileRef = useRef()
  const [importRows, setImportRows] = useState(null)
  const [editing, setEditing] = useState(null)

  // ignore ids of expenses that have since been deleted
  const selectedIds = expenses.filter((e) => selected.includes(e.id)).map((e) => e.id)
  const anyInEvent = expenses.some((e) => selectedIds.includes(e.id) && e.eventId)
  const allSelected = expenses.length > 0 && selectedIds.length === expenses.length

  async function handleFile(e) {
    const file = e.target.files[0]
    e.target.value = '' // lets you pick the same file again later
    if (!file) return
    setImportRows(parseCSV(await file.text()))
  }

  function handleImport(items) {
    addMany(items.map(toExpense))
    setImportRows(null)
    setToast(`Imported ${items.length} expense${items.length === 1 ? '' : 's'}`)
  }

  function createAndMove(name, icon, color) {
    const id = addEvent(name, icon, color)
    assignToEvent(selectedIds, id)
    setCreating(false)
    finish(`Added ${plural(selectedIds.length)} to "${name}"`)
  }

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleAll = () => setSelected(allSelected ? [] : expenses.map((e) => e.id))

  function finish(message) {
    setToast(message)
    setSelected([])
    setAnchor(null)
  }

  function moveTo(ev) {
    assignToEvent(selectedIds, ev.id)
    finish(`Added ${plural(selectedIds.length)} to "${ev.name}"`)
  }

  function removeFromEvents() {
    assignToEvent(selectedIds, undefined)
    finish(`Removed ${plural(selectedIds.length)} from their events`)
  }

  function createAndMove(name) {
    const id = addEvent(name)
    assignToEvent(selectedIds, id)
    setCreating(false)
    finish(`Added ${plural(selectedIds.length)} to "${name}"`)
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">Expenses</Typography>
        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileRef.current.click()}>
          Import CSV
        </Button>
        <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={handleFile} />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
        }}
      >
        <ExpenseForm onAdd={addExpense} categoryOptions={allCategories(expenses)} />

        <Box>
          {selectedIds.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                position: 'sticky', top: 0, zIndex: 1, mb: 2, p: 1.5,
                display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ flexGrow: 1 }}>{selectedIds.length} selected</Typography>
              <Button onClick={() => setSelected([])}>Clear</Button>
              <Button
                variant="contained"
                startIcon={<CreateNewFolderIcon />}
                onClick={(e) => setAnchor(e.currentTarget)}
              >
                Add to event
              </Button>
            </Paper>
          )}

          <ExpenseList
            expenses={expenses}
            events={events}
            selected={selectedIds}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onDelete={deleteExpense}
            onEdit={setEditing}
          />
        </Box>
      </Box>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {events.map((ev) => (
          <MenuItem key={ev.id} onClick={() => moveTo(ev)}>{ev.name}</MenuItem>
        ))}
        {events.length > 0 && <Divider />}
        <MenuItem
          onClick={() => {
            setAnchor(null)
            setCreating(true)
          }}
        >
          + New event…
        </MenuItem>
        {anyInEvent && (
          <MenuItem onClick={removeFromEvents} sx={{ color: 'error.main' }}>
            Remove from event
          </MenuItem>
        )}
      </Menu>

      {creating && (
        <EventNameDialog title="New event" onClose={() => setCreating(false)} onSave={createAndMove} />
      )}

      {importRows && (
        <ImportDialog
          rows={importRows}
          existing={expenses}
          onClose={() => setImportRows(null)}
          onImport={handleImport}
        />
      )}

      {editing && (
        <EditExpenseDialog
          expense={editing}
          categoryOptions={categoryOptionsFrom(expenses)}
          onClose={() => setEditing(null)}
          onSave={(id, changes) => {
            updateExpense(id, changes)
            setEditing(null)
            setToast('Expense updated')
          }}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} message={toast} />
    </>
  )
}