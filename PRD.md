# Antigone - Product Requirements Document

## Problem Statement

Many powerful AI models (DeepSeek, big-pickle, MiMo, MiniMax, etc.) are text-only — they cannot process image input. When used in agentic workflows that involve visual tasks (mobile testing, UI comparison, screenshot analysis), these models hit a hard wall: they simply cannot see.

Existing solutions are fragmented, poorly maintained, and limited:
- Most only support a single vision provider
- None support multi-image input for comparison workflows
- They're protocol-specific (MCP-only) with no CLI or library interface
- No structured output — just unformatted prose descriptions

## Solution

Antigone is a vision bridge that gives sight to text-only models. Named after the Greek figure who guided her blind father Oedipus, Antigone routes images through multimodal models (Gemini, Claude, GPT-4V, etc.) and returns structured text descriptions that any model can understand.

### Key Differentiators

1. **Multi-image support** — Send multiple images in a single request for comparison workflows
2. **Provider-agnostic** — Swap between Gemini, OpenRouter, Anthropic, OpenAI via config
3. **Three consumption modes** — Library, CLI, and MCP server from a single codebase
4. **Structured output** — JSON responses with typed fields, not just prose
5. **UI/design-aware** — Purpose-built tools for visual QA and design comparison

## Architecture

```
antigone/
├── src/
│   ├── core/                  # Provider-agnostic vision logic
│   │   ├── providers/         # Vision provider implementations
│   │   │   ├── gemini.ts      # Google Gemini (free tier default)
│   │   │   ├── openrouter.ts  # OpenRouter (any model)
│   │   │   ├── anthropic.ts   # Anthropic Claude
│   │   │   └── openai.ts      # OpenAI GPT-4V
│   │   ├── tools/             # Tool implementations
│   │   │   ├── describe.ts    # Single image description
│   │   │   ├── compare.ts     # Multi-image comparison
│   │   │   ├── ocr.ts         # Text extraction
│   │   │   └── check-ui.ts    # UI evaluation against criteria
│   │   ├── image.ts           # Image preprocessing (resize, normalize, encode)
│   │   └── index.ts           # Core API exports
│   ├── cli/                   # CLI interface
│   │   └── index.ts           # CLI entry point
│   ├── mcp/                   # MCP server adapter
│   │   └── index.ts           # MCP server entry point
│   └── index.ts               # Library exports
├── skill/                     # Agent skill definition
│   └── SKILL.md               # Skill instructions for agents
├── images/
│   └── banner.png
├── PRD.md
├── README.md
├── package.json
├── tsconfig.json
└── LICENSE
```

### Core Design Principle

The core library knows nothing about transport. It exports pure async functions that accept image paths/buffers and return typed results. The CLI, MCP server, and skill are thin adapters over the same core.

## Tools

### `describe`

Describe a single image in detail.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | `string` | Yes | File path, URL, or base64 data |
| `prompt` | `string` | No | Custom prompt to guide the description |

**Output:**
```json
{
  "description": "A login screen with email and password fields...",
  "dimensions": { "width": 1170, "height": 2532 },
  "format": "png"
}
```

### `compare`

Compare two or more images and return structured differences.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | `string[]` | Yes | Array of file paths, URLs, or base64 data |
| `prompt` | `string` | No | Custom prompt to guide the comparison |

**Output:**
```json
{
  "summary": "The device screenshot closely matches the design with 3 notable differences.",
  "differences": [
    {
      "description": "Button border radius is 4px on device vs 8px in design",
      "severity": "minor",
      "location": "bottom-right, primary CTA button"
    },
    {
      "description": "Font weight appears bolder on device for the header text",
      "severity": "minor",
      "location": "top-center, page title"
    },
    {
      "description": "Missing bottom padding below the form container",
      "severity": "major",
      "location": "center, form area"
    }
  ],
  "match_score": 0.85
}
```

### `ocr`

Extract all visible text from an image.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | `string` | Yes | File path, URL, or base64 data |

**Output:**
```json
{
  "text": "Welcome back\nEmail\nPassword\nSign In\nForgot password?",
  "blocks": [
    { "text": "Welcome back", "confidence": 0.98 },
    { "text": "Email", "confidence": 0.99 },
    { "text": "Password", "confidence": 0.99 },
    { "text": "Sign In", "confidence": 0.97 },
    { "text": "Forgot password?", "confidence": 0.95 }
  ]
}
```

### `check-ui`

Evaluate a UI screenshot against design criteria or platform guidelines.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | `string` | Yes | File path, URL, or base64 data |
| `requirements` | `string` | No | Specific requirements to check against |
| `platform` | `string` | No | `ios` or `android` for platform-specific checks |

