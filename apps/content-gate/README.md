# Content gate

An open endpoint that returns an MPP blog post as Markdown. Turn it into a one-time paid content download.

## Setup

```bash
pnpm install
pnpm --filter content-gate dev
```

## Try it before MPP

```bash
curl -i http://localhost:3001/api/content
```

Expected: `200 OK`, a `text/markdown` content type, and the article body.

## Add MPP

Paste this into your coding agent:

```text
Use https://mpp.dev/guides/one-time-payments.md as reference.
In apps/content-gate, add mppx to GET /api/content. Charge 0.01 pathUSD
per request with tempo.charge on Tempo testnet. Keep the existing response
unchanged after payment. Use MPP_SECRET_KEY and RECIPIENT_ADDRESS from
apps/content-gate/.env.local. Do not expose either value to the browser.
```

Manual path:

1. Add `mppx` and `viem`.
2. Create an `Mppx` instance with `tempo.charge({ testnet: true })`.
3. Use pathUSD at `0x20c0000000000000000000000000000000000000`.
4. Wrap the existing handler with `mppx.charge({ amount: "0.01" })`.

## Test after MPP

```bash
# No credential: inspect the challenge.
curl -i http://localhost:3001/api/content

# Create and fund a buyer once.
pnpm dlx mppx@0.8.15 account create --account buyer --network testnet
pnpm dlx mppx@0.8.15 account fund --account buyer --network testnet

# Pay, retry, and print the content.
pnpm dlx mppx@0.8.15 http://localhost:3001/api/content \
  --account buyer \
  --network testnet \
  -vv
```

Expected: the first request returns `402`; `mppx` pays and returns the original Markdown with a payment receipt.

## Extend it

- Serve a local document instead of a URL.
- Add different prices for text, image, and PDF formats.
- Return a short free preview before the paid download.
