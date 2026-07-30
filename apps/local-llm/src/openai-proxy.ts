import { OLLAMA_BASE_URL } from './constants.js'

type ProxyOptions = {
  baseUrl?: string
  fetchImpl?: typeof fetch
}

function errorResponse(message: string, status: number) {
  return Response.json(
    {
      error: {
        message,
        type: 'api_error',
      },
    },
    { status },
  )
}

export async function proxyOpenAiRequest(
  request: Request,
  endpoint: string,
  options: ProxyOptions = {},
) {
  const baseUrl = options.baseUrl ?? OLLAMA_BASE_URL
  const fetchImpl = options.fetchImpl ?? fetch
  const upstreamUrl = new URL(
    endpoint.replace(/^\/+/, ''),
    `${baseUrl.replace(/\/+$/, '')}/v1/`,
  )

  const headers = new Headers()
  for (const name of ['accept', 'content-type']) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  let upstream: Response
  try {
    upstream = await fetchImpl(upstreamUrl, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      signal: request.signal,
    })
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : 'unknown connection error'
    return errorResponse(`Could not reach Ollama at ${baseUrl}: ${detail}`, 502)
  }

  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete('content-length')
  responseHeaders.delete('content-encoding')

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}
