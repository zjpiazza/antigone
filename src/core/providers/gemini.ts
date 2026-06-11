import type { AnalyzeRequest, Provider, ProviderOptions } from "../types.js";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message: string; code: number };
}

export function createGeminiProvider(options: ProviderOptions): Provider {
  const { apiKey, model } = options;

  return {
    name: "gemini",

    async analyze(request: AnalyzeRequest): Promise<string> {
      const parts: GeminiPart[] = [{ text: request.prompt }];

      for (const image of request.images) {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.base64,
          },
        });
      }

      const body: Record<string, unknown> = {
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      };

      if (request.jsonSchema) {
        (body.generationConfig as Record<string, unknown>).responseSchema =
          request.jsonSchema;
      }

      const url = `${API_BASE}/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${error}`);
      }

      const data = (await response.json()) as GeminiResponse;

      if (data.error) {
        throw new Error(`Gemini API error (${data.error.code}): ${data.error.message}`);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No response from Gemini API");
      }

      return text;
    },
  };
}
