import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@tansui/core": resolve(process.cwd(), "packages/core/src/index.ts"),
    },
  },
  test: {
    include: [
      "packages/**/__tests__/**/*.test.ts",
      "apps/**/__tests__/**/*.test.ts"
    ],
    environment: "node"
  }
});
