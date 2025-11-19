import tsparser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import rootConfig from '../eslint.config.js';

/**
 * Frontend-specific ESLint configuration
 * Extends root config with React-specific settings
 */
export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.config.ts', 'vite.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['buttonVariants'] },
      ],
    },
  },
  {
    files: ['**/*.config.ts', 'vite.config.ts', 'vitest.config.ts'],
  },
];
