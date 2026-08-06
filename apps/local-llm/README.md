# Local LLM

A terminal-only Hono server that exposes local SmolLM2 inference through the
OpenAI API shape. Add reusable MPP sessions to sell each completion.

## Setup

Install [Ollama](https://ollama.com/download), then download the 88 MB
quantized model:

```bash
ollama pull smollm2:135m-instruct-q2_K
```

Inspect and run it directly:

```bash
ollama list
ollama show smollm2:135m-instruct-q2_K
ollama run smollm2:135m-instruct-q2_K \
  "Explain machine payments in one sentence."
```

This Q2 model is intentionally tiny and fast; expect limited factual accuracy.
The exercise is about serving and monetizing local inference, not model
quality.

Ollama must be running at `http://127.0.0.1:11434`. The desktop app starts it
automatically; a CLI-only installation can use:

```bash
ollama serve
```

The repository's Docker Compose setup connects the containerized proxy to this
host Ollama service automatically.

If Ollama is unavailable, set `OLLAMA_BASE_URL` and `OLLAMA_MODEL` in
`.env.local` to another OpenAI-compatible server and model. The proxy only
requires compatible `/v1/models`, `/v1/chat/completions`, and `/v1/responses`
endpoints.

In another terminal, start the Hono proxy:

```bash
pnpm install
pnpm --filter local-llm dev
```

## Try it before MPP

Use the official OpenAI JavaScript client:

```bash
pnpm --filter local-llm chat -- "Why are payment sessions useful?"
pnpm --filter local-llm responses -- "Describe this model in one sentence."
```

Any OpenAI client can use the same configuration:

```text
baseURL: http://localhost:3003/v1
apiKey: local
model: smollm2:135m-instruct-q2_K
```

The server supports:

- `POST /v1/chat/completions`, including streaming
- `POST /v1/responses`, including streaming
- `GET /v1/models`

There is no web interface. Use the README and terminals throughout the
exercise.

## Add MPP

Paste this into your coding agent:

```text
Read https://tempo.xyz/developers/docs/guide/machine-payments/pay-as-you-go
and https://mpp.dev/advanced/discovery.

In apps/local-llm, add mppx and viem. Protect POST /v1/chat/completions and
POST /v1/responses with mppx.session middleware from mppx/hono. Charge 0.001
pathUSD per completion using current Tempo session protocol v2 on Moderato
testnet, chain ID 42431. Keep GET /v1/models free. Preserve the existing
OpenAI request, response, error, and streaming formats.

Load the local seller account named "local-llm-seller" with resolveAccount from mppx/cli.
Use Store.memory() only because this is a single-process workshop server. Add
discovery(app, mppx, { auto: true, ... }) after the paid routes so mppx serves
/openapi.json automatically; do not hand-author an OpenAPI route. Do not use
legacy sessions.
```

Manual path:

1. Install `mppx@0.8.15` and `viem`.
2. Create a funded `local-llm-seller` account on Tempo testnet.
3. Create an `Mppx` instance using `tempo.session`, pathUSD, chain ID `42431`,
   and `Store.memory()`.
4. Add `mppx.session({ amount: "0.001", unitType: "completion" })` before both
   Hono completion handlers.
5. Call `discovery(app, mppx, { auto: true, info: { ... } })` after registering
   the routes. This mounts `/openapi.json` from the actual middleware
   configuration.

## Test after MPP

Create the server account before starting the modified server:

```bash
pnpm dlx mppx@0.8.15 account create \
  --account local-llm-seller \
  --network testnet
```

Create and fund a separate buyer:

```bash
pnpm dlx mppx@0.8.15 account create \
  --account buyer \
  --network testnet

pnpm dlx mppx@0.8.15 account fund \
  --account buyer \
  --network testnet
```

Inspect the unpaid challenge:

```bash
curl -i http://localhost:3003/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "smollm2:135m-instruct-q2_K",
    "messages": [{"role": "user", "content": "Say hello."}],
    "stream": false
  }'
```

Expected: `402 Payment Required` with a Tempo session challenge for `0.001`
pathUSD.

Pay and retry with the mppx CLI:

```bash
pnpm dlx mppx@0.8.15 http://localhost:3003/v1/chat/completions \
  --account buyer \
  --network testnet \
  --json-body '{
    "model": "smollm2:135m-instruct-q2_K",
    "messages": [{"role": "user", "content": "Say hello."}],
    "stream": false
  }' \
  -vv
```

Run that command twice, then inspect the reusable channel:

```bash
pnpm dlx mppx@0.8.15 sessions list \
  --account buyer \
  --network testnet
```

Expected: both paid requests return OpenAI-compatible JSON and receipts; the
session list shows one channel with increasing cumulative spend.

`Store.memory()` keeps seller session state only for the lifetime of this
process. Keep the server running until the buyer closes its channel; after a
server restart, use a fresh buyer session.

When finished:

```bash
pnpm dlx mppx@0.8.15 sessions close \
  --all \
  --yes \
  --account buyer \
  --network testnet
```

## Extend it

- Pull another model and route by the OpenAI `model` field.
- Set different prices for different models.
- Meter output chunks instead of charging once per completion.
- Add context windows, structured output, or tool calls.
