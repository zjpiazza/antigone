import type { DescribeOptions, DescribeResult } from "../types.js";
import { loadImage } from "../image.js";
import { resolveConfig } from "../config.js";
import { createProvider } from "../providers/index.js";

const DESCRIBE_SCHEMA = {
  type: "object",
  properties: {
    description: { type: "string" },
    dimensions: {
      type: "object",
      properties: {
        width: { type: "number" },
        height: { type: "number" },
      },
      required: ["width", "height"],
    },
    format: { type: "string" },
  },
  required: ["description", "dimensions", "format"],
};

const DEFAULT_PROMPT =
  "Describe this image in detail. Include what you see, the layout, colors, text, and any notable elements. Return the image dimensions and format from the metadata provided.";

export async function describe(
  imagePath: string,
  options: DescribeOptions = {},
): Promise<DescribeResult> {
  const config = await resolveConfig(options);
  const provider = createProvider(config.provider, {
    apiKey: config.apiKey,
    model: config.model,
  });

  const image = await loadImage(imagePath);
  const prompt = options.prompt
    ? `${options.prompt}\n\nImage dimensions: ${image.width}x${image.height}, format: ${image.format}`
    : `${DEFAULT_PROMPT}\n\nImage dimensions: ${image.width}x${image.height}, format: ${image.format}`;

  const response = await provider.analyze({
    images: [image],
    prompt,
    jsonSchema: DESCRIBE_SCHEMA,
  });

  const result = JSON.parse(response) as DescribeResult;
  result.dimensions = { width: image.width, height: image.height };
  result.format = image.format;

  return result;
}
