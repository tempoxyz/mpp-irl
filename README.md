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

## Foundry development addresses

The one-time payment demos use Foundry/Anvil Account 1 as the default payment
recipient:

```text
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

Anvil derives 10 standard development accounts from its
[public test mnemonic](https://www.getfoundry.sh/anvil/index.html#default-accounts):

| Account | Address |
| ---: | --- |
| 0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` |
| 3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` |
| 4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` |
| 5 | `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc` |
| 6 | `0x976EA74026E726554dB657fA54763abd0C3a0aa9` |
| 7 | `0x14dC79964da2C08b23698B3D3cc7Ca32193d9955` |
| 8 | `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f` |
| 9 | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` |

These accounts and their private keys are publicly known. Use them only for
local development and public testnets; never send real funds to them.

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
