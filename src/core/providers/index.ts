import type { Provider, ProviderOptions } from "../types.js";
import { createGeminiProvider } from "./gemini.js";

type ProviderFactory = (options: ProviderOptions) => Provider;

const providers: Record<string, ProviderFactory> = {
  gemini: createGeminiProvider,
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
