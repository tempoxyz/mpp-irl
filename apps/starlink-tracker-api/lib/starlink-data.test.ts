import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearStarlinkCache, getStarlinkData } from './starlink-data'

const observer = { alt: 0, lat: 41.702, lng: -76.014, radius: 90 }
const liveData = { above: [{ satid: 1 }], info: { category: 'Starlink' } }

describe('getStarlinkData', () => {
  beforeEach(clearStarlinkCache)

  it('caches a successful live response', async () => {
    const fetcher = vi.fn(async () => Response.json(liveData))

    await expect(
      getStarlinkData(observer, { fetcher, now: () => 1 }),
    ).resolves.toEqual({ data: liveData, source: 'live' })
    await expect(
      getStarlinkData(observer, { fetcher, now: () => 2 }),
    ).resolves.toEqual({ data: liveData, source: 'cache' })

    expect(fetcher).toHaveBeenCalledOnce()
  })

  it('uses stale cached data when N2YO is unavailable', async () => {
    let now = 1
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json(liveData))
      .mockRejectedValueOnce(new Error('network unavailable'))

    await getStarlinkData(observer, { cacheTtlMs: 1, fetcher, now: () => now })
    now = 3

    await expect(
      getStarlinkData(observer, { cacheTtlMs: 1, fetcher, now: () => now }),
    ).resolves.toEqual({ data: liveData, source: 'stale-cache' })
  })

  it('uses the fixture when N2YO is unavailable without cached data', async () => {
    const fetcher = vi.fn(async () => new Response('rate limited', { status: 429 }))

    const result = await getStarlinkData(observer, { fetcher })

    expect(result.source).toBe('fixture')
    expect(result.data).toMatchObject({ info: { category: 'Starlink' } })
  })

  it('supports an explicit offline mode', async () => {
    const fetcher = vi.fn()

    const result = await getStarlinkData(observer, { fetcher, offline: true })

    expect(result.source).toBe('fixture')
    expect(fetcher).not.toHaveBeenCalled()
  })
})
