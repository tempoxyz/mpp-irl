import { serve } from '@hono/node-server'

import app from './app.js'
import { PORT } from './constants.js'

serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  console.log(`Local LLM listening on http://localhost:${port}`)
})
