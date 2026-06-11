#!/usr/bin/env node
declare const __VERSION__: string;

import { program } from "commander";
import { describe } from "../core/tools/describe.js";
import { compare } from "../core/tools/compare.js";
import { ocr } from "../core/tools/ocr.js";
import { checkUi } from "../core/tools/check-ui.js";

program
  .name("antigone")
  .description("Vision bridge for text-only AI models")
  .version(__VERSION__);

program
  .command("describe")
  .description("Describe a single image in detail")
  .argument("<image>", "Image file path, URL, or base64 data URI")
  .option("-p, --provider <name>", "Vision provider (gemini, openrouter, anthropic, openai)")
  .option("-m, --model <name>", "Model to use")
  .option("-k, --api-key <key>", "API key for the provider")
  .option("--prompt <text>", "Custom prompt to guide the description")
  .action(async (image: string, opts: Record<string, string>) => {
    try {
      const result = await describe(image, {
        provider: opts.provider,
        model: opts.model,
        apiKey: opts.apiKey,
        prompt: opts.prompt,
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command("compare")
  .description("Compare two or more images")
  .argument("<images...>", "Image file paths, URLs, or base64 data URIs")
  .option("-p, --provider <name>", "Vision provider (gemini, openrouter, anthropic, openai)")
  .option("-m, --model <name>", "Model to use")
  .option("-k, --api-key <key>", "API key for the provider")
  .option("--prompt <text>", "Custom prompt to guide the comparison")
  .action(async (images: string[], opts: Record<string, string>) => {
    try {
      const result = await compare(images, {
        provider: opts.provider,
        model: opts.model,
        apiKey: opts.apiKey,
        prompt: opts.prompt,
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command("ocr")
  .description("Extract text from an image")
  .argument("<image>", "Image file path, URL, or base64 data URI")
  .option("-p, --provider <name>", "Vision provider (gemini, openrouter, anthropic, openai)")
  .option("-m, --model <name>", "Model to use")
  .option("-k, --api-key <key>", "API key for the provider")
  .action(async (image: string, opts: Record<string, string>) => {
    try {
      const result = await ocr(image, {
        provider: opts.provider,
        model: opts.model,
        apiKey: opts.apiKey,
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command("check-ui")
  .description("Evaluate a UI screenshot against design guidelines")
  .argument("<image>", "Image file path, URL, or base64 data URI")
  .option("-p, --provider <name>", "Vision provider (gemini, openrouter, anthropic, openai)")
  .option("-m, --model <name>", "Model to use")
  .option("-k, --api-key <key>", "API key for the provider")
  .option("--platform <platform>", "Platform guidelines to check against (ios, android)")
  .option("--requirements <text>", "Specific requirements to check against")
  .action(async (image: string, opts: Record<string, string>) => {
    try {
      const result = await checkUi(image, {
        provider: opts.provider,
        model: opts.model,
        apiKey: opts.apiKey,
        platform: opts.platform as "ios" | "android" | undefined,
        requirements: opts.requirements,
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
