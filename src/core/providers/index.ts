import type { Provider, ProviderOptions } from "../types.js";
import { createGeminiProvider } from "./gemini.js";
import { createOpenAiProvider } from "./openai.js";
import { createAnthropicProvider } from "./anthropic.js";
import { createOpenRouterProvider } from "./openrouter.js";

type ProviderFactory = (options: ProviderOptions) => Provider;

const providers: Record<string, ProviderFactory> = {
  gemini: createGeminiProvider,
  openai: createOpenAiProvider,
  anthropic: createAnthropicProvider,
  openrouter: createOpenRouterProvider,
};

export function createProvider(
  name: string,
  options: ProviderOptions,
): Provider {
  const factory = providers[name];
  if (!factory) {
    const available = Object.keys(providers).join(", ");
    throw new Error(
      `Unknown provider "${name}". Available: ${available}`,
    );
  }
  return factory(options);
}
