import type { CheckUiOptions, CheckUiResult } from "../types.js";
import { loadImage } from "../image.js";
import { resolveConfig } from "../config.js";
import { createProvider } from "../providers/index.js";

const CHECK_UI_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number" },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: { type: "string" },
          severity: { type: "string", enum: ["minor", "major", "critical"] },
          guideline: { type: "string" },
        },
        required: ["description", "severity", "guideline"],
      },
    },
    passes: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["score", "issues", "passes"],
};

function buildPrompt(options: CheckUiOptions): string {
  const parts = [
    "Evaluate this UI screenshot for design quality and usability.",
    "Return a score from 0.0 (poor) to 1.0 (excellent), a list of issues found with severity (minor, major, critical) and the guideline violated, and a list of things done well.",
  ];

  if (options.platform) {
    parts.push(
      `Evaluate against ${options.platform === "ios" ? "Apple Human Interface Guidelines (HIG)" : "Material Design guidelines"}.`,
    );
  }

  if (options.requirements) {
    parts.push(`Additional requirements to check: ${options.requirements}`);
  }

  return parts.join(" ");
}

export async function checkUi(
  imagePath: string,
  options: CheckUiOptions = {},
): Promise<CheckUiResult> {
  const config = await resolveConfig(options);
  const provider = createProvider(config.provider, {
    apiKey: config.apiKey,
    model: config.model,
  });

  const image = await loadImage(imagePath);

  const response = await provider.analyze({
    images: [image],
    prompt: buildPrompt(options),
    jsonSchema: CHECK_UI_SCHEMA,
  });

  return JSON.parse(response) as CheckUiResult;
}
