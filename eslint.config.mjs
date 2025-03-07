import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Pull in the recommended Next.js + TypeScript ESLint settings
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add a new config object for custom rules or overrides
  {
    rules: {
      // Disable the no-unused-vars rule
      "@typescript-eslint/no-unused-vars": "off",
      // ...add more custom rule overrides here if needed
    },
  },
];

export default eslintConfig;
