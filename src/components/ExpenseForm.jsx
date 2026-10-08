import { useId, useState } from 'react'
import {
  Button, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem,
  OutlinedInput, Paper, Stack, TextField,
} from '@mui/material'
import { CATEGORIES, todayString } from '../utils/format'

export default function ExpenseForm({ onAdd }) {
  const [expName, setExpName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(todayString)
  const [errors, setErrors] = useState({})
  const amountId = useId()

  function validate() {
    const found = {}
    if (!expName.trim()) found.expName = 'Please enter a name'
    const value = parseFloat(amount)
    if (!amount) found.amount = 'Please enter an amount'
    else if (!(value > 0)) found.amount = 'Amount must be greater than 0'
    if (!category) found.category = 'Please choose a category'
    if (!date) found.date = 'Please pick a date'
    return found
  }

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onAdd({ expName: expName.trim(), amount: parseFloat(amount), category, date })
    setExpName('')
    setAmount('')
    setCategory('')
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} sx={{ p: 2, mb: 2 }}>
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
            label="Category"
            select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              clearError('category')
            }}
            error={Boolean(errors.category)}
            helperText={errors.category}
            fullWidth
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Stack>
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
        />
        <Button type="submit" variant="contained" size="large">Add expense</Button>
      </Stack>
    </Paper>
  )
}