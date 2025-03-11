import { fixupConfigRules } from '@eslint/compat';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js';
import react from 'eslint-plugin-react/configs/recommended.js';
import stylisticJs from '@stylistic/eslint-plugin';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: 'detect' }
      }
    },
    reactJsx
  ]),
  {
    plugins: {
      'react-hooks': reactHooks,
      '@stylistic': stylisticJs
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-child-element-spacing': 'error',
      '@stylistic/jsx-closing-bracket-location': 'error',
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-curly-spacing': ['error', { 'when': 'never', 'children': true }],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-pascal-case': [2, { allowNamespace: true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-sort-props': ['error'],
      '@stylistic/jsx-tag-spacing': ['error', { 'beforeSelfClosing': 'always', 'beforeClosing': 'never' }],
      '@stylistic/keyword-spacing': ['error', { 'after': true, 'before': true }],
      '@stylistic/line-comment-position': ['error', { 'position': 'above' }],
      '@stylistic/multiline-comment-style': ['error', 'starred-block'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/spaced-comment': ['error', 'always']
    }
  },
  { ignores: ['dist/'] }
];
