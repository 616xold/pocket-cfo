import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: false,
        sourceType: "module"
      },
      globals: {
        console: "readonly",
        crypto: "readonly",
        process: "readonly",
        setInterval: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "import/no-default-export": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ]
    }
  },
  {
    ignores: ["dist/**", ".next/**", "coverage/**", "node_modules/**"]
  }
];
