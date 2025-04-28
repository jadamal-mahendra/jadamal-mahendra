// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier"; // Keep for disabling conflicting rules

export default [
  // Global ignores
  { ignores: [
      "node_modules/", 
      "dist/", 
      "vite.config.ts", 
      "postcss.config.js", 
      "tailwind.config.js",
      ".vercel/"
    ]
  },
  
  // Base ESLint recommended rules
  pluginJs.configs.recommended,
  
  // TypeScript recommended rules
  ...tseslint.configs.recommended,
  
  // React recommended rules (needs settings)
  {
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
        ...pluginReactConfig.rules,
        'react/prop-types': 'off', 
        'react/react-in-jsx-scope': 'off',
    }
  },

  // React Hooks plugin configuration
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },

  // JSX Accessibility plugin configuration
  {
    plugins: {
      'jsx-a11y': pluginJsxA11y,
    },
    rules: pluginJsxA11y.configs.recommended.rules,
  },

  // Global language options and overrides
  {
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: { 
          ecmaFeatures: { jsx: true },
          ecmaVersion: 'latest', 
          sourceType: 'module' 
      },
    },
    rules: {
      // Your custom rule overrides
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      // Add other rules here if needed
    }
  },
  
  // Prettier config to disable conflicting rules (must be last)
  prettierConfig, 
]; 