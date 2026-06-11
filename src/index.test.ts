import { describe as viDescribe, it, expect } from "vitest";
import { describe, compare, ocr, checkUi, loadImage, resolveConfig, createProvider } from "./index.js";

viDescribe("library exports", () => {
  it("exports core functions", () => {
    expect(typeof describe).toBe("function");
    expect(typeof compare).toBe("function");
    expect(typeof ocr).toBe("function");
    expect(typeof checkUi).toBe("function");
    expect(typeof loadImage).toBe("function");
    expect(typeof resolveConfig).toBe("function");
    expect(typeof createProvider).toBe("function");
  });
});

viDescribe("createProvider", () => {
  it("throws on unknown provider", () => {
    expect(() =>
      createProvider("nonexistent", { apiKey: "test", model: "test" }),
    ).toThrow("Unknown provider");
  });

  it("creates a gemini provider", () => {
    const provider = createProvider("gemini", {
      apiKey: "test-key",
      model: "gemini-2.5-flash",
    });
    expect(provider.name).toBe("gemini");
    expect(typeof provider.analyze).toBe("function");
  });
});

viDescribe("resolveConfig", () => {
  it("throws when no API key is available", async () => {
    const saved = { ...process.env };
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    await expect(resolveConfig({ provider: "gemini" })).rejects.toThrow(
      "No API key found",
    );

    process.env = saved;
  });

  it("resolves config from overrides", async () => {
    const config = await resolveConfig({
      provider: "gemini",
      model: "custom-model",
      apiKey: "test-key",
    });
    expect(config.provider).toBe("gemini");
    expect(config.model).toBe("custom-model");
    expect(config.apiKey).toBe("test-key");
  });

  it("throws on unknown provider", async () => {
    await expect(
      resolveConfig({ provider: "nonexistent", apiKey: "key" }),
    ).rejects.toThrow("Unknown provider");
  });
});

viDescribe("compare", () => {
  it("throws with fewer than 2 images", async () => {
    await expect(
      compare(["single.png"], { apiKey: "test" }),
    ).rejects.toThrow("At least 2 images");
  });
});
