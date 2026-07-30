# Verification record

Verified locally on July 30, 2026. Credentials and payment secrets are omitted.

## Environment

- Node.js `24.13.0`
- pnpm `10.33.0`
- Ollama `0.32.5`
- Hono `4.12.32`
- `@hono/node-server` `2.0.12`
- Model `smollm2:135m-instruct-q2_K`
  - ID `888e2e49aff1`
  - Download size `88 MB`
  - Quantization `Q2_K`

## Starter projects

Running `pnpm dev` started all three projects together.

| Project | Check | Result |
| --- | --- | --- |
| Content gate | `GET /api/content` | `200`, `text/markdown`, 3,674-byte body |
| Satellite API | documented ISS request | `200`, satellite `25544`, 10 positions |
| Local LLM | `GET /v1/models` | `200`, downloaded model listed |
| Local LLM | OpenAI Chat Completions client | streamed response completed |
| Local LLM | OpenAI Responses client | response completed |

The N2YO key used for the live check remains only in the ignored
`apps/satellite-api/.env.local` file. Server logs redacted the key.

## Paid local inference

- An unsigned Chat Completions request returned `402`.
- The challenge specified Tempo session protocol v2 on Moderato chain `42431`.
- Currency was pathUSD and the price was `0.001` per completion.
- Native Hono discovery generated `/openapi.json` from the registered payment
  middleware and advertised both paid completion routes.
- `GET /` returned `404`; there is no workshop web interface.
- The official OpenAI JavaScript client completed two streamed Chat Completions
  requests and one Responses request through the mppx transport.
- All three client calls reused one payment channel. Cumulative spend advanced
  from `1000` to `2000` to `3000` base units.
- After the Hono refactor, the OpenAI client completed another streamed paid
  request, recorded `1000` cumulative base units, and closed its channel.
- The client closed its channel and received a testnet transaction hash.
- The mppx CLI completed the same `402 -> payment -> 200 + receipt` flow, reused
  its channel for a second request, and closed all remaining buyer sessions.

`mppx validate` exercised discovery and both paid endpoints:

```text
passed: 47
failed: 0
warnings: 2
skipped: 0
```

Checks included challenge structure, malformed authorization, real testnet
payment, payment receipt, on-chain receipt, and nonempty response bodies. The
two discovery warnings note that automatic Hono discovery cannot infer the
OpenAI request-body schemas; payment offers and runtime validation both pass.

## Automated checks

```text
pnpm test
3 tests passed

pnpm build
3 applications built successfully
```

The local-model tests cover request forwarding, byte-for-byte streaming, and
OpenAI-shaped upstream connection errors.
