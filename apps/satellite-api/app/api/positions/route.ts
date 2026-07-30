import { type NextRequest } from 'next/server'

const N2YO_API_KEY = process.env.N2YO_API_KEY || ''

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const id = searchParams.get('id')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const alt = searchParams.get('alt') || '0'
  const seconds = searchParams.get('seconds') || '10'

  if (!id || !lat || !lng) {
    return Response.json(
      { error: 'Missing required params: id, lat, lng' },
      { status: 400 },
    )
  }

  const url = `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${lat}/${lng}/${alt}/${seconds}/&apiKey=${N2YO_API_KEY}`
  console.log('[satellite-api] Fetching:', url.replace(N2YO_API_KEY, '***'))
  console.log('[satellite-api] Params:', { id, lat, lng, alt, seconds })

  const res = await fetch(url)
  console.log('[satellite-api] n2yo status:', res.status)

  const text = await res.text()
  console.log('[satellite-api] n2yo response:', text.slice(0, 500))

  let data
  try {
    data = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Invalid response from n2yo', raw: text }, { status: 502 })
  }

  return Response.json(data)
}
