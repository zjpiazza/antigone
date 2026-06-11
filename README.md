<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/zjpiazza/antigone">
    <img src="images/banner.png" alt="Antigone" width="100%">
  </a>

  <h3 align="center">Antigone</h3>

  <p align="center">
    Vision bridge for text-only AI models. Like Antigone guiding blind Oedipus — gives sight to models that can't see.
    <br />
    <a href="https://github.com/zjpiazza/antigone"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/zjpiazza/antigone">View Demo</a>
    &middot;
    <a href="https://github.com/zjpiazza/antigone/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/zjpiazza/antigone/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Many powerful AI models — DeepSeek, big-pickle, MiMo, MiniMax — are **text-only**. They can write code, reason through problems, and orchestrate complex workflows, but they can't see. When your agentic workflow involves screenshots, UI comparisons, or visual QA, these models hit a wall.

**Antigone** bridges that gap. It routes images through multimodal models (Gemini, Claude, GPT-4V) and returns structured text that any model can understand.

**Why Antigone?**

* **Multi-image comparison** — Send a Figma export and a device screenshot in a single call, get back structured diffs
* **Provider-agnostic** — Gemini (free), OpenRouter, Anthropic, or OpenAI — swap via config
* **Three interfaces** — Use as a CLI, a library, or an MCP server
* **Structured output** — JSON with typed fields, not just prose

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![TypeScript][TypeScript]][TypeScript-url]
* [![Node.js][Node.js]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* Node.js 18+
* A vision provider API key (Gemini free tier is the default)

### Installation

1. Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/)

2. Install globally or use via npx
   ```sh
   npm install -g antigone
   ```

3. Set your API key
   ```sh
   export GEMINI_API_KEY=your-key-here
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### CLI

```bash
# Describe an image
npx antigone describe screenshot.png

# Compare two images (e.g., Figma design vs device screenshot)
npx antigone compare design.png screenshot.png

# Extract text from an image
npx antigone ocr receipt.png

# Check UI against platform guidelines
npx antigone check-ui app-screen.png --platform ios
```

### Library

```typescript
import { describe, compare, ocr, checkUI } from 'antigone'

const description = await describe('screenshot.png')
const diff = await compare(['design.png', 'device.png'])
const text = await ocr('document.png')
const audit = await checkUI('screen.png', { platform: 'ios' })
```

### MCP Server

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

### Agent Skill

Antigone ships with a `skill/SKILL.md` that any agent framework can use. No protocol overhead — just CLI calls that return text.

_For more examples, please refer to the [Documentation](https://github.com/zjpiazza/antigone)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Core `describe` and `compare` tools with Gemini provider
- [x] CLI interface
- [x] MCP server adapter
- [x] `ocr` tool
- [x] `check-ui` tool with platform guidelines
- [ ] Agent skill definition
- [ ] Multi-provider support (OpenRouter, Anthropic, OpenAI)
- [ ] Provider fallback chains
- [ ] Caching layer

See the [open issues](https://github.com/zjpiazza/antigone/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Project Link: [https://github.com/zjpiazza/antigone](https://github.com/zjpiazza/antigone)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Mobile MCP](https://github.com/mobile-next/mobile-mcp)
* [Model Context Protocol](https://modelcontextprotocol.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/zjpiazza/antigone.svg?style=for-the-badge
[contributors-url]: https://github.com/zjpiazza/antigone/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/zjpiazza/antigone.svg?style=for-the-badge
[forks-url]: https://github.com/zjpiazza/antigone/network/members
[stars-shield]: https://img.shields.io/github/stars/zjpiazza/antigone.svg?style=for-the-badge
[stars-url]: https://github.com/zjpiazza/antigone/stargazers
[issues-shield]: https://img.shields.io/github/issues/zjpiazza/antigone.svg?style=for-the-badge
[issues-url]: https://github.com/zjpiazza/antigone/issues
[license-shield]: https://img.shields.io/github/license/zjpiazza/antigone.svg?style=for-the-badge
[license-url]: https://github.com/zjpiazza/antigone/blob/main/LICENSE
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
