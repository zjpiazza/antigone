import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "cli/index": "src/cli/index.ts",
    "mcp/index": "src/mcp/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  target: "node18",
  define: {
    __VERSION__: JSON.stringify(version),
  },
});
