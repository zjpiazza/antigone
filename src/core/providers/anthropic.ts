import type { AnalyzeRequest, Provider, ProviderOptions } from "../types.js";

const API_BASE = "https://api.anthropic.com/v1";

interface ContentBlock {
  type: "text" | "image";
  text?: string;
  source?: { type: "base64"; media_type: string; data: string };
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  error?: { type: string; message: string };
}

export function createAnthropicProvider(options: ProviderOptions): Provider {
  const { apiKey, model } = options;

  return {
    name: "anthropic",

    async analyze(request: AnalyzeRequest): Promise<string> {
      const content: ContentBlock[] = [];

      for (const image of request.images) {
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: image.mimeType,
            data: image.base64,
          },
        });
      }

      content.push({
        type: "text",
        text: request.prompt + "\n\nRespond with valid JSON only. No markdown, no explanation, just the JSON object.",
      });

      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          messages: [{ role: "user", content }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${error}`);
      }

      const data = (await response.json()) as AnthropicResponse;

      if (data.error) {
        throw new Error(`Anthropic API error (${data.error.type}): ${data.error.message}`);
      }

      const raw = data.content?.find((b) => b.type === "text")?.text;
      if (!raw) {
        throw new Error("No response from Anthropic API");
      }

      return raw.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    },
  };
}
