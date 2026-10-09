import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#a78bfa' },
    background: { paper: '#13131a', default: '#15151c' },
  },
  shape: { borderRadius: 10 },
})

export default theme