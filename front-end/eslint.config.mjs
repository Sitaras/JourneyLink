import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable "no-explicit-any" globally
      "@typescript-eslint/no-explicit-any": "off",
      // Disable "no-unused-vars", but ignore variables starting with "_"
      "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
