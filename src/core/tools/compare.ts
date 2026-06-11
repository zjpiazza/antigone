import type { CompareOptions, CompareResult } from "../types.js";
import { loadImage } from "../image.js";
import { resolveConfig } from "../config.js";
import { createProvider } from "../providers/index.js";

const COMPARE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    differences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: { type: "string" },
          severity: { type: "string", enum: ["minor", "major", "critical"] },
          location: { type: "string" },
        },
        required: ["description", "severity", "location"],
      },
    },
    match_score: { type: "number" },
  },
  required: ["summary", "differences", "match_score"],
};

const DEFAULT_PROMPT =
  "Compare these images and describe the differences between them. For each difference, note its severity (minor, major, or critical) and location in the image. Provide an overall match score from 0.0 (completely different) to 1.0 (identical).";

export async function compare(
  imagePaths: string[],
  options: CompareOptions = {},
): Promise<CompareResult> {
  if (imagePaths.length < 2) {
    throw new Error("At least 2 images are required for comparison");
  }

  const config = await resolveConfig(options);
  const provider = createProvider(config.provider, {
    apiKey: config.apiKey,
    model: config.model,
  });

  const images = await Promise.all(imagePaths.map(loadImage));
  const prompt = options.prompt ?? DEFAULT_PROMPT;

  const response = await provider.analyze({
    images,
    prompt,
    jsonSchema: COMPARE_SCHEMA,
  });

  return JSON.parse(response) as CompareResult;
}
