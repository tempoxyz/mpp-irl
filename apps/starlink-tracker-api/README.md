# Starlink tracker API

An open endpoint that finds Starlink satellites currently above an observer.
Turn it into a paid data API without requiring accounts or API keys from
buyers.

## Setup

The public workshop N2YO key is included in `lib/constants.ts`. It is
known-exposed and safe to include in this exercise, but it is not a production
credential. Apply provider-side limits and rotate or revoke it after the event.

Responses are cached in memory for one minute to reduce calls made through the
shared key. If N2YO is unavailable or rate-limited, the server uses stale cache
data when possible, then falls back to a small bundled fixture. Inspect the
`X-Workshop-Data-Source` response header for `live`, `cache`, `stale-cache`, or
`fixture`.

`.env.example` also includes a public workshop `MPP_SECRET_KEY` and
Foundry/Anvil development recipient; copy it to `.env.local` when implementing
the payment gate. Replace both for deployment.

```bash
pnpm install
pnpm --filter starlink-tracker-api dev
```

## Try it before MPP

```bash
curl -sS -D /dev/stderr \
  "http://localhost:3002/api/starlink?lat=41.702&lng=-76.014&alt=0&radius=90" \
  | jq
```

Expected: `info.category` is `Starlink`; `above` contains Starlink satellites
currently visible within 90° of the observer’s zenith. Results vary with time
and location.

N2YO’s `above` API searches objects over an observer and filters by category.
This example uses category `52`, the documented Starlink category, and the
maximum 90° radius to search the full sky above the local horizon.

Set `WORKSHOP_OFFLINE=true` to always use the fixture. Override the cache
duration with `STARLINK_CACHE_TTL_MS`; the fixture preserves the API shape but
does not represent current satellite positions.

## Add MPP

Paste this into your coding agent:

```text
Use https://tempo.xyz/developers/docs/guide/machine-payments/one-time-payments
as reference.

In apps/starlink-tracker-api, add mppx to GET /api/starlink. Charge 0.01
pathUSD per request with tempo.charge on Tempo testnet. Run the existing N2YO
request only after payment succeeds. Keep N2YO_API_KEY in lib/constants.ts and
do not send it to the browser or include it in logs.
```

Manual path:

1. Add `mppx` and `viem`.
2. Create an `Mppx` instance with `tempo.charge({ testnet: true })`.
3. Use pathUSD at `0x20c0000000000000000000000000000000000000`.
4. Wrap the existing handler with `mppx.charge({ amount: "0.01" })`.

## Test after MPP

```bash
URL="http://localhost:3002/api/starlink?lat=41.702&lng=-76.014&alt=0&radius=90"

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

Expected: the first request returns `402`; `mppx` pays and returns the same
Starlink JSON with a payment receipt.

## Extend it

- Select a returned NORAD ID and request its future ground-track positions.
- Add observer presets for workshop locations.
- Cache nearby results to stay within N2YO’s `above` request limit.
- Price broader search radii or historical data separately.
