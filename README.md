# mpp-irl

We've prepare two apps to showcase what you can build with Machine Payments Protocol (MPP):
- Pay-per-call API: monetize an API without managing API keys. To demonstrate, we'll monetize the [n2yo API](https://www.n2yo.com/api/) for satellite positions.
- Paywalled content: charge a fee for premium content. In this case the newest [MPP blog post](https://mpp.dev/blog/mppx-agent-runtimes)!


## Setup

```bash
pnpm install
```

For the satellite API, create `apps/satellite-api/.env.local` with your [n2yo API key](https://www.n2yo.com/api/):

```
N2YO_API_KEY=your_api_key_here
```

## Run

```bash
pnpm dev
```

## Test locally

```bash
curl http://localhost:3001/api/content
curl "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10"
```

## Hackathon: Add mppx payments

Refer to https://mpp.dev/guides/one-time-payments for adding payment gating to your app.


## Test your integration

Once you've added mppx, test with:
```bash
# Create a testnet account (one-time)
npx mppx account create
npx mppx account view

# Make paid requests
npx mppx "http://localhost:3001/api/content" --network testnet -iv
npx mppx "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" --network testnet -iv
```
