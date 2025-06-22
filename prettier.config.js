/** @type {import('prettier').Config} */
const config = {
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
  ],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
};

export default config; 