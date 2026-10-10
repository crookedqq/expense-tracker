import { useState } from 'react'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'

import { nameOf } from '../utils/format'

export default function EditExpenseDialog(
	{ expense, categoryOptions, onClose, onSave }
) {
	const [expName, setExpName] = useState(nameOf(expense))
	const [amount, setAmount] = useState(String(expense.amount))
	const [category, setCategory] = useState(expense.category || 'Other')
	const [date, setDate] = useState(expense.date || '')
	const [errors, setErrors] = useState({})

  function validate() {
    const found = {}
    if (!expName.trim()) found.expName = 'Please enter a name'
    const value = parseFloat(amount)
    if (!amount) found.amount = 'Please enter an amount'
    else if (!(value > 0)) found.amount = 'Amount must be greater than 0'
    if (!category.trim()) found.category = 'Please enter a category'
    if (!date) found.date = 'Please pick a date'
    return found
  }

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }))

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSave(expense.id, {
      expName: expName.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      date,
    })
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Edit expense</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              autoFocus
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
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  clearError('amount')
                }}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                  htmlInput: { step: '0.01', min: '0' },
                }}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  clearError('date')
                }}
                error={Boolean(errors.date)}
                helperText={errors.date}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            </Stack>
            <Autocomplete
              freeSolo
              options={categoryOptions}
              inputValue={category}
              onInputChange={(_, value) => {
                setCategory(value)
                clearError('category')
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  error={Boolean(errors.category)}
                  helperText={errors.category}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}