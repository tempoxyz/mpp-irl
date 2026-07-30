# MPP IRL

Three small services for learning how to sell content, data, and local model inference with [Machine Payments Protocol](https://mpp.dev).

| Project | Port | Starting point |
| --- | ---: | --- |
| [`content-gate`](apps/content-gate) | 3001 | An open Markdown document |
| [`satellite-api`](apps/satellite-api) | 3002 | An open satellite-position API |
| [`local-llm`](apps/local-llm) | 3003 | An OpenAI-compatible local SmolLM2 server |

Each project starts without MPP. Pick one, confirm its open endpoint works, then follow its README to add a payment gate.

## Setup

Requirements:

- Node.js 22 or newer
- pnpm 10
- The project-specific prerequisite listed in the app README

```bash
pnpm install
pnpm dev
```

See [`apps/README.md`](apps/README.md) to choose a project.

## Workshop target

The goal is one paid request:

```text
request -> 402 challenge -> payment credential -> response + receipt
```

Use `pnpm dlx mppx@0.8.15` for the documented commands so every attendee runs the same CLI version.
