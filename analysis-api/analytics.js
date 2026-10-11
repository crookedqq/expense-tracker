const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function fetchAnalysis(body, signal) {
  const res = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal,
  })
  if (!res.ok) throw new Error(`Analytics service returned ${res.status}`)
  return res.json()
}