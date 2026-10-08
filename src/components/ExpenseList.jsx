import {
  Box, Chip, IconButton, List, ListItem, ListItemText, Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatDate, nameOf } from '../utils/format'

export default function ExpenseList({ expenses, onDelete }) {
  return (
    <Paper>
      <List>
        {expenses.map((e) => (
          <ListItem
            key={e.id}
            divider
            secondaryAction={
              <IconButton edge="end" aria-label={`Delete ${nameOf(e)}`} onClick={() => onDelete(e.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${nameOf(e)}: $${e.amount.toFixed(2)}`}
              secondary={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip label={e.category || 'Other'} size="small" />
                  {formatDate(e.date)}
                </Box>
              }
              slotProps={{ secondary: { component: 'div' } }}
            />
          </ListItem>
        ))}
        {expenses.length === 0 && (
          <ListItem><ListItemText secondary="No expenses yet. Add your first one above." /></ListItem>
        )}
      </List>
    </Paper>
  )
}