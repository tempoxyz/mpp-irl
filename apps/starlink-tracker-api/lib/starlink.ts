import {
  DEFAULT_SEARCH_RADIUS,
  N2YO_API_KEY,
  STARLINK_CATEGORY_ID,
} from './constants'

export type Observer = {
  alt: number
  lat: number
  lng: number
  radius: number
}

function numberParameter(
  searchParams: URLSearchParams,
  name: string,
  fallback?: number,
) {
  const value = searchParams.get(name)
  if (value === null) return fallback

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function parseObserver(searchParams: URLSearchParams): Observer | null {
  const lat = numberParameter(searchParams, 'lat')
  const lng = numberParameter(searchParams, 'lng')
  const alt = numberParameter(searchParams, 'alt', 0)
  const radius = numberParameter(
    searchParams,
    'radius',
    DEFAULT_SEARCH_RADIUS,
  )

  if (
    lat === undefined ||
    lat < -90 ||
    lat > 90 ||
    lng === undefined ||
    lng < -180 ||
    lng > 180 ||
    alt === undefined ||
    radius === undefined ||
    radius < 0 ||
    radius > 90
  ) {
    return null
  }

  return { alt, lat, lng, radius }
}

export function buildStarlinkUrl(
  observer: Observer,
  apiKey = N2YO_API_KEY,
) {
  const { alt, lat, lng, radius } = observer
  return (
    `https://api.n2yo.com/rest/v1/satellite/above/` +
    `${lat}/${lng}/${alt}/${radius}/${STARLINK_CATEGORY_ID}/` +
    `&apiKey=${apiKey}`
  )
}
