// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  // Base ESLint rules
  eslint.configs.recommended,

  // TypeScript support
  ...tseslint.configs.recommended,

  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '**/coverage',
      '**/.yarn',
    ],
  },

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        // Don’t use "project" unless you need type-aware linting
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Test files (Vitest / Jest)
  {
    files: ['**/*.{test,spec}.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
        ...globals.jest,
      },
    },
  },
];
