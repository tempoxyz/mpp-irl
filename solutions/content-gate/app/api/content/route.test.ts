import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getContent } from '../../../lib/content'
import { GET } from './route'

describe('content route', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('returns the upstream Markdown unchanged after authorization', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response('# Paid article', {
          headers: { 'content-type': 'text/markdown' },
        }),
      ),
    )

    const response = await getContent()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toBe('# Paid article')
  })

  it('maps an upstream failure to 502', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })))

    const response = await getContent()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch blog content',
      status: 503,
    })
  })

  it('returns an MPP challenge before fetching content', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET(
      new Request('http://localhost:3001/api/content'),
    )

    expect(response.status).toBe(402)
    expect(response.headers.get('www-authenticate')).toContain('Payment')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
