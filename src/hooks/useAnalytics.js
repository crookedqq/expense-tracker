import { useEffect, useMemo, useState } from 'react'
import { fetchAnalysis } from '../../api/analytics'
import { nameOf } from '../utils/format'

export default function useAnalytics(expenses) {
  // Only send what the API's schema expects. Old expenses without a date are skipped.
  const body = useMemo(
    () =>
      JSON.stringify(
        expenses
          .filter((e) => e.date)
          .map((e) => ({
            id: e.id,
            expName: nameOf(e) ?? '',
            amount: e.amount,
            date: e.date,
            category: e.category || 'Other',
          })),
      ),
    [expenses],
  )

  const [result, setResult] = useState({ body: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchAnalysis(body, controller.signal)
      .then((data) => setResult({ body, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ body, data: null, error })
      })
    return () => controller.abort()
  }, [body])

  // "loading" is derived: the stored result is for an older request than the current one
  const loading = result.body !== body
  return { data: loading ? null : result.data, error: loading ? null : result.error, loading }
}