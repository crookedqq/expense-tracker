import { Alert, Box, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import useAnalytics from '../hooks/useAnalytics'
import { money } from '../utils/format'

const dollars = (cents) => money(cents / 100)

export default function ServerInsights({ expenses }) {
  const { data, error, loading } = useAnalytics(expenses)

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        Trends and unusual spending
      </Typography>

      {loading && <CircularProgress size={24} />}

      {error && (
        <Alert severity="warning">
          Couldn't reach the analytics service. Is it running? (uvicorn app.main:app --reload)
        </Alert>
      )}

      {data && (
        <>
          <Typography variant="body1" fontWeight="bold">Month by month</Typography>
          {data.monthly.map((m) => (
            <Stack key={m.month.name} direction="row" alignItems="center" gap={2} sx={{ py: 0.5 }}>
              <Typography sx={{ width: 90 }}>{m.month}</Typography>
              <Typography sx={{ flexGrow: 1 }}>{dollars(m.total_cents)}</Typography>
              {m.change_pct !== null && (
                <Chip
                  size="small"
                  color={m.change_pct > 0 ? 'warning' : 'success'}
                  label={`${m.change_pct > 0 ? '+' : ''}${m.change_pct}%`}
                />
              )}
            </Stack>
          ))}

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Unusual expenses
          </Typography>
          {data.anomalies.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nothing unusual. (A category needs at least 5 expenses before anything can be flagged.)
            </Typography>
          ) : (
            data.anomalies.map((a) => (
              <Box key={a.id} sx={{ py: 0.5 }}>
                <Typography>
                  {a.expName || 'Expense'}: {dollars(a.amount_cents)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Chip
                    size="small"
                    // color=
                    label={a.category }
                  />
                  · usually about {dollars(a.typical_cents)}
                </Typography>
              </Box>
            ))
          )}
        </>
      )}
    </Paper>
  )
}