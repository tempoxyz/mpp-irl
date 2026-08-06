import fallbackData from './fixtures/starlink.json'
import { buildStarlinkUrl, type Observer } from './starlink'

const DEFAULT_CACHE_TTL_MS = 60_000

type DataSource = 'cache' | 'fixture' | 'live' | 'stale-cache'

type CacheEntry = {
  data: unknown
  expiresAt: number
}

type Options = {
  cacheTtlMs?: number
  fetcher?: typeof fetch
  now?: () => number
  offline?: boolean
}

const cache = new Map<string, CacheEntry>()

function cacheKey(observer: Observer) {
  return [observer.lat, observer.lng, observer.alt, observer.radius].join(':')
}

function configuredCacheTtlMs() {
  const value = Number(process.env['STARLINK_CACHE_TTL_MS'])
  return Number.isFinite(value) && value >= 0 ? value : DEFAULT_CACHE_TTL_MS
}

export function clearStarlinkCache() {
  cache.clear()
}

export async function getStarlinkData(
  observer: Observer,
  options: Options = {},
): Promise<{ data: unknown; source: DataSource }> {
  const fetcher = options.fetcher ?? fetch
  const now = options.now?.() ?? Date.now()
  const offlineValue = process.env['WORKSHOP_OFFLINE']?.toLowerCase()
  const offline =
    options.offline ?? (offlineValue === 'true' || offlineValue === '1')
  const ttl = options.cacheTtlMs ?? configuredCacheTtlMs()
  const key = cacheKey(observer)
  const cached = cache.get(key)

  if (offline) return { data: fallbackData, source: 'fixture' }
  if (cached && cached.expiresAt > now) {
    return { data: cached.data, source: 'cache' }
  }

  try {
    const response = await fetcher(buildStarlinkUrl(observer), {
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`N2YO returned ${response.status}`)

    const data: unknown = await response.json()
    cache.set(key, { data, expiresAt: now + ttl })
    return { data, source: 'live' }
  } catch {
    if (cached) return { data: cached.data, source: 'stale-cache' }
    return { data: fallbackData, source: 'fixture' }
  }
}
