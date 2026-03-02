# GEMINI.md - Project Context: enchinito-api

This project is a simple API built as a Cloudflare Worker that provides text transformation services using the `@xmarcos/enchinito` library.

## Project Overview

*   **Purpose:** Provides a RESTful endpoint to transform text into "enchinito" style (replacing vowels with 'i').
*   **Technologies:**
    *   **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/)
    *   **Language:** TypeScript
    *   **Routing:** [itty-router](https://github.com/kwhitley/itty-router)
    *   **Core Logic:** [@xmarcos/enchinito](https://github.com/xmarcos/enchinito)
*   **Architecture:** A single entry point in `src/index.ts` handling routing and content negotiation (JSON, XML, and Plain Text).

## Building and Running

### Prerequisites
*   Node.js (>= 16)
*   npm
*   Docker (Optional for local dev)

### Commands
*   **Install Dependencies:** `npm install`
*   **Local Development (Native):** `npx wrangler dev` (Runs on `http://0.0.0.0:8787` by default)
*   **Local Development (Docker):** `docker compose up` (Runs on `http://localhost:8787`)
*   **Deploy (Manual):** `npx wrangler deploy`
*   **Tail Logs:** `npx wrangler tail`
*   **Commit (with wizard):** `npm run commit`

## Development Conventions

*   **Routing:** Uses `itty-router`. New endpoints should be added to the `Router` instance in `src/index.ts`.
*   **Content Negotiation:** The API respects the `Accept` header:
    *   `text/plain` -> returns plain text.
    *   `application/xml` -> returns XML.
    *   Default (`application/json`) -> returns JSON.
*   **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) are enforced via `husky` and `commitlint`.
*   **Releasing:** Automated via `semantic-release` on pushes to the `main` branch.
*   **Dependencies:** Managed in `package.json`. Cloudflare Workers specific configuration is in `wrangler.toml`.

## Key Files

*   `src/index.ts`: The main entry point containing all routing and response logic.
*   `wrangler.toml`: Cloudflare Workers configuration file.
*   `package.json`: Project metadata, dependencies, and scripts.
*   `.github/workflows/deploy.yml`: GitHub Actions workflow for CI/CD and automated releases.
*   `Dockerfile`: Configuration for Docker-based development.
*   `docker-compose.yml`: Orchestration for Docker-based development.
