import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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
} from 'lucide-react'

const icons = [
  { name: 'flight', Icon: Plane },
  { name: 'ticket', Icon: Ticket },
  { name: 'drink', Icon: Martini },
  { name: 'food', Icon: Utensils },
  { name: 'home', Icon: House },
  { name: 'car', Icon: Car },
  { name: 'shopping', Icon: ShoppingBag },
  { name: 'gaming', Icon: Gamepad2 },
  { name: 'work', Icon: Briefcase },
  { name: 'mic', Icon: MicVocal },
]

export default function EventNameDialog({
  title,
  initial = '',
  initialIcon = 'flight',
  onClose,
  onSave,
}) {
  const [name, setName] = useState(initial)
  const [selectedIcon, setSelectedIcon] = useState(initialIcon)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed, selectedIcon)
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Event name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 3 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Choose an icon
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1,
          }}
        >
          {icons.map(({ name: iconName, Icon }) => {
            const selected = selectedIcon === iconName

            return (
              <Button
                key={iconName}
                onClick={() => setSelectedIcon(iconName)}
                variant={selected ? 'contained' : 'outlined'}
                sx={{
                  minWidth: 0,
                  minHeight: 72,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Icon size={24} />
              </Button>
            )
          })}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}