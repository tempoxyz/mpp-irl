# Satellite API

An open proxy for N2YO satellite positions. Turn it into a paid data API without adding accounts or API keys for buyers.

## Setup

Create `apps/satellite-api/.env.local`:

```dotenv
N2YO_API_KEY=your_n2yo_api_key
```

The workshop may provide a shared N2YO key. It is a public, known-exposed
workshop credential—not a secret or a production credential. Distribute its
value separately, keep it in `.env.local` so it cannot be mistaken for an
application default, apply provider-side limits, and rotate or revoke it after
the event.

```bash
pnpm install
pnpm --filter satellite-api dev
```

## Try it before MPP

```bash
curl -sS \
  "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" \
  | jq
```

Expected: satellite metadata plus ten future ISS positions.

## Add MPP

Paste this into your coding agent:

```text
Use https://mpp.dev/guides/one-time-payments.md as reference.
In apps/satellite-api, add mppx to GET /api/positions. Charge 0.01 pathUSD
per request with tempo.charge on Tempo testnet. Run the existing N2YO request
only after payment succeeds. Read MPP_SECRET_KEY, RECIPIENT_ADDRESS, and
N2YO_API_KEY from apps/satellite-api/.env.local. Never log secret values.
```

Manual path:

1. Add `mppx` and `viem`.
2. Create an `Mppx` instance with `tempo.charge({ testnet: true })`.
3. Use pathUSD at `0x20c0000000000000000000000000000000000000`.
4. Wrap the existing handler with `mppx.charge({ amount: "0.01" })`.

## Test after MPP

```bash
URL="http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10"

# No credential: inspect the challenge.
curl -i "$URL"

# Create and fund a buyer once.
pnpm dlx mppx@0.8.15 account create --account buyer --network testnet
pnpm dlx mppx@0.8.15 account fund --account buyer --network testnet

# Pay, retry, and print the data.
pnpm dlx mppx@0.8.15 "$URL" \
  --account buyer \
  --network testnet \
  -vv \
  | jq
```

Expected: the first request returns `402`; `mppx` pays and returns the same N2YO JSON with a payment receipt.

## Extend it

- Add another N2YO endpoint.
- Cache positions and price historical data separately.
- Replace N2YO with flight, weather, peptide, or proprietary data.
