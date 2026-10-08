import { useOutletContext, useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Chip,
} from '@mui/material'

import {
  ArrowLeft,
  Trash2,
  Pencil,
  Plane,
  Ticket,
  Martini,
  Utensils,
  House,
  Car,
  ShoppingBag,
  Gamepad2,
  Briefcase,
  MicVocal,
  Folder,
} from 'lucide-react'

import EventNameDialog from '../components/EventNameDialog'
import { formatDate, money, nameOf } from '../utils/format'
import { useState } from 'react'

const eventIcons = {
  flight: Plane,
  ticket: Ticket,
  drink: Martini,
  food: Utensils,
  home: House,
  car: Car,
  shopping: ShoppingBag,
  gaming: Gamepad2,
  work: Briefcase,
  mic: MicVocal,
}

function dateRange(items) {
  const dates = items
    .map((e) => e.date)
    .filter(Boolean)
    .sort()

  if (dates.length === 0) return ''

  const first = formatDate(dates[0])
  const last = formatDate(dates[dates.length - 1])

  return first === last ? first : `${first} – ${last}`
}

export default function EventDetails() {
  const { eventId } = useParams()

  const {
    expenses,
    events,
    renameEvent,
    deleteEvent,
    assignToEvent,
  } = useOutletContext()

  const [renaming, setRenaming] = useState(false)

  const event = events.find((ev) => String(ev.id) === String(eventId))

  if (!event) {
    return (
      <Box>
        <Typography variant="h5">Event not found</Typography>

        <Button
          component={RouterLink}
          to="/events"
          startIcon={<ArrowLeft size={18} />}
          sx={{ mt: 2 }}
        >
          Back to events
        </Button>
      </Box>
    )
  }

  const items = expenses.filter((e) => e.eventId === event.id)

  const total = items.reduce((sum, e) => sum + e.amount, 0)

  const EventIcon = eventIcons[event.icon] || Folder

  function handleDelete() {
    const note =
      items.length > 0
        ? ` Its ${items.length} expense${
            items.length === 1 ? '' : 's'
          } will be kept, just ungrouped.`
        : ''

    if (window.confirm(`Delete the event "${event.name}"?${note}`)) {
      deleteEvent(event.id)
    }
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Button
        component={RouterLink}
        to="/events"
        startIcon={<ArrowLeft size={18} />}
        sx={{ mb: 3 }}
      >
        Events
      </Button>

      {/* Event header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.50',
            color: 'primary.main',
          }}
        >
          <EventIcon size={36} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            {event.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip size="small" label={`${items.length} expenses`} />

            {items.length > 0 && (
              <Chip
                size="small"
                variant="outlined"
                label={dateRange(items)}
              />
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Total */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total spent
        </Typography>

        <Typography variant="h3">{money(total)}</Typography>
      </Box>

      {/* Expenses */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Expenses
      </Typography>

      <List disablePadding>
        {items.map((e) => (
          <ListItem
            key={e.id}
            divider
            disableGutters
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`Remove ${nameOf(e)} from ${event.name}`}
                onClick={() => assignToEvent([e.id], undefined)}
              >
                <Trash2 size={18} />
              </IconButton>
            }
          >
            <ListItemText
              primary={nameOf(e)}
              secondary={`${e.category || 'Other'} · ${formatDate(e.date)}`}
            />

            <Typography fontWeight={600}>{money(e.amount)}</Typography>
          </ListItem>
        ))}

        {items.length === 0 && (
          <ListItem disableGutters>
            <ListItemText secondary="No expenses have been added to this event yet." />
          </ListItem>
        )}
      </List>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button startIcon={<Pencil size={18} />} onClick={() => setRenaming(true)}>
          Edit
        </Button>

        <Button
          color="error"
          startIcon={<Trash2 size={18} />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>

      {renaming && (
        <EventNameDialog
          title="Edit event"
          initial={event.name}
          initialIcon={event.icon}
          onClose={() => setRenaming(false)}
          onSave={(name, icon) => {
            renameEvent(event.id, name, icon)
            setRenaming(false)
          }}
        />
      )}
    </Box>
  )
}