# Antigone — Vision Skill

Use this skill when you need to see images, compare screenshots, extract text from images, or evaluate UI quality. Antigone routes images through a vision model and returns structured JSON.

## Prerequisites

One of: `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY` must be set.

## Commands

### Describe an image

```bash
npx antigone describe <image>
npx antigone describe screenshot.png
npx antigone describe https://example.com/photo.jpg
npx antigone describe screenshot.png --prompt "Focus on the navigation bar"
```

Returns: `{ description, dimensions: { width, height }, format }`

### Compare images

```bash
npx antigone compare <image1> <image2> [image3...]
npx antigone compare design.png screenshot.png
npx antigone compare design.png screenshot.png --prompt "Focus on color differences"
```

Returns: `{ summary, differences: [{ description, severity, location }], match_score }`

### Extract text (OCR)

```bash
npx antigone ocr <image>
npx antigone ocr receipt.png
```

Returns: `{ text, blocks: [{ text, confidence }] }`

### Evaluate UI

```bash
npx antigone check-ui <image>
npx antigone check-ui app-screen.png --platform ios
npx antigone check-ui app-screen.png --platform android --requirements "Must have dark mode toggle"
```

Returns: `{ score, issues: [{ description, severity, guideline }], passes: [] }`

## Global Options

All commands accept:

- `-p, --provider <name>` — gemini (default), openrouter, anthropic, openai
- `-m, --model <name>` — override the default model
- `-k, --api-key <key>` — override the API key

## Tips

- All output is JSON. Parse it directly.
- Images can be file paths, URLs, or base64 data URIs.
- Large images are automatically resized (max 2048px on longest side).
- Use `--prompt` on describe/compare to focus the analysis on specific aspects.
- The default provider is Gemini with `gemini-2.5-flash` (free tier, 1500 req/day).
