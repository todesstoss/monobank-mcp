import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
      curly: ["error", "all"],
    },
  },
];
