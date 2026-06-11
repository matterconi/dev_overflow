import nextConfig from "eslint-config-next";
import reactPlugin from "eslint-plugin-react";

const disabledReactRules = Object.fromEntries(
  Object.keys(reactPlugin.rules).map((ruleName) => [`react/${ruleName}`, "off"])
);

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "dev/**"],
  },
  {
    rules: {
      ...disabledReactRules,
    },
  },
];

export default eslintConfig;
