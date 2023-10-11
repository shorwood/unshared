/* eslint-disable unicorn/prefer-module */
const basic = require('./basic.js')

module.exports = {
  extends: [
    './basic.js',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: basic.overrides,
  rules: {

    /**
     * Enforce no semi-colons. This rule aims to maintain consistency around the
     * use or omission of trailing semicolons. Helps reduce the visual noise in
     * the codebase. Also helps to prevent errors when refactoring and adding
     * new lines.
     *
     * @see https://typescript-eslint.io/rules/semi
     */
    '@typescript-eslint/semi': ['error', 'never'],

    /**
     * Enforce no comma/semi-columns in interfaces. This rule aims to maintain
     * consistency around the use or omission of trailing semicolons. Helps
     * reduce the visual noise in the codebase. Also helps to prevent errors
     * when refactoring and adding new lines.
     *
     * @see https://typescript-eslint.io/rules/member-delimiter-style
     */
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],

    /**
     * Enforce spacing around the `:` in type annotations. This rule aims to
     * maintain consistency and reduce visual noise in the codebase.
     *
     * @see https://typescript-eslint.io/rules/type-annotation-spacing
     */
    '@typescript-eslint/type-annotation-spacing': ['error', {}],

    /**
     * Enforce `Record<K, T>` instead of `{ [K]: T }`. This rule aims to standardize
     * the declaration of Record types and helps prevent bugs caused by typos.
     *
     * @see https://typescript-eslint.io/rules/consistent-indexed-object-style
     */
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

    /**
     * Enforce consistent Array types. This rule aims to standardize the usage of
     * `Array<T>` over `T[]`, and `ReadonlyArray<T>` over `readonly T[]`. Allows
     * for reduced cognitive load when reading code that uses arrays. Exceptions
     * are allowed for primitive or simple types.
     *
     * @see https://typescript-eslint.io/rules/array-type
     */
    '@typescript-eslint/array-type': ['error', {
      default: 'array-simple',
      readonly: 'array-simple',
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
     * about imports. Typically, the bundler will know which imports are types and
     * strip them out.
     *
     * @see https://typescript-eslint.io/rules/consistent-type-imports
     */
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],

    /**
     * Enforce alphabetical ordering of type union members. This rule aims to
     * reduce the cognitive load of reasoning about the order of union types.
     *
     * @see https://typescript-eslint.io/rules/sort-type-constituents
     */
    '@typescript-eslint/sort-type-constituents': 'error',

    /**
     * Enforce an indent of 2 spaces. Aims to reduce visual noise and maintain
     * readability of code when viewed on GitHub or GitLab.
     *
     * @see https://typescript-eslint.io/rules/indent
     */
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],

    /**
     * Enforce no unused variables. Helps keep the codebase clean and reduces
     * the chance of bugs from side-effects.
     *
     * @see https://typescript-eslint.io/rules/@typescript-eslint/no-unused-vars
     */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    /**
     * In JavaScript, it’s possible to redeclare the same variable name using var.
     * This can lead to confusion as to where the variable is actually declared and initialized.
     *
     * @see https://typescript-eslint.io/rules/no-redeclare
     */
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',

    /**
     * Enforce sequential declarations in the same block. This rule aims to
     * enforce a top to bottom ordering of variable and type declarations.
     * This reduces the likelihood of a developer skipping over a declaration
     * when modifying code.
     *
     * @see https://typescript-eslint.io/rules/no-use-before-define
     */
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false,
      classes: false,
      variables: true,
    }],

    /**
     * Age-old debate over how to style braces. This rule aims to reduce the
     * cognitive load of reasoning about code by enforcing a consistent style.
     *
     * @see https://typescript-eslint.io/rules/brace-style
     */
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],

    /**
     * Enforce standard comma-spacing. Normalizes the codebase and reduces
     * cognitive load when reasoning about code.
     *
     * @see https://typescript-eslint.io/rules/comma-spacing
     */
    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],

    /**
     * Enforce a trailing comma after the last element or property in a multiline
     * list of properties or elements. This rule improves the clarity of diffs
     * when an item is added or removed from an object or array.
     *
     * @see https://typescript-eslint.io/rules/comma-dangle
     */
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'comma-dangle': 'off',

    /**
     * Enforce consistent spacing inside braces. This rule aims to reduce the
     * cognitive load of reasoning about code by enforcing a consistent style.
     *
     * @see https://typescript-eslint.io/rules/object-curly-spacing
     */
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'object-curly-spacing': 'off',

    /**
     * Removes the `const` before an `enum` keyword. This rule aims to reduce
     * the cognitive load of reasoning about code by enforcing a consistent style.
     *
     * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/no-const-enum.ts
     */
    'antfu/no-const-enum': 'error',

    /**
     * Since we are using TypeScript, we don't need to enforce types in JSDoc.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/.README/rules/require-param-type.md
     */
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',

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
    'no-useless-constructor': 'off',
    'import/named': 'off',
  },
}
