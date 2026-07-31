import { Hono } from 'hono'
import { discovery } from 'mppx/hono'

import { proxyOpenAiRequest } from './openai-proxy.js'
import { mppx, paidCompletion } from './payment.js'

const app = new Hono()

app.post(
  '/v1/chat/completions',
  paidCompletion,
  (c) => proxyOpenAiRequest(c.req.raw, 'chat/completions'),
)

app.post(
  '/v1/responses',
  paidCompletion,
  (c) => proxyOpenAiRequest(c.req.raw, 'responses'),
)

app.get('/v1/models', (c) => proxyOpenAiRequest(c.req.raw, 'models'))

discovery(app, mppx, {
  auto: true,
  info: {
    title: 'Local LLM API',
    version: '1.0.0',
  },
  serviceInfo: {
    categories: ['ai', 'text-generation'],
    docs: {
      homepage: '/',
      apiReference: '/openapi.json',
    },
  },
})

export default app
