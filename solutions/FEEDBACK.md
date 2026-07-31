# Feedback and improvement opportunities

## What did not work initially

- The original repository omitted the public workshop N2YO key, blocking the
  first live Starlink check. The approved public key is now checked into both
  the starter and solution; the paid end-to-end flow passes.
- The tiny Q2 SmolLM2 model ignored simple response-length instructions during
  live checks. This is expected for the 135M model but makes it unsuitable for
  output-sensitive production APIs.
- A first Next.js build warned that `mppx` could not resolve its optional MCP
  peer. This is resolved: both Next.js solutions directly include
  `@modelcontextprotocol/sdk`.

## Recommended improvements

- Cache or store paid content locally. Today, an upstream blog outage can occur
  after payment and return `502` to a charged buyer.
- Add upstream-failure refund/credit policy for both content and N2YO. Payment
  middleware necessarily runs before the paid handler, so provider failures
  otherwise happen after charging.
- Move the N2YO key to server-only environment configuration for any use beyond
  the workshop. The source-code key is intentionally public and must remain
  rate-limited and disposable.
- Replace `Store.memory()` with a shared atomic store before running multiple
  local-LLM processes or deploying. In-memory session state disappears on
  restart and cannot coordinate replicas.
- Add explicit health/readiness endpoints for the upstream blog, N2YO, Ollama,
  seller account, and payment configuration.
- Override the checked-in public workshop `MPP_SECRET_KEY` before deployment.
  The fallback avoids workshop setup failures but is intentionally not secret
  and must never protect a public service.
- Add request-body schemas to local-LLM discovery. Automatic Hono discovery
  correctly advertises payment offers but cannot infer OpenAI body schemas.
- Add CI with service mocks, production builds, and a scheduled testnet smoke
  job. Keep paid test credentials isolated and always close test sessions.
