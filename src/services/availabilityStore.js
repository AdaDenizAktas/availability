const DATA_URL = `${import.meta.env.BASE_URL}data/availability.json`

export async function loadAvailabilityConfig() {
  const response = await fetch(DATA_URL, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to load availability.json: ${response.status}`)
  }
  return response.json()
}
