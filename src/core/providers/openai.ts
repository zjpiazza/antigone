import type { AnalyzeRequest, Provider, ProviderOptions } from "../types.js";

interface ContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface ChatResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message: string };
}

export function createOpenAiCompatibleProvider(
  name: string,
  apiBase: string,
  options: ProviderOptions,
  extraHeaders?: Record<string, string>,
): Provider {
  const { apiKey, model } = options;

  return {
    name,

    async analyze(request: AnalyzeRequest): Promise<string> {
      const prompt = request.jsonSchema
        ? `${request.prompt}\n\nRespond in JSON format.`
        : request.prompt;
      const content: ContentPart[] = [{ type: "text", text: prompt }];

      for (const image of request.images) {
        content.push({
          type: "image_url",
          image_url: { url: `data:${image.mimeType};base64,${image.base64}` },
        });
      }

      const body: Record<string, unknown> = {
        model,
        messages: [{ role: "user", content }],
        response_format: { type: "json_object" },
      };

      const response = await fetch(`${apiBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...extraHeaders,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${name} API error (${response.status}): ${error}`);
      }

      const data = (await response.json()) as ChatResponse;

      if (data.error) {
        throw new Error(`${name} API error: ${data.error.message}`);
      }

      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`No response from ${name} API`);
      }

      return text;
    },
  };
}

export function createOpenAiProvider(options: ProviderOptions): Provider {
  return createOpenAiCompatibleProvider(
    "openai",
    "https://api.openai.com/v1",
    options,
  );
}
