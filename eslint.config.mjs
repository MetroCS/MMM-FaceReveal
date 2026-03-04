import css from "@eslint/css"
import js from "@eslint/js"
import markdown from "@eslint/markdown"
import stylistic from "@stylistic/eslint-plugin"
import globals from "globals"

export default [
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      ...css.configs.recommended.rules,
    }
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        Log: "readonly",
        Module: "readonly",
        config: "readonly",
      },
    },
    plugins: { js, stylistic },
    rules: {
      ...js.configs.recommended.rules,
      ...stylistic.configs["recommended-extends"].rules,
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/comma-dangle": ["error", "only-multiline"],
      "@stylistic/max-statements-per-line": ["error", { max: 2 }],
      "@stylistic/quotes": ["error", "double"],
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    rules: {
      ...markdown.configs.recommended.rules,
    },
  },
];
