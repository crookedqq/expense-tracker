import { useEffect, useId, useState } from 'react'
import {
  Button, Container, FormControl, FormHelperText, IconButton, InputAdornment,
  InputLabel, List, ListItem, ListItemText, OutlinedInput, Paper, Stack,
  TextField, Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const todayString = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })
  const [expName, setExpName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayString)
  const [errors, setErrors] = useState({})
  const amountId = useId()

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const sorted = [...expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  function validate() {
    const found = {}
    if (!expName.trim()) found.expName = 'Please enter a name'
    const value = parseFloat(amount)
    if (!amount) found.amount = 'Please enter an amount'
    else if (!(value > 0)) found.amount = 'Amount must be greater than 0'
    if (!date) found.date = 'Please pick a date'
    return found
  }

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function addExpense(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setExpenses([
      ...expenses,
      { id: crypto.randomUUID(), expName: expName.trim(), amount: parseFloat(amount), date },
    ])
    setExpName('')
    setAmount('')
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const formatDate = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString() : 'No date')
  const nameOf = (e) => e.expName ?? e.description

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1">Expenses</Typography>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        Total: ${total.toFixed(2)}
      </Typography>

      <Paper component="form" noValidate onSubmit={addExpense} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Expense name"
            value={expName}
            onChange={(e) => {
              setExpName(e.target.value)
              clearError('expName')
            }}
            error={Boolean(errors.expName)}
            helperText={errors.expName}
          />
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <FormControl fullWidth error={Boolean(errors.amount)}>
              <InputLabel htmlFor={amountId}>Amount</InputLabel>
              <OutlinedInput
                id={amountId}
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  clearError('amount')
                }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                inputProps={{ step: '0.01', min: '0' }}
              />
              {errors.amount && <FormHelperText>{errors.amount}</FormHelperText>}
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                clearError('date')
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(errors.date)}
              helperText={errors.date}
              fullWidth
            />
          </Stack>
          <Button type="submit" variant="contained" size="large">Add expense</Button>
        </Stack>
      </Paper>

      <Paper>
        <List>
          {sorted.map((e) => (
            <ListItem
              key={e.id}
              divider
              secondaryAction={
                <IconButton edge="end" aria-label={`Delete ${nameOf(e)}`} onClick={() => deleteExpense(e.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${nameOf(e)}: $${e.amount.toFixed(2)}`} secondary={formatDate(e.date)} />
            </ListItem>
          ))}
          {sorted.length === 0 && (
            <ListItem><ListItemText secondary="No expenses yet. Add your first one above." /></ListItem>
          )}
        </List>
      </Paper>
    </Container>
  )
}
