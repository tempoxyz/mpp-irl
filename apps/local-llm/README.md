# Local LLM

An OpenAI-compatible proxy for SmolLM2 running entirely on your laptop. Turn it into a paid inference API using reusable MPP sessions.

> The `smolllm-session-demo-solution` branch contains the completed MPP integration.

## Setup

Install [Ollama](https://ollama.com/download), then download the 88 MB quantized model:

```bash
ollama pull smollm2:135m-instruct-q2_K
```

Inspect and run it directly:

```bash
ollama list
ollama show smollm2:135m-instruct-q2_K
ollama run smollm2:135m-instruct-q2_K "Explain machine payments in one sentence."
```

This Q2 model is intentionally tiny and fast; expect limited factual accuracy. The exercise is about serving and monetizing local inference, not model quality.

Ollama must be running at `http://127.0.0.1:11434`. The desktop app starts it automatically; a CLI-only installation can use:

```bash
ollama serve
```

Start the OpenAI-compatible proxy:

```bash
pnpm install
pnpm --filter local-llm dev
```

## Try it before MPP on the starter branch

Use the official OpenAI JavaScript client:

```bash
pnpm --filter local-llm chat -- "Why are payment sessions useful?"
pnpm --filter local-llm responses -- "Describe this model in one sentence."
```

Or point any OpenAI client at:

```text
baseURL: http://localhost:3003/v1
apiKey: local
model: smollm2:135m-instruct-q2_K
```

The proxy supports:

- `POST /v1/chat/completions`, including streaming
- `POST /v1/responses`, including streaming
- `GET /v1/models`
- `GET /openapi.json`, with MPP payment discovery on the solution branch

## Add MPP

Paste this into your coding agent:

```text
Use https://mpp.dev/guides/pay-as-you-go.md as reference.
In apps/local-llm, protect POST /v1/chat/completions and POST /v1/responses
with current tempo.session payments. Charge 0.001 pathUSD per completion on
Tempo Moderato testnet (chain ID 42431). Keep the upstream OpenAI request,
response, and streaming formats unchanged. Use Store.memory() for this local
workshop and load the server signing account named seller with resolveAccount
from mppx/cli. Leave GET /v1/models open. Add an mppx-aware fetch to the
existing OpenAI client example so only its baseURL and transport differ.
Do not use legacy sessions.
```

Manual path:

1. Add `mppx` and `viem`.
2. Create a funded local seller with `mppx account create --account seller --network testnet`.
3. Register `tempo.session` with chain ID `42431`, pathUSD, and `Store.memory()`.
4. Wrap both completion handlers with `mppx.session({ amount: "0.001", unitType: "completion" })`.
5. Pass the mppx-aware `fetch` to the OpenAI JavaScript client.

`Store.memory()` and the generated fallback `MPP_SECRET_KEY` are appropriate only for this single-process local exercise. Use durable atomic storage and an explicit secret outside the workshop.

## Test after MPP

Create the seller before starting the server:

```bash
pnpm dlx mppx@0.8.15 account create --account seller --network testnet
```

Create and fund a separate buyer:

```bash
pnpm dlx mppx@0.8.15 account create --account buyer --network testnet
pnpm dlx mppx@0.8.15 account fund --account buyer --network testnet
```

Inspect the challenge:

```bash
curl -i http://localhost:3003/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "smollm2:135m-instruct-q2_K",
    "messages": [{"role": "user", "content": "Say hello."}],
    "stream": false
  }'
```

Make two paid requests to reuse the same session:

```bash
pnpm --filter local-llm paid-chat
```

Expected: raw `curl` returns `402`; the OpenAI client completes two streamed Chat Completions calls and one Responses call; all three log lines show the same reusable channel ID and increasing cumulative spend. The example then closes its in-memory channel and refunds the unused deposit.

The paid client is still the official OpenAI JavaScript client. It receives `session.fetch` as its custom transport, so the OpenAI request and streaming response shapes remain unchanged while mppx handles `402` challenges.

To test the same endpoint with the mppx CLI:

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

pnpm dlx mppx@0.8.15 sessions list --account buyer --network testnet
```

Close open workshop channels when finished:

```bash
pnpm dlx mppx@0.8.15 sessions close \
  --all \
  --yes \
  --account buyer \
  --network testnet
```

Validate discovery, challenges, malformed credentials, paid responses, and receipts for both endpoints:

```bash
MPPX_ACCOUNT=buyer pnpm dlx mppx@0.8.15 validate http://localhost:3003 \
  --body '{
    "/v1/chat/completions": {
      "model": "smollm2:135m-instruct-q2_K",
      "messages": [{"role": "user", "content": "Say hello."}],
      "stream": false
    },
    "/v1/responses": {
      "model": "smollm2:135m-instruct-q2_K",
      "input": "Say hello.",
      "stream": false
    }
  }'
```

## Extend it

- Pull another model and route by the OpenAI `model` field.
- Set different prices for different models.
- Meter output chunks instead of charging once per completion.
- Add context windows, structured output, or tool calls.
