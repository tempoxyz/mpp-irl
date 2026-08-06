<br>
<br>

<p align="center">
  <a href="https://mpp.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://mpp.dev/lockup-light.svg">
      <img alt="Machine Payments Protocol" src="https://mpp.dev/lockup-dark.svg" width="360">
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

### Docker

The workshop image includes Node, pnpm, and a preloaded dependency store. The
Compose setup mounts this checkout so source and package changes remain
editable on the host.

Preflight the image before the workshop:

```bash
docker version
docker compose version
docker pull ghcr.io/tempoxyz/mpp-irl:workshop
```

Start all three projects:

```bash
docker compose up
```

Compose exposes ports 3001–3003 and keeps pnpm dependencies in named volumes.
It routes `local-llm` to Ollama running on the host. If you choose that project,
install its prerequisite before starting Compose:

```bash
ollama pull smollm2:135m-instruct-q2_K
curl -fsS http://127.0.0.1:11434/api/tags
```

### Native

Requires Node.js 22, pnpm 10, and any prerequisite listed by the project.

```bash
pnpm install
pnpm dev
```

## Available projects

| Project | Port | Starting point |
| --- | ---: | --- |
| [`content-gate`](apps/content-gate) | 3001 | The Claude Opus 4.5 Soul document as Markdown |
| [`starlink-tracker-api`](apps/starlink-tracker-api) | 3002 | Nearby Starlink satellites from N2YO |
| [`local-llm`](apps/local-llm) | 3003 | An OpenAI-compatible local SmolLM2 server |

Each project README covers its prerequisites, payment shape, and extension
ideas.

## Recipient accounts

Create a dedicated Tempo testnet recipient for each payment demo.

```bash
pnpm dlx mppx@0.8.15 account create \
  --account workshop-recipient \
  --network testnet
```

Put the printed address in the project's `.env.local` as
`RECIPIENT_ADDRESS`. Never commit a production private key or secret.

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

Build the workshop image locally when changing its dependencies or startup
behavior:

```bash
docker compose build
docker compose up
```

The container workflow builds pull requests and publishes `linux/amd64` and
`linux/arm64` images from `main` and `v*` tags. Published images receive an
immutable `sha-*` tag; `main` also updates `workshop`.

After the first workflow publish, a package administrator must make the GHCR
package public so attendees can pull it without authenticating.

## Learn more

- [Machine payments on Tempo](https://tempo.xyz/developers/docs/guide/machine-payments)
- [MPP documentation](https://mpp.dev)
- [Tempo documentation](https://tempo.xyz/developers)
