# Local LLM

A terminal-only Hono server that exposes local SmolLM2 inference through the
OpenAI API shape. This solution branch protects completions with reusable MPP
sessions.

> The `smolllm-session-demo` branch is the unpaid attendee starter.

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

Create the server account:

```bash
pnpm dlx mppx@0.8.15 account create \
  --account seller \
  --network testnet
```

In another terminal, start the Hono server:

```bash
pnpm install
pnpm --filter local-llm dev
```

## Integration

The solution uses:

- `mppx.session` middleware from `mppx/hono`
- pathUSD on Tempo Moderato, chain ID `42431`
- `0.001` pathUSD per completion
- current Tempo session protocol v2
- `Store.memory()` for this single-process workshop

Both completion routes use the same payment middleware. `GET /v1/models`
remains free.

Native `discovery(app, mppx, { auto: true })` derives `/openapi.json` from the
registered Hono payment middleware. There is no hand-authored OpenAPI route.

There is no web interface. Use the README and terminals throughout the
exercise.

## Test the challenge

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

## Pay with mppx

Create and fund a separate buyer:

```bash
pnpm dlx mppx@0.8.15 account create \
  --account buyer \
  --network testnet

pnpm dlx mppx@0.8.15 account fund \
  --account buyer \
  --network testnet
```

Pay and retry:

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

Run that command twice, then inspect the reused channel:

```bash
pnpm dlx mppx@0.8.15 sessions list \
  --account buyer \
  --network testnet
```

## Pay with an OpenAI client

The paid client remains the official OpenAI JavaScript client. It receives an
mppx-aware `fetch`, so the OpenAI request and streaming response shapes are
unchanged:

```bash
pnpm --filter local-llm paid-chat
```

The example makes two streamed Chat Completions requests and one Responses
request over one channel, logs increasing cumulative spend, then closes the
channel.

Close any remaining CLI channels:

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
- Replace `Store.memory()` with durable atomic storage before deployment.
