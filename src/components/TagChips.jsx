import { Chip } from '@mui/material'
import { tagColor } from '../utils/format'

export default function TagChip({ label, ...props }) {
  const { bg, fg } = tagColor(label)
  return (
    <Chip
      label={label}
      size="small"
      {...props}
      sx={{ bgcolor: bg, color: fg, '& .MuiChip-deleteIcon': { color: fg, opacity: 0.6 } }}
    />
  )
}