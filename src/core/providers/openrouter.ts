import type { Provider, ProviderOptions } from "../types.js";
import { createOpenAiCompatibleProvider } from "./openai.js";

export function createOpenRouterProvider(options: ProviderOptions): Provider {
  return createOpenAiCompatibleProvider(
    "openrouter",
    "https://openrouter.ai/api/v1",
    options,
    { "HTTP-Referer": "https://github.com/zjpiazza/antigone" },
  );
}
