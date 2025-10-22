import type { ESLint, Linter } from 'eslint'
import type { ESLintConfigOptions } from './all'
import javascript from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { toArray } from '@unshared/collection/toArray'
import perfectionist from 'eslint-plugin-perfectionist'
import tslint from 'typescript-eslint'
import { getConfigRules } from '../utils'

export function typescript(options: ESLintConfigOptions): Linter.Config[] {
  return [
    javascript.configs.recommended,
    // stylistic.configs['recommended-flat'],
    {
      languageOptions: {
        parser: tslint.parser,
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          project: toArray(options.tsConfigPath ?? './tsconfig.json'),
          tsconfigRootDir: process.cwd(),
        },
      },
      plugins: {
        '@typescript-eslint': tslint.plugin as ESLint.Plugin,
        '@stylistic': stylistic as ESLint.Plugin,
        'perfectionist': perfectionist,
      },
      files: [
        '**/*.{ts,tsx,cts,mts}',
        '**/*.{js,jsx,cjs,mjs}',
        '**/*.vue',
      ],
      rules: {

        /**
         * Inherit all recommended rules from the `@eslint/js` plugin. This is the base
         * configuration for JavaScript files.
         */
        ...getConfigRules(tslint.configs.recommendedTypeChecked),
        ...getConfigRules(tslint.configs.stylisticTypeChecked),

        // --- Enforce stroustrup brace style.
        'brace-style': 'off',
        '@typescript-eslint/brace-style': 'off',
        '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],

        // --- Enforce 2 spaces for indentation and disallow tabs.
        'no-tabs': 'off',
        'indent': 'off',
        'indent-binary-ops': 'off',
        '@typescript-eslint/no-tabs': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/indent-binary-ops': 'off',
        '@stylistic/no-tabs': 'error',
        '@stylistic/indent': ['error', 2],
        '@stylistic/indent-binary-ops': ['error', 2],

        // --- No semicolons.
        'semi': 'off',
        '@typescript-eslint/semi': 'off',
        '@stylistic/semi': ['error', 'never'],

        // --- Consistent line breaks.
        'eol-last': 'off',
        'no-multiple-empty-lines': 'off',
        '@stylistic/eol-last': ['error', 'always'],
        '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

        // --- Enforce dangling commas in multiline object literals.
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@stylistic/comma-dangle': ['error', 'always-multiline'],

        // --- Enforce type interfaces over type aliases.
        '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/array-type': ['error', { default: 'array-simple', readonly: 'array-simple' }],

        // --- Enforce declaration and usage from top to bottom.
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', {
          enums: true,
          classes: false,
          typedefs: true,
          variables: true,
          functions: false,
          ignoreTypeReferences: true,
        }],

        // --- Consistent spacing and line breaks between tokens.
        'key-spacing': 'off',
        'comma-spacing': 'off',
        'block-spacing': 'off',
        'arrow-spacing': 'off',
        'spaced-comment': 'off',
        'no-multi-spaces': 'off',
        'space-before-blocks': 'off',
        'lines-around-comment': 'off',
        'object-curly-spacing': 'off',
        'array-bracket-spacing': 'off',
        'array-bracket-newline': 'off',
        'function-call-spacing': 'off',
        'generator-star-spacing': 'off',
        'template-curly-spacing': 'off',
        'object-property-newline ': 'off',
        'newline-per-chained-call': 'off',
        'computed-property-spacing': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/comma-spacing': 'off',
        '@typescript-eslint/object-curly-spacing': 'off',
        '@typescript-eslint/type-annotation-spacing': 'off',
        '@typescript-eslint/lines-around-comment': 'off',

        '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        '@stylistic/comma-spacing': ['error', { after: true, before: false }],
        '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
        '@stylistic/type-generic-spacing': 'error',
        '@stylistic/type-named-tuple-spacing': 'error',
        '@stylistic/block-spacing': ['error', 'always'],
        '@stylistic/no-multi-spaces': 'error',
        '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
        '@stylistic/space-before-blocks': ['error', 'always'],
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/array-bracket-spacing': ['error', 'never'],
        '@stylistic/array-bracket-newline': ['error', 'consistent'],
        '@stylistic/function-call-spacing': ['error', 'never'],
        '@stylistic/template-curly-spacing': ['error', 'never'],
        '@stylistic/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
        '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        '@stylistic/generator-star-spacing': ['error', { before: true, after: true }],
        '@stylistic/computed-property-spacing': ['error', 'never'],
        '@stylistic/multiline-ternary': ['error', 'always-multiline'],
        '@stylistic/lines-around-comment': ['error', {
          beforeBlockComment: true,
          beforeLineComment: true,
          ignorePattern: String.raw`^(?! ?---|\*)`,
          applyDefaultIgnorePatterns: true,
          afterHashbangComment: true,
        }],
        '@stylistic/spaced-comment': ['error', 'always', {
          block: { markers: ['!'], exceptions: ['*'], balanced: true },
          line: { markers: ['/'], exceptions: ['/', '#'] },
        }],
        '@stylistic/lines-between-class-members': ['error', {
          enforce: [{ blankLine: 'always', prev: 'method', next: '*' }],
        }, {
          exceptAfterSingleLine: true,
        }],
        '@stylistic/type-annotation-spacing': ['error', {
          before: true,
          after: true,
          overrides: {
            arrow: { before: true, after: true },
            colon: { before: false, after: true },
            variable: { before: false, after: true },
            property: { before: false, after: true },
            parameter: { before: false, after: true },
            returnType: { before: false, after: true },
          },
        }],

        // --- Enforce `@ts-expect-error` over `@ts-ignore`.
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/ban-ts-comment': ['error', {
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
        }],

        /**
         * Disallow dangling expressions and promises. This rule aims to prevent
         * dangling promises and expressions that are not assigned to a variable.
         * This can lead to bugs and unexpected behavior in the codebase.
         *
         * @see https://eslint.org/docs/rules/no-void
         * @see https://typescript-eslint.io/rules/no-floating-promises
         */
        'no-void': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-floating-promises': ['error', {
          ignoreVoid: true,
          ignoreIIFE: true,
        }],

        /**
         * Sort imports alphabetically and group them without newlines. This rule
         * aims to maintain consistency around the order of imports in JavaScript
         * files. Helps reduce the visual noise in the codebase.
         *
         * @see https://typescript-eslint.io/rules/consistent-type-imports
         * @see https://eslint-plugin-perfectionist.azat.io/rules/sort-imports
         */
        'sort-imports': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        }],
        'perfectionist/sort-exports': ['error', {
          type: 'alphabetical',
          ignoreCase: true,
        }],
        'perfectionist/sort-named-imports': ['error', {
          type: 'alphabetical',
          ignoreCase: true,
        }],
        'perfectionist/sort-imports': ['error', {
          newlinesBetween: 'never',
          order: 'asc',
          ignoreCase: true,
          groups: [
            'type',
            'internal-type',
            ['parent-type', 'sibling-type', 'index-type'],
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
        }],

        /**
         * Sort types and union types alphabetically. This rule aims to maintain
         * consistency around the order of types in TypeScript files. Helps reduce
         * the visual noise in the codebase.
         *
         * @see https://perfectionist.dev/rules/sort-union-types
         */
        '@typescript-eslint/sort-type-constituents': 'off',
        'perfectionist/sort-intersection-types': ['error', {
          type: 'natural',
        }],
        'perfectionist/sort-union-types': ['error', {
          type: 'natural',
          ignoreCase: false,
        }],

        /**
         * Enforce no unused variables. Helps keep the codebase clean and reduces
         * the chance of bugs from side-effects.
         */
        'no-redeclare': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        //////////////////////////////////////////////////////////////////////////////////////////

        'no-useless-constructor': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        'array-callback-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        'block-scoped-var': 'error',
        'camelcase': 'off',
        'comma-style': ['error', 'last'],
        'complexity': ['off', 11],
        'consistent-return': 'off',
        'curly': ['error', 'multi-or-nest', 'consistent'],
        'eqeqeq': ['error', 'smart'],
        'no-alert': 'error',
        'no-case-declarations': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-confusing-arrow': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-constant-condition': 'error',
        'no-debugger': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-multi-str': 'error',
        'no-param-reassign': 'off',
        'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
        'no-return-assign': 'off',
        'no-return-await': 'off',
        'no-trailing-spaces': 'error',
        'no-useless-escape': 'off',
        'no-var': 'error',
        'no-with': 'error',
        'object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
        'one-var-declaration-per-line': 'error',
        'operator-linebreak': ['error', 'before'],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
        'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quote-props': ['error', 'consistent-as-needed'],
        'quotes': ['error', 'single'],
        'require-await': 'off',
        'space-before-function-paren': ['error', 'never'],
        'vars-on-top': 'error',
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
