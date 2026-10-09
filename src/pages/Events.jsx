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

import EventIcon from '../components/EventIcon'
import EventNameDialog from '../components/EventNameDialog'
import { formatDate, money } from '../utils/format'

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
        alignItems="center"
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">Events</Typography>

        <Button variant="contained" sx={{ borderRadius: 2 }} onClick={() => setCreating(true)}>
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

          return (
            <Grid item xs={12} sm={6} md={4} key={ev.id}>
              <Card sx={{ height: '100%', borderRadius: 4 }}>
                <CardActionArea
                  component={RouterLink}
                  to={`/events/${ev.id}`}
                  sx={{ height: '100%', p: 1 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          flexShrink: 0,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: ev.color ? `${ev.color}15` : 'primary.50',
                          color: ev.color || 'primary.main',
                        }}
                      >
                        <EventIcon name={ev.icon} size={36} color={ev.color || 'currentColor'} />
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ m: 0, lineHeight: 1 }}
                      >
                        {money(total)}
                      </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {ev.name}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip size="small" label={`${items.length} expenses`} />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={items.length > 0 ? dateRange(items) : 'Placeholder - placeholder'}
                        sx={{
                          visibility: items.length > 0 ? 'visible' : 'hidden',
                        }}
                      />
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
          onSave={(name, icon, color) => {
            addEvent(name, icon, color)
            setCreating(false)
          }}
        />
      )}
    </Box>
  )
}