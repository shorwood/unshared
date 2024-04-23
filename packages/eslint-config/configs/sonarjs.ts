import { Linter } from 'eslint'
import sonarjsPlugin from 'eslint-plugin-sonarjs'

// @ts-expect-error: untyped module
const SONARJS_RECOMMENDED_RULES = sonarjsPlugin.configs.recommended.rules as Linter.RulesRecord

export function sonarjs(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        sonarjs: sonarjsPlugin,
      },
      rules: {
        ...SONARJS_RECOMMENDED_RULES,

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
         * Cognitive Complexity is a measure of how hard the control flow of a function
         * is to understand. Functions with high Cognitive Complexity will be difficult
         * to maintain.
         *
         * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
         */
        'sonarjs/cognitive-complexity': ['error', 25],
      },
    },
  ]
}
