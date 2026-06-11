import type { OcrOptions, OcrResult } from "../types.js";
import { loadImage } from "../image.js";
import { resolveConfig } from "../config.js";
import { createProvider } from "../providers/index.js";

const OCR_SCHEMA = {
  type: "object",
  properties: {
    text: { type: "string" },
    blocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["text", "confidence"],
      },
    },
  },
  required: ["text", "blocks"],
};

const DEFAULT_PROMPT =
  "Extract all visible text from this image. Return the full concatenated text and an array of text blocks with confidence scores (0.0 to 1.0) for each distinct piece of text found.";

export async function ocr(
  imagePath: string,
  options: OcrOptions = {},
): Promise<OcrResult> {
  const config = await resolveConfig(options);
  const provider = createProvider(config.provider, {
    apiKey: config.apiKey,
    model: config.model,
  });

  const image = await loadImage(imagePath);

  const response = await provider.analyze({
    images: [image],
    prompt: DEFAULT_PROMPT,
    jsonSchema: OCR_SCHEMA,
  });

  return JSON.parse(response) as OcrResult;
}
