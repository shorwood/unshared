import stylisticPlugin from '@stylistic/eslint-plugin'
import { ESLint, Linter } from 'eslint'

export function stylistic(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        '@stylistic': stylisticPlugin as ESLint.Plugin,
      },
      rules: {
        /**
         * Enforce a line before any comment. This makes the code more readable and
         * separates the comments from the code.
         *
         * @see https://eslint.style/rules/default/lines-around-comment
         */
        '@stylistic/lines-around-comment': ['error', {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockEnd: true,
          allowObjectEnd: true,
          allowArrayEnd: true,
          ignorePattern: '^\\*',
        }],
      },
    },
  ]
}
