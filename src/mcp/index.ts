import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import { describe } from "../core/tools/describe.js";
import { compare } from "../core/tools/compare.js";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Antigone MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
