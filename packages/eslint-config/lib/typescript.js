/* eslint-disable unicorn/prefer-module */
const basic = require('./basic.js')

module.exports = {
  extends: [
    './basic.js',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: basic.overrides,
  rules: {
    'import/named': 'off',

    // TS
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    '@typescript-eslint/type-annotation-spacing': ['error', {}],
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

    /**
     * Enforce consistent Array types. This rule aims to standardize the usage of
     * `Array<T>` over `T[]`, and `ReadonlyArray<T>` over `readonly T[]`. Allows
     * for reduced cognitive load when reading code that uses arrays.
     *
     * @see https://typescript-eslint.io/rules/array-type
     */
    '@typescript-eslint/array-type': ['error', {
      default: 'generic',
      readonly: 'generic',
    }],

    /**
     * Enforce the use of `@ts-expect-error` over `@ts-ignore` to silence TypeScript
     * errors. This rule aims to ensure that TypeScript errors are never silenced
     * without explanation or justification. And that when an error is fixed, the
     * `@ts-expect-error` forces the developer to remove the comment.
     *
     * @see https://typescript-eslint.io/rules/prefer-ts-expect-error
     * @see https://typescript-eslint.io/rules/ban-ts-comment
     */
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': false,
      'ts-nocheck': false,
      'ts-check': false,
    }],

    /**
     * Enforces `interface` usage over `type` usage. This allows for better consistency
     * and identification of objects that can be augmented while favoring separation
     * between interfaces describing objects and types describing primitives and/or unions.
     *
     * @see https://typescript-eslint.io/rules/consistent-type-definitions
     */
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    /**
     * Enforces consistent usage of type imports. This rule will disallow the use of
     * `import type` or `import { type }` to reduce the cognitive load of reasoning
     * about imports.
     */
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],

    // Override JS
    'no-useless-constructor': 'off',
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],

    // off
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-namespace': 'off',

    // --- Disabled JsDoc rules
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
  },
}
