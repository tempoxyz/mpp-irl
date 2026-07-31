import { N2YO_API_KEY } from '../../../lib/constants'
import { buildStarlinkUrl, parseObserver } from '../../../lib/starlink'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const observer = parseObserver(searchParams)

  if (!observer) {
    return Response.json(
      {
        error:
          'Use valid lat (-90..90), lng (-180..180), alt, and radius (0..90).',
      },
      { status: 400 },
    )
  }

  const url = buildStarlinkUrl(observer)
  const response = await fetch(url, { cache: 'no-store' })
  const text = await response.text()

  try {
    return Response.json(JSON.parse(text), { status: response.status })
  } catch {
    return Response.json(
      { error: 'Invalid response from N2YO', status: response.status },
      { status: 502 },
    )
  }
}
