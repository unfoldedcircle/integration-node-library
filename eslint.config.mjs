import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginPromise from "eslint-plugin-promise";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPromise.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "no-console": "warn",
      "no-debugger": "error"
    }
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    files: ["examples/**/*.js"],
    rules: {
      "no-console": "off"
    }
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
);
