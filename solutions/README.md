# MPP IRL solutions

Completed versions of every workshop project:

| Solution | Payment | Verification |
| --- | --- | --- |
| `content-gate` | `0.01` pathUSD one-time charge | Automated + live testnet payment |
| `starlink-tracker-api` | `0.01` pathUSD one-time charge | Automated + live N2YO testnet payment |
| `local-llm` | `0.001` pathUSD per completion session | Automated + live Chat/Responses payments |

Install and run all automated checks from the repository root:

```bash
pnpm install
pnpm --filter './solutions/**' test
RECIPIENT_ADDRESS=0xYourTempoAddressHere \
pnpm --filter './solutions/**' build
```

The public workshop secret is a built-in fallback and is mirrored in each
`.env.example`. Override `MPP_SECRET_KEY` for any non-workshop deployment.

See `VERIFICATION.md` for results, `FEEDBACK.md` for limitations and suggested
improvements, and `logs/` for captured test output.
