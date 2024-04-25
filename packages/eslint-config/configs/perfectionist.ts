import { Linter } from 'eslint'
import { FlatCompat } from '@eslint/eslintrc'

export function perfectionist(): Linter.FlatConfig[] {
  return new FlatCompat().config({
    extends: [
      'plugin:perfectionist/recommended-natural',
    ],
    plugins: [
      'perfectionist',
    ],
    rules: {
      /**
       * Sort imports alphabetically and group them without newlines. This rule
       * aims to maintain consistency around the order of imports in JavaScript
       * files. Helps reduce the visual noise in the codebase.
       *
       * @see https://eslint-plugin-perfectionist.azat.io/rules/sort-imports
       */
      'perfectionist/sort-imports': ['error', {
        'newlines-between': 'never',
        'order': 'desc',
      }],

      /**
       * Sort objects alphabetically. This rule aims to maintain consistency around
       * the order of object properties in JavaScript files. Helps reduce the visual
       * noise in the codebase.
       *
       * @see https://eslint-plugin-perfectionist.azat.io/rules/sort-objects
       */
      'perfectionist/sort-objects': ['error', {
        'partition-by-comment': '--- **',
      }],
    },
  })
}
