import { generateProxy } from 'mppx/discovery'

const payment = {
  offers: [
    {
      amount: '1000',
      currency: '0x20c0000000000000000000000000000000000000',
      description: 'Local model completion',
      intent: 'session',
      method: 'tempo',
      chainId: 42431,
      unitType: 'completion',
    },
  ],
}

const requestBody = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
      },
    },
  },
}

const document = generateProxy({
  info: {
    title: 'Local LLM API',
    version: '1.0.0',
  },
  routes: [
    {
      method: 'post',
      path: '/v1/chat/completions',
      payment,
      requestBody,
      summary: 'Create an OpenAI-compatible chat completion',
    },
    {
      method: 'post',
      path: '/v1/responses',
      payment,
      requestBody,
      summary: 'Create an OpenAI-compatible response',
    },
    {
      method: 'get',
      path: '/v1/models',
      payment: null,
      summary: 'List local models',
    },
  ],
  serviceInfo: {
    categories: ['ai', 'text-generation'],
    docs: {
      homepage: '/',
      apiReference: '/openapi.json',
    },
  },
})

export function GET() {
  return Response.json(document, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  })
}
