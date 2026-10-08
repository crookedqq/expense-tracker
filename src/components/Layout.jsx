import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import InsightsIcon from '@mui/icons-material/Insights'
import useExpenses from '../hooks/useExpenses'

const DRAWER_WIDTH = 240

const TABS = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Expenses', to: '/expenses', icon: <ReceiptLongIcon /> },
  { label: 'Analysis', to: '/analysis', icon: <InsightsIcon /> },
]

export default function Layout() {
  const data = useExpenses() // one shared copy of the data for all pages
  const { pathname } = useLocation()

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>Expense Tracker</Typography>
        </Toolbar>
        <List sx={{ px: 1 }}>
          {TABS.map((t) => (
            <ListItemButton
              key={t.to}
              component={Link}
              to={t.to}
              selected={pathname === t.to}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{t.icon}</ListItemIcon>
              <ListItemText primary={t.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, overflowY: 'auto', bgcolor: 'grey.100' }}>
        <Outlet context={data} />
      </Box>
    </Box>
  )
}