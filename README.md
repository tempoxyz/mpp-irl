# mpp-irl

Turborepo with two mppx one-time payment demos.

| App | Port | Description |
|-----|------|-------------|
| `content-gate` | 3001 | Gates HTML content behind a $0.01 payment |
| `satellite-api` | 3002 | Proxies n2yo satellite positions API behind a $0.01 payment |

## Setup

```bash
pnpm install
```

Create a testnet mppx account:

```bash
npx mppx account create
npx mppx account view
```

Set `RECIPIENT_ADDRESS` in each app's `.env.local` (use the address from `account view`).

For the satellite API, also add your [n2yo API key](https://www.n2yo.com/api/):

```
RECIPIENT_ADDRESS=0xYourAddressHere
N2YO_API_KEY=your_api_key_here
```

## Run

```bash
pnpm dev
```

## Test

```bash
npx mppx "http://localhost:3001/api/content" --network testnet -iv
npx mppx "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" --network testnet -iv
```
