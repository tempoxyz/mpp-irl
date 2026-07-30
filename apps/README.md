# Projects

Every directory is a standalone workshop project. Run commands from the repository root unless its README says otherwise.

| Project | Choose it when | External prerequisite |
| --- | --- | --- |
| [`content-gate`](content-gate) | You want the shortest path to a paid request | None |
| [`satellite-api`](satellite-api) | You want to monetize third-party data | N2YO API key |
| [`local-llm`](local-llm) | You want streaming, sessions, and local inference | Ollama and an 88 MB model |

## Shared MPP flow

After adding MPP, create and fund a testnet buyer:

```bash
pnpm dlx mppx@0.8.15 account create --account buyer --network testnet
pnpm dlx mppx@0.8.15 account fund --account buyer --network testnet
pnpm dlx mppx@0.8.15 account view --account buyer
```

One-time payment projects use a recipient address and `tempo.charge`. The local model uses a server signing account and `tempo.session`.

## Extension prompts

- Content: replace the Markdown URL with a PDF, image, dataset, or private file.
- Data: replace N2YO with flight, market, scientific, or proprietary data.
- Model: add another local model, price models differently, or build a model router.
