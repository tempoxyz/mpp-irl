import { Hono } from 'hono'

import { proxyOpenAiRequest } from './openai-proxy.js'

const app = new Hono()

app.post('/v1/chat/completions', (c) =>
  proxyOpenAiRequest(c.req.raw, 'chat/completions'),
)

app.post('/v1/responses', (c) =>
  proxyOpenAiRequest(c.req.raw, 'responses'),
)

app.get('/v1/models', (c) => proxyOpenAiRequest(c.req.raw, 'models'))

export default app
