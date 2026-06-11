import { describe, it, expect } from "vitest";
import { VERSION } from "./index.js";

describe("antigone", () => {
  it("exports a version string", () => {
    expect(typeof VERSION).toBe("string");
  });
});
