# AGENTS.md

## Project

Antigone is a vision bridge for text-only AI models. It routes images through multimodal providers (Gemini, Claude, GPT-4V, OpenRouter) and returns structured JSON. Three consumption modes from one codebase: library, CLI (`npx antigone`), and MCP server.

**Status:** Early implementation. `PRD.md` is the source of truth for architecture and API design.

## Commands

```bash
npm run build        # tsup
npm run dev          # tsup --watch
npm run lint         # oxlint
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npm run test:watch   # vitest
npm run serve        # node dist/mcp/index.js (MCP server)
```

Verification order: `lint` -> `typecheck` -> `test`

## Toolchain

- **ES modules** (`"type": "module"` in package.json) — use `import`/`export`, not `require`
- **tsup** for bundling — config in `tsup.config.ts`
- **oxlint** for linting (Rust-based, not ESLint)
- **vitest** for testing (not Jest) — config in `vitest.config.ts`
- **TypeScript 6** — `tsconfig.json` uses `"ignoreDeprecations": "6.0"` to suppress `baseUrl` deprecation from tsup's DTS plugin
- **Node.js >=18** required (native `fetch`)
- **npm** as package manager (not pnpm/yarn) — needed for `npx` distribution

## Git Hooks & Commits

- **prek** (Rust-based pre-commit framework, `@j178/prek`) — config in `prek.toml`
- Hooks auto-install via `npm install` (`prepare` script)
- **Pre-commit hooks:** trailing whitespace, EOF fixer, JSON check, private key detection, no-commit-to-main, oxlint, typecheck
- **Commit-msg hook:** commitlint enforces [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)
- Commits to `main` are blocked by prek — work on feature branches

## CI/CD

- **CI** (`.github/workflows/ci.yml`): runs lint, typecheck, test on push/PR to `main`
- **Release** (`.github/workflows/release.yml`): semantic-release on push to `main`
- **semantic-release** (`.releaserc.json`): auto-versions from conventional commits, generates CHANGELOG.md, publishes to npm, creates GitHub releases
- Requires `NPM_TOKEN` secret for npm publish; `GITHUB_TOKEN` is automatic

## Architecture

```
src/core/           # Transport-agnostic vision logic (pure async functions)
src/core/providers/ # gemini.ts, openrouter.ts, anthropic.ts, openai.ts
src/core/tools/     # describe.ts, compare.ts, ocr.ts, check-ui.ts
src/core/image.ts   # Image preprocessing (sharp)
src/cli/index.ts    # CLI adapter (commander)
src/mcp/index.ts    # MCP server adapter (@modelcontextprotocol/sdk)
src/index.ts        # Library exports
skill/SKILL.md      # Agent skill definition for CLI-based integration
```

**Core design rule:** `src/core/` must not import from `cli/`, `mcp/`, or any transport layer. CLI, MCP, and skill are thin adapters over the same core functions.

## Providers

| Provider | Default Model | Env Var | Notes |
|----------|--------------|---------|-------|
| Gemini (default) | `gemini-2.5-flash` | `GOOGLE_API_KEY` or `GEMINI_API_KEY` | Free tier, 1500 req/day |
| OpenRouter | any vision model | `OPENROUTER_API_KEY` | |
| Anthropic | `claude-sonnet-4-20250514` | `ANTHROPIC_API_KEY` | |
| OpenAI | `gpt-4o` | `OPENAI_API_KEY` | |

Config resolution: CLI flags > env vars > `~/.config/antigone/config.json` > defaults.

## Key Dependencies

Runtime deps (not yet installed — add to `package.json` when implementing):
- `sharp` — image resize/format conversion
- `commander` — CLI framework
- `@modelcontextprotocol/sdk` — MCP server

## Conventions

- All tool functions return typed JSON (not prose). See `PRD.md` for output schemas.
- CLI binary is `antigone` (mapped in `package.json` `bin` field) pointing to `dist/cli/index.js`.
- Published files: `dist/` and `skill/` only.
- Use conventional commit messages: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`.
