import { describe, expect, it, vi } from 'vitest'

import { proxyOpenAiRequest } from './openai-proxy'

describe('proxyOpenAiRequest', () => {
  it('forwards an OpenAI request to the matching Ollama endpoint', async () => {
    const fetchImpl = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      expect(input.toString()).toBe('http://ollama.test/v1/chat/completions')
      expect(init?.method).toBe('POST')
      expect(new Headers(init?.headers).get('content-type')).toBe('application/json')
      expect(JSON.parse(new TextDecoder().decode(init?.body as ArrayBuffer))).toEqual({
        model: 'smollm2',
        messages: [{ role: 'user', content: 'Hello' }],
      })

      return Response.json({
        choices: [{ message: { role: 'assistant', content: 'Hi' } }],
      })
    })

    const request = new Request('http://localhost:3003/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'smollm2',
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await proxyOpenAiRequest(request, 'chat/completions', {
      baseUrl: 'http://ollama.test',
      fetchImpl: fetchImpl as typeof fetch,
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      choices: [{ message: { role: 'assistant', content: 'Hi' } }],
    })
  })

  it('passes streaming response bytes through unchanged', async () => {
    const body = 'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\ndata: [DONE]\n\n'
    const fetchImpl = vi.fn(async () => new Response(body, {
      headers: { 'content-type': 'text/event-stream' },
    }))

    const response = await proxyOpenAiRequest(
      new Request('http://localhost:3003/v1/responses', {
        method: 'POST',
        body: '{}',
      }),
      'responses',
      { fetchImpl: fetchImpl as typeof fetch },
    )

    expect(response.headers.get('content-type')).toBe('text/event-stream')
    expect(await response.text()).toBe(body)
  })

  it('returns an OpenAI-shaped error when Ollama is unavailable', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('connection refused')
    })

    const response = await proxyOpenAiRequest(
      new Request('http://localhost:3003/v1/models'),
      'models',
      {
        baseUrl: 'http://ollama.test',
        fetchImpl: fetchImpl as typeof fetch,
      },
    )

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      error: {
        message: 'Could not reach Ollama at http://ollama.test: connection refused',
        type: 'api_error',
      },
    })
  })
})
