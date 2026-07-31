import { describe, expect, it, vi } from 'vitest'

import { getStarlink } from '../../../lib/handler'
import { GET } from './route'

const URL =
  'http://localhost:3002/api/starlink?lat=41.702&lng=-76.014&alt=0&radius=90'

describe('Starlink route', () => {
  it('returns an MPP challenge before calling N2YO', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET(new Request(URL))

    expect(response.status).toBe(402)
    expect(response.headers.get('www-authenticate')).toContain('Payment')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('validates observer parameters after authorization', async () => {
    const response = await getStarlink(
      new Request('http://localhost:3002/api/starlink?lat=91&lng=0'),
      { apiKey: 'public-test-key' },
    )

    expect(response.status).toBe(400)
  })

  it('reports the missing workshop key', async () => {
    const response = await getStarlink(new Request(URL), {
      apiKey: 'replace-with-public-workshop-key',
    })

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({
      error: 'Set the public workshop N2YO key in lib/constants.ts before running.',
    })
  })

  it('returns N2YO JSON and preserves its status', async () => {
    const payload = {
      info: { category: 'Starlink' },
      above: [{ satid: 12345 }],
    }
    const fetchImpl = vi.fn(async () =>
      Response.json(payload, { status: 206 }),
    )

    const response = await getStarlink(new Request(URL), {
      apiKey: 'public-test-key',
      fetchImpl: fetchImpl as typeof fetch,
    })

    expect(response.status).toBe(206)
    expect(await response.json()).toEqual(payload)
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.n2yo.com/rest/v1/satellite/above/' +
        '41.702/-76.014/0/90/52/&apiKey=public-test-key',
      { cache: 'no-store' },
    )
  })

  it('maps non-JSON provider output to 502', async () => {
    const response = await getStarlink(new Request(URL), {
      apiKey: 'public-test-key',
      fetchImpl: vi.fn(async () =>
        new Response('gateway error', { status: 503 }),
      ) as typeof fetch,
    })

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      error: 'Invalid response from N2YO',
      status: 503,
    })
  })
})
