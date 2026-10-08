import { Box, Typography } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useOutletContext()

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Expenses</Typography>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </Box>
  )
}