import {
  Box, Checkbox, Chip, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FolderIcon from '@mui/icons-material/Folder'
import { formatDate, nameOf } from '../utils/format'

export default function ExpenseList({ expenses, events, selected, onToggle, onToggleAll, onDelete }) {
  const eventName = (e) => events.find((ev) => ev.id === e.eventId)?.name
  const allSelected = expenses.length > 0 && expenses.every((e) => selected.includes(e.id))
  const someSelected = expenses.some((e) => selected.includes(e.id))

  return (
    <Paper>
      <List disablePadding>
        {expenses.length > 0 && (
          <ListItem divider disablePadding>
            <ListItemButton onClick={onToggleAll} dense>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Checkbox
                  edge="start"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{ input: { 'aria-label': 'Select all expenses' } }}
                />
              </ListItemIcon>
              <ListItemText secondary="Select all" />
            </ListItemButton>
          </ListItem>
        )}

        {expenses.map((e) => (
          <ListItem
            key={e.id}
            divider
            disablePadding
            secondaryAction={
              <IconButton edge="end" aria-label={`Delete ${nameOf(e)}`} onClick={() => onDelete(e.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => onToggle(e.id)} dense>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Checkbox
                  edge="start"
                  checked={selected.includes(e.id)}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{ input: { 'aria-label': `Select ${nameOf(e)}` } }}
                />
              </ListItemIcon>
              <ListItemText
                primary={`${nameOf(e)}: $${e.amount.toFixed(2)}`}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                    <Chip label={e.category || 'Other'} size="small" />
                    {eventName(e) && (
                      <Chip
                        icon={<FolderIcon />}
                        label={eventName(e)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {formatDate(e.date)}
                  </Box>
                }
                slotProps={{ secondary: { component: 'div' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {expenses.length === 0 && (
          <ListItem><ListItemText secondary="No expenses yet. Add your first one." /></ListItem>
        )}
      </List>
    </Paper>
  )
}