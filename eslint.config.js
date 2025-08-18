import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier/recommended";

export default [
  eslint.configs.recommended,
  prettierPlugin,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        MutationObserver: "readonly",
        requestAnimationFrame: "readonly",
        // Node globals
        process: "readonly",
        module: "writable",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      // General code quality rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off", // Allow console in browser environment
      "no-debugger": "warn",

      // ES6+ specific rules
      "arrow-body-style": ["error", "as-needed"],
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "no-var": "error",

      // Prettier integration
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    },
    ignores: [
      "node_modules/**",
      ".git/**",
      ".github/**",
      "dist/**",
      "**/dist/**",
    ],
  },
];
