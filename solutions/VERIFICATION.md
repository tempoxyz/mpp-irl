# Verification

Verified on July 31, 2026 against repository commit `f2811bb`.

## Results

| Solution | Tests | Build | Live unpaid | Live paid |
| --- | ---: | --- | --- | --- |
| Content gate | 3/3 | Pass | `402` | Pass: `200` Markdown + receipt |
| Starlink tracker | 13/13 | Pass | `402`; N2YO not called | Pass: `200`, Starlink JSON + receipt |
| Local LLM | 7/7 | Pass | `402`; models/discovery `200` | Pass: Chat + Responses, reused session |

All 23 automated tests passed. All three production builds passed. All three
solutions completed paid testnet flows through their real clients and upstream
services. The opened verification session was closed.

## Coverage

- One-time charge challenge and post-authorization content behavior.
- Starlink parameter validation, missing key, provider success/non-JSON
  failure, and proof that N2YO is not called before payment.
- OpenAI proxy request forwarding, streaming byte preservation, upstream
  errors, free model listing, paid route challenges, and generated discovery.

See `logs/` for captured summaries. Secrets and payment credentials are
intentionally omitted.
