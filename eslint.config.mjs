import eslintPluginPrettier from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['./{examples,lib,test}/**/*.ts'],
    ignores: ['node_modules/**'],

    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      project: './tsconfig.json',
    },

    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
    },

    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    processor: '@typescript-eslint/parser',
  },
];
