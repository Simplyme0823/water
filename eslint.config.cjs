const js = require("@eslint/js");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
