import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Analysis from './pages/Analysis'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="events" element={<Events />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}