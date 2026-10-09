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
  Stack
} from '@mui/material'

import {
  Plane,
  Ticket,
  Martini,
  Sparkle,
  Parasol,
  UserRoundGroup,
  ShoppingBag,
  MonitorCog,
  MapPlus,
  MicVocal,
} from 'lucide-react'

const icons = [
  { name: 'flight', Icon: Plane },
  { name: 'ticket', Icon: Ticket },
  { name: 'drink', Icon: Martini },
  { name: 'star', Icon: Sparkle },
  { name: 'beach', Icon: Parasol },
  { name: 'people', Icon: UserRoundGroup },
  { name: 'shopping', Icon: ShoppingBag },
  { name: 'computer', Icon: MonitorCog },
  { name: 'map', Icon: MapPlus },
  { name: 'mic', Icon: MicVocal },
]

const colorOptions = [
  '#0288d1', // Blue
  '#96cf99', // Green
  '#ed6c02', // Orange
  '#d32f2f', // Red
  '#543a7e', // Purple
  '#db8bd1', // Pink
  '#009688', // Teal
  '#424242', // Dark Grey
]

export default function EventNameDialog({
  title,
  initial = '',
  initialIcon = 'flight',
  initialColor = '#0288d1',
  onClose,
  onSave,
}) {
  const [name, setName] = useState(initial)
  const [selectedIcon, setSelectedIcon] = useState(initialIcon)
  const [selectedColor, setSelectedColor] = useState(initialColor)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return

    onSave(trimmed, selectedIcon, selectedColor)
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

        {/* Color Palette */}
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Choose a color
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 1, mb: 3 }}
        >
          {colorOptions.map((color) => {
            const selected = selectedColor === color

            return (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: color,
                  cursor: 'pointer',
                  border: selected ? '3px solid #000' : '2px solid transparent',
                  boxShadow: selected ? 2 : 0,
                  transition: 'transform 0.1s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              />
            )
          })}
        </Stack>

        {/* Icon Grid */}
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
                sx={{
                  minWidth: 0,
                  minHeight: 64,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: selected ? selectedColor : 'divider',
                  bgcolor: selected ? selectedColor : 'transparent',
                  color: selected ? '#ffffff' : selectedColor,
                  '&:hover': {
                    bgcolor: selected
                      ? selectedColor
                      : `${selectedColor}15`,
                    borderColor: selectedColor,
                  },
                }}
              >
                <Icon size={24} color={selected ? '#ffffff' : selectedColor} />
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
          sx={{
            bgcolor: selectedColor,
            '&:hover': { bgcolor: selectedColor },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}