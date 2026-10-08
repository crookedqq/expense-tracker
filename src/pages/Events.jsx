import { useState } from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

import {
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
import { formatDate, money } from '../utils/format'

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
  const dates = items.map((e) => e.date).filter(Boolean).sort()

  if (dates.length === 0) return ''

  const first = formatDate(dates[0])
  const last = formatDate(dates[dates.length - 1])

  return first === last ? first : `${first} – ${last}`
}

export default function Events() {
  const { expenses, events, addEvent } = useOutletContext()
  const [creating, setCreating] = useState(false)

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">Events</Typography>

        <Button variant="contained" onClick={() => setCreating(true)}>
          New Event
        </Button>
      </Stack>

      {events.length === 0 && (
        <Typography color="text.secondary">
          No events yet. Create one here, or assign expenses from the Expenses
          page.
        </Typography>
      )}

      <Grid container spacing={2}>
        {events.map((ev) => {
          const items = expenses.filter((e) => e.eventId === ev.id)
          const total = items.reduce((sum, e) => sum + e.amount, 0)
          const EventIcon = eventIcons[ev.icon] || Folder

          return (
            <Grid item xs={12} sm={6} md={4} key={ev.id}>
              <Card sx={{ height: '100%', borderRadius: 4 }}>
                <CardActionArea
                  component={RouterLink}
                  to={`/events/${ev.id}`}
                  sx={{ height: '100%', p: 1 }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.50',
                          color: 'primary.main',
                        }}
                      >
                        <EventIcon size={24} />
                      </Box>

                      <Typography variant="h6" fontWeight={700}>
                        {money(total)}
                      </Typography>
                    </Stack>

                    <Typography variant="h6" gutterBottom>
                      {ev.name}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip size="small" label={`${items.length} expenses`} />

                      {items.length > 0 && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={dateRange(items)}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {creating && (
        <EventNameDialog
          title="New event"
          onClose={() => setCreating(false)}
          onSave={(name, icon) => {
            addEvent(name, icon)
            setCreating(false)
          }}
        />
      )}
    </Box>
  )
}