**Output:**
```json
{
  "score": 0.72,
  "issues": [
    {
      "description": "Touch target for 'Forgot password?' link appears smaller than 44pt minimum",
      "severity": "major",
      "guideline": "iOS HIG - Minimum touch target size"
    },
    {
      "description": "Insufficient contrast ratio on placeholder text",
      "severity": "major",
      "guideline": "WCAG 2.1 AA - Contrast ratio 4.5:1"
    }
  ],
  "passes": [
    "Navigation hierarchy is clear",
    "Primary action button is prominent and well-positioned",
    "Form labels are visible and correctly associated"
  ]
}
```

## Providers

### Gemini (Default)

- **Model:** `gemini-2.5-flash`
- **Cost:** Free tier — 1,500 requests/day via Google AI Studio
- **Multi-image:** Yes (native support)
- **API Key:** `GOOGLE_API_KEY` or `GEMINI_API_KEY`

### OpenRouter

- **Models:** Any vision model (Claude 3.5 Sonnet, GPT-4V, Gemini Pro, etc.)
- **Cost:** Pay-per-use via OpenRouter
- **Multi-image:** Depends on underlying model
- **API Key:** `OPENROUTER_API_KEY`

### Anthropic

- **Model:** `claude-sonnet-4-20250514`
- **Cost:** Pay-per-use
- **Multi-image:** Yes (native support)
- **API Key:** `ANTHROPIC_API_KEY`

### OpenAI

- **Model:** `gpt-4o`
- **Cost:** Pay-per-use
- **Multi-image:** Yes (native support)
- **API Key:** `OPENAI_API_KEY`

## Consumption Modes

### 1. CLI

```bash
# Describe an image
npx antigone describe screenshot.png

# Compare two images
npx antigone compare design.png screenshot.png

# Extract text
npx antigone ocr receipt.png

# Check UI
npx antigone check-ui app-screen.png --platform ios

# Use a specific provider
npx antigone describe photo.png --provider openrouter --model claude-sonnet-4-20250514
```

### 2. Library

```typescript
import { describe, compare, ocr, checkUI } from 'antigone'

const result = await describe('screenshot.png')
const diff = await compare(['design.png', 'screenshot.png'])
const text = await ocr('receipt.png')
const audit = await checkUI('app-screen.png', { platform: 'ios' })
```

### 3. MCP Server

```bash
npx antigone serve
```

```json
{
  "mcpServers": {
    "antigone": {
      "command": "npx",
      "args": ["antigone", "serve"],
      "env": {
        "GEMINI_API_KEY": "your-key"
      }
    }
  }
}
```

### 4. Agent Skill

The `skill/SKILL.md` file provides instructions for any agent framework to use Antigone via CLI. No protocol overhead — just shell commands that return text.

## Configuration

Configuration is resolved in this order:

1. CLI flags (`--provider`, `--model`)
2. Environment variables (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, etc.)
3. Config file (`~/.config/antigone/config.json`)
4. Defaults (Gemini free tier)

### Config File Schema

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "maxImageSize": 10485760,
  "outputFormat": "json",
  "providers": {
    "gemini": {
      "apiKey": "...",
      "model": "gemini-2.5-flash"
    },
    "openrouter": {
      "apiKey": "...",
      "model": "google/gemini-2.0-flash-exp:free"
    },
    "anthropic": {
      "apiKey": "...",
      "model": "claude-sonnet-4-20250514"
    },
    "openai": {
      "apiKey": "...",
      "model": "gpt-4o"
    }
  }
}
```

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | TypeScript | Ecosystem alignment with MCP, npm distribution, type safety |
| Runtime | Node.js 18+ | Broad compatibility, native fetch |
| Package manager | npm | Maximum accessibility for npx usage |
| Image handling | Sharp | Fast, well-maintained, handles resize/format conversion |
| MCP SDK | `@modelcontextprotocol/sdk` | Official MCP TypeScript SDK |
| CLI framework | `commander` | Lightweight, standard |
| Build | `tsup` | Fast, zero-config TypeScript bundler |

## Milestones

### MVP

- [x] Core `describe` and `compare` tools
- [x] Gemini provider (free tier)
- [x] CLI interface
- [x] MCP server adapter
- [x] README and documentation

### Multi-Provider

- [ ] OpenRouter provider
- [ ] Anthropic provider
- [ ] OpenAI provider
- [ ] Provider auto-detection from environment
- [x] Config file support

### Enhanced Tools

- [x] `ocr` tool
- [x] `check-ui` tool with platform guidelines
- [x] Structured JSON output for all tools
- [x] Image preprocessing pipeline (resize, normalize)

### Skill & Distribution

- [ ] Agent skill definition (`SKILL.md`)
- [ ] npm publish
- [x] CI/CD pipeline
- [ ] Integration tests with real providers

### Stable Release

- [ ] Comprehensive test suite
- [ ] Full documentation
- [ ] Provider fallback chains
- [ ] Caching layer for repeated analysis
