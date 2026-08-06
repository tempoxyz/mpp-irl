import { getStarlinkData } from '../../../lib/starlink-data'
import { parseObserver } from '../../../lib/starlink'

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

  const { data, source } = await getStarlinkData(observer)
  return Response.json(data, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Workshop-Data-Source': source,
    },
  })
}
