# Starlink tracker API solution

Protects `GET /api/starlink` with a one-time `tempo.charge` payment of `0.01`
pathUSD on Tempo testnet. Input validation and the N2YO request execute only
after payment succeeds.

## Configure

1. Copy `.env.example` to `.env.local`.
2. Set the seller's `RECIPIENT_ADDRESS`.

The public, known-exposed workshop N2YO key is checked into `lib/constants.ts`.
The public workshop `MPP_SECRET_KEY` also works without configuration. Neither
value is suitable for production use.

The Next.js solution directly includes `@modelcontextprotocol/sdk`, the peer
needed by the `mppx` server bundle.

## Run and verify

```bash
pnpm --filter starlink-tracker-api-solution dev
URL='http://localhost:3002/api/starlink?lat=41.702&lng=-76.014&alt=0&radius=90'
curl -i "$URL"
pnpm dlx mppx@0.8.15 "$URL" \
  --account buyer --network testnet -vv
pnpm --filter starlink-tracker-api-solution test
pnpm --filter starlink-tracker-api-solution build
```

The unsigned request returns `402` without calling N2YO. The paid request
returns the provider JSON and a `Payment-Receipt` header when the workshop key
is valid.
