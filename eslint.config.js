import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";
import tsEslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: fixupConfigAsPlugin(pluginReactConfig),
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      // Custom rules or overrides
      "react/react-in-jsx-scope": "off", // Next.js 13+ doesn't require React import in JSX scope
      "react/prop-types": "off", // Disable prop-types validation if using TypeScript
      "react/jsx-uses-react": "off", // Disable if using new JSX transform
      "react/jsx-uses-vars": "off", // Disable if using new JSX transform
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": "off", // Disable base JS rule for TS version
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
  ...tsEslint.configs.recommended,
  {
    ignores: ["node_modules/", ".next/", "out/", "dist/", "public/", "prisma/"],
  },
];
