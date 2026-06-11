import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import { describe } from "../core/tools/describe.js";
import { compare } from "../core/tools/compare.js";
import { ocr } from "../core/tools/ocr.js";
import { checkUi } from "../core/tools/check-ui.js";

const server = new McpServer({
  name: "antigone",
  version: "0.0.1",
});

server.registerTool(
  "describe",
  {
    description: "Describe a single image in detail. Returns structured JSON with description, dimensions, and format.",
    inputSchema: z.object({
      image: z.string().describe("File path, URL, or base64 data URI of the image"),
      prompt: z.string().optional().describe("Custom prompt to guide the description"),
      provider: z.string().optional().describe("Vision provider (gemini, openrouter, anthropic, openai)"),
      model: z.string().optional().describe("Model to use"),
    }),
  },
  async ({ image, prompt, provider, model }) => {
    const result = await describe(image, { prompt, provider, model });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.registerTool(
  "compare",
  {
    description: "Compare two or more images and return structured differences with severity and location.",
    inputSchema: z.object({
      images: z.array(z.string()).min(2).describe("Array of file paths, URLs, or base64 data URIs"),
      prompt: z.string().optional().describe("Custom prompt to guide the comparison"),
      provider: z.string().optional().describe("Vision provider (gemini, openrouter, anthropic, openai)"),
      model: z.string().optional().describe("Model to use"),
    }),
  },
  async ({ images, prompt, provider, model }) => {
    const result = await compare(images, { prompt, provider, model });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.registerTool(
  "ocr",
  {
    description: "Extract all visible text from an image. Returns full text and individual blocks with confidence scores.",
    inputSchema: z.object({
      image: z.string().describe("File path, URL, or base64 data URI of the image"),
      provider: z.string().optional().describe("Vision provider (gemini, openrouter, anthropic, openai)"),
      model: z.string().optional().describe("Model to use"),
    }),
  },
  async ({ image, provider, model }) => {
    const result = await ocr(image, { provider, model });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.registerTool(
  "check-ui",
  {
    description: "Evaluate a UI screenshot against design guidelines. Returns a score, issues, and passes.",
    inputSchema: z.object({
      image: z.string().describe("File path, URL, or base64 data URI of the image"),
      requirements: z.string().optional().describe("Specific requirements to check against"),
      platform: z.enum(["ios", "android"]).optional().describe("Platform guidelines to check against"),
      provider: z.string().optional().describe("Vision provider (gemini, openrouter, anthropic, openai)"),
      model: z.string().optional().describe("Model to use"),
    }),
  },
  async ({ image, requirements, platform, provider, model }) => {
    const result = await checkUi(image, { requirements, platform, provider, model });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Antigone MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
