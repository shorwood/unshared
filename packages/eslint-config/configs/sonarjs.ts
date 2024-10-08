import type { Linter } from 'eslint'
import type { ESLintConfigOptions } from './all'
import pluginSonarjs from 'eslint-plugin-sonarjs'

export function sonarjs(options: ESLintConfigOptions): Linter.FlatConfig[] {
  return [
    pluginSonarjs.configs.recommended as Linter.FlatConfig,
    {
      rules: {

        /**
         * Cognitive Complexity is a measure of how hard the control flow of a function
         * is to understand. Functions with high Cognitive Complexity will be difficult
         * to maintain.
         *
         * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
         */
        'sonarjs/cognitive-complexity': ['error', 30],

        /**
         * Duplicated string literals make the process of refactoring error-prone,
         * since you must be sure to update all occurrences. On the other hand,
         * constants can be referenced from many places, but only need to be
         * updated in a single place.
         *
         * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-duplicate-string.md
         */
        'sonarjs/no-duplicate-string': ['error', {
          threshold: 10,
        }],

        /**
         * Those rules are crashing ESLint at startup, so they are disabled for now.
         */
        'sonarjs/no-empty-collection': 'off',
        'sonarjs/no-extra-arguments': 'off',
        'sonarjs/no-gratuitous-expressions': 'off',
        'sonarjs/no-one-iteration-loop': 'off',
        'sonarjs/no-redundant-jump': 'off',
        'sonarjs/no-unused-collection': 'off',
        'sonarjs/no-use-of-empty-return-value': 'off',
        'sonarjs/prefer-immediate-return': 'off',

        /** User-defined rules */
        ...options.rules,
      },
    },
  ]
}
