# Local LLM solution

Protects OpenAI-compatible Chat Completions and Responses endpoints with
Tempo session protocol v2. Each completion costs `0.001` pathUSD on Moderato
testnet (chain `42431`). `GET /v1/models` stays free.

## Configure

```bash
ollama pull smollm2:135m-instruct-q2_K
pnpm dlx mppx@0.8.15 account create --account seller --network testnet
```

The checked-in public workshop `MPP_SECRET_KEY` works locally without
configuration. Replace it for deployment. Optionally export
`MPPX_SELLER_ACCOUNT`; it defaults to `seller`. The server loads that account
with `resolveAccount`.

## Run and verify

```bash
ollama serve
pnpm --filter local-llm-solution dev
curl -i -X POST http://localhost:3003/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"smollm2:135m-instruct-q2_K","messages":[{"role":"user","content":"Say hello."}]}'
curl http://localhost:3003/openapi.json
pnpm --filter local-llm-solution paid-chat
pnpm --filter local-llm-solution test
pnpm --filter local-llm-solution build
```

Both paid POST routes return a protocol-v2 `402` challenge without a payment
credential. Native Hono discovery generates `/openapi.json`. The paid OpenAI
client closes its session after the streamed completion.

`Store.memory()` is deliberate for this single-process workshop only.
