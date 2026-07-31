import { beforeEach, describe, expect, it, vi } from 'vitest'

import app from './app.js'

describe('paid OpenAI app', () => {
  beforeEach(() => vi.restoreAllMocks())

  it.each(['/v1/chat/completions', '/v1/responses'])(
    'challenges unpaid POST %s without calling Ollama',
    async (path) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      const response = await app.request(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      })

      expect(response.status).toBe(402)
      expect(response.headers.get('www-authenticate')).toContain('Payment')
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('keeps the model listing free', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ data: [{ id: 'smollm2' }] })),
    )

    const response = await app.request('/v1/models')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: [{ id: 'smollm2' }] })
  })

  it('generates discovery from both paid routes', async () => {
    const response = await app.request('/openapi.json')
    const document = await response.json() as {
      paths: Record<string, { post?: Record<string, unknown> }>
    }

    expect(response.status).toBe(200)
    for (const path of ['/v1/chat/completions', '/v1/responses']) {
      expect(document.paths[path].post).toHaveProperty('x-payment-info')
    }
  })
})
