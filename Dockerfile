FROM node:22.17.1-bookworm-slim

LABEL org.opencontainers.image.source="https://github.com/tempoxyz/mpp-irl"
LABEL org.opencontainers.image.description="Editable development environment for the MPP IRL workshop"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
  && corepack prepare pnpm@10.33.0 --activate \
  && mkdir -p /pnpm/store /workspace \
  && chown -R node:node /pnpm /workspace

USER node
WORKDIR /workspace

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY --chown=node:node apps/content-gate/package.json apps/content-gate/package.json
COPY --chown=node:node apps/local-llm/package.json apps/local-llm/package.json
COPY --chown=node:node apps/starlink-tracker-api/package.json apps/starlink-tracker-api/package.json

RUN pnpm fetch --frozen-lockfile

COPY --chown=node:node . .

RUN pnpm install --offline --frozen-lockfile

EXPOSE 3001 3002 3003

CMD ["sh", "-c", "pnpm install --offline --frozen-lockfile && pnpm dev"]
