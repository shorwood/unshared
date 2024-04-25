import tslint from 'typescript-eslint'
import { ESLint, Linter } from 'eslint'

const { recommendedTypeChecked, stylisticTypeChecked } = tslint.configs
const TSLING_DEFAULT_RULES = [recommendedTypeChecked, stylisticTypeChecked]
  .flat()
  .map(x => x.rules)
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((accumulator, x) => ({ ...accumulator, ...x }), {})

export function typescript(): Linter.FlatConfig[] {
  return [
    {
      files: [
        '**/*.ts',
        '**/*.tsx',
      ],
      languageOptions: {

        // @ts-expect-error: ignore
        parser: tslint.parser,
        parserOptions: {
          project: [
            './tsconfig.json',
            './packages/*/tsconfig.json',
          ],
        },
      },
      plugins: {
        '@typescript-eslint': tslint.plugin as ESLint.Plugin,
      },
      rules: {
        ...TSLING_DEFAULT_RULES,

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
        '@typescript-eslint/ban-ts-comment': ['error', {
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
        }],

        '@typescript-eslint/ban-ts-ignore': 'off',

        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/brace-style': ['error', 'stroustrup', {
          allowSingleLine: true,
        }],

        '@typescript-eslint/camelcase': 'off',

        /**
         * Enforce a trailing comma after the last element or property in a multiline
         * list of properties or elements. This rule improves the clarity of diffs
         * when an item is added or removed from an object or array.
         *
         * @see https://typescript-eslint.io/rules/comma-dangle
         */
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],

        '@typescript-eslint/comma-spacing': ['error'],

        /**
         * Enforce `Record<K, T>` instead of `{ [K]: T }`. This rule aims to standardize
         * the declaration of Record types and helps prevent bugs caused by typos.
         *
         * @see https://typescript-eslint.io/rules/consistent-indexed-object-style
         */
        '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
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
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          prefer: 'no-type-imports',
        }],

        '@typescript-eslint/explicit-function-return-type': 'off',

        '@typescript-eslint/explicit-member-accessibility': 'off',

        '@typescript-eslint/explicit-module-boundary-types': 'off',

        /**
         * Enforce an indent of 2 spaces. Aims to reduce visual noise and maintain
         * readability of code when viewed on GitHub or GitLab.
         *
         * @see https://typescript-eslint.io/rules/indent
         */
        '@typescript-eslint/indent': ['error', 2],

        /**
         * Enforce no comma/semi-columns in interfaces. This rule aims to maintain
         * consistency around the use or omission of trailing semicolons. Helps
         * reduce the visual noise in the codebase. Also helps to prevent errors
         * when refactoring and adding new lines.
         *
         * @see https://typescript-eslint.io/rules/member-delimiter-style
         */
        '@typescript-eslint/member-delimiter-style': ['error', {
          multiline: { delimiter: 'none' },
        }],

        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
        }],

        '@typescript-eslint/no-use-before-define': ['error', {
          classes: false,
          functions: false,
          variables: true,
        }],
        /**
         * Enforce consistent spacing inside braces. This rule aims to reduce the
         * cognitive load of reasoning about code by enforcing a consistent style.
         *
         * @see https://typescript-eslint.io/rules/object-curly-spacing
         */
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],

        /**
         * Enforce the use of `@ts-expect-error` over `@ts-ignore` to silence TypeScript
         * errors. This rule aims to ensure that TypeScript errors are never silenced
         * without explanation or justification. When an error is fixed, the
         * `@ts-expect-error` forces the developer to remove the comment.
         *
         * @see https://typescript-eslint.io/rules/prefer-ts-expect-error
         * @see https://typescript-eslint.io/rules/ban-ts-comment
         */
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/semi': ['error', 'never'],

        /**
         * Disable this rule as it may conflict with the `perfectionist/sort-imports` rule.
         *
         * @see https://typescript-eslint.io/rules/sort-type-constituents
         */
        '@typescript-eslint/sort-type-constituents': 'off',
        /**
         * Enforce spacing around the `:` in type annotations. This rule aims to
         * maintain consistency and reduce visual noise in the codebase.
         *
         * @see https://typescript-eslint.io/rules/type-annotation-spacing
         */
        '@typescript-eslint/type-annotation-spacing': ['error', {}],
        /**
         * Age-old debate over how to style braces. This rule aims to reduce the
         * cognitive load of reasoning about code by enforcing a consistent style.
         *
         * @see https://typescript-eslint.io/rules/brace-style
         */
        'brace-style': 'off',
        'comma-dangle': 'off',
        /**
         * Enforce standard comma-spacing. Normalizes the codebase and reduces
         * cognitive load when reasoning about code.
         *
         * @see https://typescript-eslint.io/rules/comma-spacing
         */
        'comma-spacing': 'off',
        'import/named': 'off',
        'indent': 'off',
        /**
         * In JavaScript, it’s possible to redeclare the same variable name using var.
         * This can lead to confusion as to where the variable is actually declared and initialized.
         *
         * @see https://typescript-eslint.io/rules/no-redeclare
         */
        'no-redeclare': 'off',
        /**
         * Enforce no unused expressions. This rule aims to prevent dead code and
         * reduce the likelihood of bugs.
         *
         * @see https://typescript-eslint.io/rules/no-unused-expressions
         */
        'no-unused-expressions': 'off',
        /**
         * Enforce no unused variables. Helps keep the codebase clean and reduces
         * the chance of bugs from side-effects.
         *
         * @see https://typescript-eslint.io/rules/@typescript-eslint/no-unused-vars
         */
        'no-unused-vars': 'off',

        /**
         * Enforce sequential declarations in the same block. This rule aims to
         * enforce a top to bottom ordering of variable and type declarations.
         * This reduces the likelihood of a developer skipping over a declaration
         * when modifying code.
         *
         * @see https://typescript-eslint.io/rules/no-use-before-define
         */
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'object-curly-spacing': 'off',

        /**
         * Enforce no semi-colons. This rule aims to maintain consistency around the
         * use or omission of trailing semicolons. Helps reduce the visual noise in
         * the codebase. Also helps to prevent errors when refactoring and adding
         * new lines.
         *
         * @see https://typescript-eslint.io/rules/semi
         */
        'semi': 'off',
      },
    },

    /**
     * Ignore duplicate imports in declaration files as they are often used to re-export
     * types from other packages into multiple namespaces. This is a common pattern
     * in TypeScript declaration files.
     */
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-use-before-define': 'off',
        'import/no-duplicates': 'off',
      },
    },

    /**
     * Allow console statements in scripts and CLI files since they are not part of the
     * library / production code and are useful for debugging, logging, and testing.
     */
    {
      files: ['**/scripts/**/*', 'cli.*'],
      rules: {
        'no-console': 'off',
      },
    },
  ]
}
