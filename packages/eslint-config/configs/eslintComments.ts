import type { Linter } from 'eslint'
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'

/**
 * @returns The configuration for eslint-comments plugin.
 * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/
 */
export function eslintComments(): Linter.Config[] {
  return [
    {
      plugins: {
        'eslint-comments': eslintCommentsPlugin,
      },
      rules: {

        // --- Allow disable without having to enable again.
        'eslint-comments/disable-enable-pair': 'off',

        // --- Disallow eslint-disable comments without rule names. This ensures that we cannot
        'eslint-comments/no-aggregating-enable': 'error',

        // --- Disable must specify rule names.
        'eslint-comments/no-unlimited-disable': 'error',

        // --- Prevent superfluous eslint comments.
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unused-disable': 'error',
        'eslint-comments/no-unused-enable': 'error',
      },
    },
  ]
}
