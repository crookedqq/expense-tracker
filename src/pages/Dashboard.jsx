import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import {
  Box, Button, Chip, List, ListItem, ListItemText, Paper, Stack, Typography,
} from '@mui/material'
import { formatDate, money, nameOf } from '../utils/format'
import { currentMonthKey, totalForMonth, totalsByCategory } from '../utils/stats'

function StatCard({ label, value, note }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5">{value}</Typography>
      {note && <Typography variant="caption" color="text.secondary">{note}</Typography>}
    </Paper>
  )
}

export default function Dashboard() {
  const { expenses, total } = useOutletContext()

  const recent = expenses.slice(0, 3) // list is already newest first
  const thisMonth = totalForMonth(expenses, currentMonthKey())
  const topCategory = totalsByCategory(expenses)[0]
  const average = expenses.length ? total / expenses.length : 0
  const biggest = expenses.reduce((max, e) => (!max || e.amount > max.amount ? e : max), null)

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap:2 }}>
        <Typography variant="h4" component="h1">Dashboard</Typography>
        <Button component={RouterLink} to="/expenses" variant="contained" sx={{borderRadius: 2}}>Add expense</Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mb: 3,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
        }}
      >
        <StatCard label="Total spent" value={money(total)} />
        <StatCard label="This month" value={money(thisMonth)} />
        <StatCard label="Expenses logged" value={expenses.length} />
        <StatCard label="Average expense" value={money(average)} />
        <StatCard label="Top category" value={topCategory ? topCategory.name : '—'} />
        <StatCard
          label="Biggest expense"
          value={biggest ? money(biggest.amount) : '—'}
          note={biggest ? nameOf(biggest) : undefined}
        />
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="h2">Recent purchases</Typography>
        <Button component={RouterLink} to="/expenses" size="small">View all</Button>
      </Stack>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {recent.map((e) => (
          <Paper key={e.id} sx={{ p: 2 }}>
            <Typography>{nameOf(e)}: {money(e.amount)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip label={e.category || 'Other'} size="small" />
              <Typography variant="body2" color="text.secondary">{formatDate(e.date)}</Typography>
            </Box>
          </Paper>
        ))}
        {recent.length === 0 && (
          <Typography color="text.secondary">Nothing yet. Add your first expense.</Typography>
        )}
      </Stack>
    </>
  )
}