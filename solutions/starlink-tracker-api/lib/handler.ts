import { N2YO_API_KEY } from './constants'
import { buildStarlinkUrl, parseObserver } from './starlink'

type HandlerOptions = {
  apiKey?: string
  fetchImpl?: typeof fetch
}

export async function getStarlink(
  request: Request,
  options: HandlerOptions = {},
) {
  const apiKey = options.apiKey ?? N2YO_API_KEY
  const fetchImpl = options.fetchImpl ?? fetch
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

  if (apiKey === 'replace-with-public-workshop-key') {
    return Response.json(
      {
        error:
          'Set the public workshop N2YO key in lib/constants.ts before running.',
      },
      { status: 503 },
    )
  }

  const url = buildStarlinkUrl(observer, apiKey)
  const response = await fetchImpl(url, { cache: 'no-store' })
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
