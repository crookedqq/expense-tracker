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

export const eventIcons = {
  flight: Plane,
  ticket: Ticket,
  drink: Martini,
  star: Sparkle,
  beach: Parasol,
  people: UserRoundGroup,
  shopping: ShoppingBag,
  computer: MonitorCog,
  map: MapPlus,
  mic: MicVocal,
}

export default function EventIcon({ name, size = 24, color = 'currentColor' }) {
  const IconComponent = eventIcons[name] || Folder
  return <IconComponent size={size} color={color} />
}