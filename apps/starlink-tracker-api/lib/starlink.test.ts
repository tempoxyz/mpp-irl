import { describe, expect, it } from 'vitest'

import { buildStarlinkUrl, parseObserver } from './starlink'

describe('parseObserver', () => {
  it('uses workshop defaults', () => {
    const observer = parseObserver(
      new URLSearchParams({ lat: '41.702', lng: '-76.014' }),
    )

    expect(observer).toEqual({
      alt: 0,
      lat: 41.702,
      lng: -76.014,
      radius: 90,
    })
  })

  it.each([
    [{ lng: '0' }, 'missing latitude'],
    [{ lat: '0' }, 'missing longitude'],
    [{ lat: '91', lng: '0' }, 'latitude above range'],
    [{ lat: '0', lng: '-181' }, 'longitude below range'],
    [{ lat: '0', lng: '0', radius: '91' }, 'radius above range'],
    [{ lat: 'north', lng: '0' }, 'nonnumeric latitude'],
  ])('rejects %s (%s)', (parameters) => {
    expect(parseObserver(new URLSearchParams(parameters))).toBeNull()
  })
})

describe('buildStarlinkUrl', () => {
  it('uses the N2YO above endpoint and Starlink category 52', () => {
    expect(
      buildStarlinkUrl(
        { alt: 0, lat: 41.702, lng: -76.014, radius: 90 },
        'public-test-key',
      ),
    ).toBe(
      'https://api.n2yo.com/rest/v1/satellite/above/' +
        '41.702/-76.014/0/90/52/&apiKey=public-test-key',
    )
  })
})
