import unicornPlugin from 'eslint-plugin-unicorn'
import { Linter } from 'eslint'

// @ts-expect-error: untyped module
const UNICORN_RECOMMENDED_RULES = unicornPlugin.configs!.recommended.rules as Linter.RulesRecord

export function unicorn(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        unicorn: unicornPlugin,
      },
      rules: {
        ...UNICORN_RECOMMENDED_RULES,

        /**
         * Improve regexes by making them shorter, consistent, and safer. This rule
         * aims to improve readability and consistency of regexes while also
         * mitigating regex denial of service attacks by disallowing potentially
         * catastrophic backtracking.
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
         */
        'unicorn/better-regex': 'error',

        /**
         * Enforce the catch clause parameter name to be named `error`. This rule
         * aims to enforce a consistent parameter name in catch clauses. The name
         * `error` is the most commonly used name for the parameter that is passed
         * to the catch clause.
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md
         */
        'unicorn/catch-error-name': ['error', {
          name: 'error',
        }],

        'unicorn/consistent-function-scoping': 'off',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',

        /**
         * Enforce the use of camelCase or PascalCase when naming folders, files and
         * variables. This rule aims to enforce a consistent naming convention for
         * filenames, directory names, and variable names.
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
         */
        'unicorn/filename-case': ['error', {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: [
            '^[A-Z]+(.md)?$',
          ],
        }],
        /**
         * Disable the recommended import style rules. We want to be able to use both
         * named and default imports in our codebase.
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-style.md
         */
        'unicorn/import-style': 'off',

        'unicorn/no-array-callback-reference': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-array-instanceof': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-static-only-class': 'off',

        /**
         * Disallow unsafe regular expressions. Regular expressions can be unsafe
         * when they are too complex and can cause catastrophic backtracking. This
         * rule disallows regular expressions that can lead to catastrophic
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unsafe-regex.md
         */
        'unicorn/no-unsafe-regex': 'error',

        'unicorn/number-literal-case': 'error',

        /**
         * Enforces a convention of grouping digits using numeric separators.
         * Long numbers can become really hard to read, so cutting it into groups
         * of digits, separated with a _, is important to keep your code clear.
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
         */
        'unicorn/numeric-separators-style': ['error', {
          onlyIfContainsSeparator: true,
        }],

        'unicorn/prefer-code-point': 'off',
        'unicorn/prefer-exponentiation-operator': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-starts-ends-with': 'error',
        'unicorn/prefer-switch': 'off',
        'unicorn/prefer-text-content': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/prevent-abbreviations': ['error', {
          allowList: {
            args: true,
            dir: true,
            fn: true,
            i: true,
            j: true,
            k: true,
            props: true,
            Props: true,
            ref: true,
            v: true,
            x: true,
            y: true,
            z: true,
          },
        }],
        'unicorn/throw-new-error': 'error',
      },
    },
  ]
}
