import type { Linter } from 'eslint'
import unicornPlugin from 'eslint-plugin-unicorn'

/**
 * @returns ESLint Config for Unicorn.
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
 */
export function unicorn(): Linter.Config[] {
  return [
    unicornPlugin.configs.recommended,
    {
      rules: {

        // --- Allow any kind of import style.
        'unicorn/import-style': 'off',

        // --- Improve regexes by making them shorter, consistent, and safer.
        'unicorn/better-regex': 'error',

        // --- Use destructured variables over properties.
        'unicorn/consistent-destructuring': 'error',

        // --- Enforce consistent function scoping except for arrow functions.
        'unicorn/consistent-function-scoping': ['error', { checkArrowFunctions: false }],

        // --- Disable switch-case fallthrough.
        'unicorn/prefer-switch': 'off',

        // --- Enforce camelCase & PascalCase in filenames. Exepct non TS/JS files.
        'unicorn/filename-case': ['error', {
          multipleFileExtensions: false,
          cases: { camelCase: true, pascalCase: true },
          ignore: [/\.json$/, /\.md$/, /\.yml$/, /\.yaml$/],
        }],

        // --- Improve readability by using numeric separators.
        'unicorn/numeric-separators-style': ['error', {
          onlyIfContainsSeparator: true,
        }],

        // --- Enforce long variable names when they are meaningful.
        'unicorn/prevent-abbreviations': ['error', {
          allowList: {
            args: true,
            utils: true,
            dir: true,
            fn: true,
            i: true,
            j: true,
            k: true,
            ref: true,
            Ref: true,
            props: true,
            Props: true,
            v: true,
            x: true,
            y: true,
            z: true,
          },
        }],
      },
    },
    {
      files: [
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      rules: {

        // --- Disable unnecessary rules for test files.
        'unicorn/no-null': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/no-static-only-class': 'off',
      },
    },
  ]
}
