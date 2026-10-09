import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { Button, List, ListItem, ListItemText, Paper, Typography, useTheme } from '@mui/material'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { money, nameOf } from '../utils/format'
import {
  currentMonthKey, totalForMonth, totalsByCategory, totalsByMonth,
} from '../utils/stats'

const COLORS = ['#a78bfa', '#e07a5f', '#2e7d32', '#f2cc8f', '#60a5fa', '#78909c']

export default function Analysis() {
  const { expenses, total } = useOutletContext()
  const theme = useTheme()

  if (expenses.length === 0) {
    return (
      <>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Analysis</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Charts and insights will appear once you add some expenses.
        </Typography>
        <Button component={RouterLink} to="/expenses" variant="contained">Add expense</Button>
      </>
    )
  }

  const byCategory = totalsByCategory(expenses)
  const byMonth = totalsByMonth(expenses)
  const top = byCategory[0]
  const biggest = expenses.reduce((max, e) => (e.amount > max.amount ? e : max))
  const thisMonth = totalForMonth(expenses, currentMonthKey())
  const lastMonth = totalForMonth(expenses, currentMonthKey(-1))

  let monthInsight = 'No spending last month to compare with.'
  if (lastMonth > 0) {
    const change = ((thisMonth - lastMonth) / lastMonth) * 100
    monthInsight = `You've spent ${Math.abs(change).toFixed(0)}% ${change >= 0 ? 'more' : 'less'} this month than last month.`
  }

  const insights = [
    `${top.name} is your biggest category: ${money(top.value)} (${((top.value / total) * 100).toFixed(0)}% of everything).`,
    `Your biggest single expense was ${nameOf(biggest)} at ${money(biggest.amount)}.`,
    `You average ${money(total / expenses.length)} per expense across ${expenses.length} entries.`,
    monthInsight,
  ]

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Analysis</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" component="h2">Insights</Typography>
        <List dense>
          {insights.map((text) => (
            <ListItem key={text} disableGutters>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" component="h2">Spending by category</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
              {byCategory.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => money(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" component="h2">Last 6 months</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(value) => money(value)} />
            <Bar dataKey="total" name="Spent" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </>
  )
}