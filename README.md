# mpp-irl

We've prepared two apps to showcase what you can build with Machine Payments Protocol (MPP):
- Pay-per-call API: monetize an API without managing API keys. To demonstrate, we'll monetize the [n2yo API](https://www.n2yo.com/api/) for satellite positions.
- Pay-walled content: charge a fee for premium content. In this case the newest [MPP blog post](https://mpp.dev/blog/mppx-agent-runtimes)!


These apps are currently open, your job will be to payment-gate them with MPP!

## Setup

```bash
# Setup
pnpm install
# Run
pnpm dev
# Test - get content
curl http://localhost:3001/api/content
# Test - call the API (needs an API key)
curl "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10"
```


## Path 1: Add payment-per-call to the API with MPP

1. Create `apps/satellite-api/.env.local` with your [n2yo API key](https://www.n2yo.com/api/):

```
N2YO_API_KEY=your_api_key_here
```

2. Paste this into your coding agent to payment-gate each API call:

```bash
Use https://mpp.dev/guides/one-time-payments.md as reference. Add mppx to my satellite-api app to payment-gate the positions endpoint and charge $0.01 per request using the Tempo payment method with PathUSD. When payment is verified, execute the endpoint.
```



## Path 2: Paywall the blog post with MPP

Paste this into your coding agent to payment-gate the blog post:

```bash
Use https://mpp.dev/guides/one-time-payments.md as reference. Add mppx to my content-gate app to payment-gate the content endpoint and charge $0.01 per request using the Tempo payment method with PathUSD. When payment is verified, return the blog post content at https://mpp.dev/blog/mppx-agent-runtimes.md
```


## Test your work

Once you've added mppx, test with:

```bash
# Test
curl http://localhost:3001/api/content
curl "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" | jq

# Create a Tempo testnet wallet (one-time)
npx mppx account create
npx mppx account view
npx mppx account fund

# Make paid requests
npx mppx "http://localhost:3001/api/content" --network testnet
npx mppx "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" --network testnet | jq
```
