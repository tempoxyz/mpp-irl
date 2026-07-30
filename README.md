<br>
<br>

<p align="center">
  <a href="https://tempo.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tempoxyz/tempo/main/.github/assets/tempo-wordmark-white.svg">
      <img alt="Tempo wordmark" src="https://raw.githubusercontent.com/tempoxyz/tempo/main/.github/assets/tempo-wordmark-black.svg" width="360">
    </picture>
  </a>
</p>

<br>
<br>

# MPP IRL

Build your first paid HTTP service on [Tempo](https://tempo.xyz) with the
[Machine Payments Protocol](https://mpp.dev).

Each workshop project begins as a small, unpaid service. Pick one, confirm it
works locally, then add an MPP payment gate and make one paid request.

## Quick start

Requires Node.js 22 or newer, pnpm 10, and any prerequisite listed by the
project.

```bash
pnpm install
pnpm dev
```

## Projects

| Project | Port | Starting point |
| --- | ---: | --- |
| [`content-gate`](apps/content-gate) | 3001 | A Markdown article |
| [`satellite-api`](apps/satellite-api) | 3002 | An N2YO satellite-position API |
| [`local-llm`](apps/local-llm) | 3003 | An OpenAI-compatible local SmolLM2 server |

See [`apps/README.md`](apps/README.md) for prerequisites, payment shape, and
extension ideas.

## Workshop goal

Complete the MPP request flow:

```text
request -> 402 challenge -> payment credential -> response + receipt
```

Use `pnpm dlx mppx@0.8.15` for the documented commands so every attendee runs
the same CLI version.

## Development

```bash
pnpm dev
pnpm test
pnpm build
```

## Learn more

- [Machine payments on Tempo](https://tempo.xyz/developers/docs/guide/machine-payments)
- [MPP documentation](https://mpp.dev)
- [Tempo documentation](https://tempo.xyz/developers)
