import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

export interface ResolvedConfig {
  provider: string;
  model: string;
  apiKey: string;
}

interface ConfigFile {
  provider?: string;
  model?: string;
  providers?: Record<string, { apiKey?: string; model?: string }>;
}

const PROVIDER_DEFAULTS: Record<string, { model: string; envKeys: string[] }> = {
  gemini: {
    model: "gemini-2.5-flash",
    envKeys: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
  },
  openrouter: {
    model: "google/gemini-2.5-flash",
    envKeys: ["OPENROUTER_API_KEY"],
  },
  anthropic: {
    model: "claude-sonnet-4-20250514",
    envKeys: ["ANTHROPIC_API_KEY"],
  },
  openai: {
    model: "gpt-4o",
    envKeys: ["OPENAI_API_KEY"],
  },
};

const DETECTION_ORDER = ["gemini", "openai", "anthropic", "openrouter"];

function detectProvider(configFile: ConfigFile | null): string {
  for (const name of DETECTION_ORDER) {
    if (resolveApiKey(name, configFile)) return name;
  }
  return "gemini";
}

async function loadConfigFile(): Promise<ConfigFile | null> {
  const configPath = join(homedir(), ".config", "antigone", "config.json");
  try {
    const raw = await readFile(configPath, "utf-8");
    return JSON.parse(raw) as ConfigFile;
  } catch {
    return null;
  }
}

function resolveApiKey(
  provider: string,
  configFile: ConfigFile | null,
): string | undefined {
  const fileKey = configFile?.providers?.[provider]?.apiKey;
  if (fileKey) return fileKey;

  const defaults = PROVIDER_DEFAULTS[provider];
  if (!defaults) return undefined;

  for (const envKey of defaults.envKeys) {
    const val = process.env[envKey];
    if (val) return val;
  }
  return undefined;
}

export async function resolveConfig(overrides?: {
  provider?: string;
  model?: string;
  apiKey?: string;
}): Promise<ResolvedConfig> {
  const configFile = await loadConfigFile();

  const provider =
    overrides?.provider ?? configFile?.provider ?? detectProvider(configFile);
  const defaults = PROVIDER_DEFAULTS[provider];
  if (!defaults) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const model =
    overrides?.model ??
    configFile?.providers?.[provider]?.model ??
    configFile?.model ??
    defaults.model;

  const apiKey =
    overrides?.apiKey ?? resolveApiKey(provider, configFile);
  if (!apiKey) {
    throw new Error(
      `No API key found for provider "${provider}". ` +
        `Set ${defaults.envKeys.join(" or ")} or add it to ~/.config/antigone/config.json`,
    );
  }

  return { provider, model, apiKey };
}
