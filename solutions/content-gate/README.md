# Content gate solution

Protects `GET /api/content` with a one-time `tempo.charge` payment of `0.01`
pathUSD on Tempo testnet. The upstream Markdown is fetched only after payment
verification and returned unchanged.

## Configure

```bash
cp solutions/content-gate/.env.example solutions/content-gate/.env.local
pnpm dlx mppx@0.8.15 account view --account seller --network testnet
```

Put the seller address in `RECIPIENT_ADDRESS`. The checked-in public workshop
secret works locally without configuration; replace it for any deployment.

The Next.js solution directly includes `@modelcontextprotocol/sdk`, the peer
needed by the `mppx` server bundle.

## Run and verify

```bash
pnpm --filter content-gate-solution dev
curl -i http://localhost:3001/api/content
pnpm dlx mppx@0.8.15 http://localhost:3001/api/content \
  --account buyer --network testnet -vv
pnpm --filter content-gate-solution test
pnpm --filter content-gate-solution build
```

The unsigned request returns `402`. The paid request returns `200`, Markdown,
and a `Payment-Receipt` header.
