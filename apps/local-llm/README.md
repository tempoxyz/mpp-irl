# Local LLM

An OpenAI-compatible proxy for SmolLM2 running entirely on your laptop. Turn it into a paid inference API using reusable MPP sessions.

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

Ollama must be running at `http://127.0.0.1:11434`. The desktop app starts it automatically; a CLI-only installation can use:

```bash
ollama serve
```

Start the OpenAI-compatible proxy:

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
pnpm --filter local-llm chat -- "What is MPP?"
pnpm --filter local-llm chat -- "Why use payment sessions?"
pnpm dlx mppx@0.8.15 sessions list --account buyer --network testnet
```

Expected: raw `curl` returns `402`; both OpenAI-client calls stream normally; the session list shows one reusable channel.

## Extend it

- Pull another model and route by the OpenAI `model` field.
- Set different prices for different models.
- Meter output chunks instead of charging once per completion.
- Add context windows, structured output, or tool calls.
