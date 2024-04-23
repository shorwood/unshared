import { Linter } from 'eslint'
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'

/**
 * Provide configuration for eslint-comments plugin rules. This
 * plugin is used to enforce certain rules for eslint comments.
 *
 * @returns The configuration for eslint-comments plugin.
 * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/
 */
export function eslintComments(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        'eslint-comments': eslintCommentsPlugin,
      },
      rules: {
        /**
         * Allow multiple rules directive in a single comment. This
         * reduces the number of comments in the code.
         *
         * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/disable-enable-pair
         */
        'eslint-comments/disable-enable-pair': 'off',

        /**
         * `eslint-enable` directive-comments can enable rules which are disabled by different
         * eslint-disable directive-comments. It can enable a rule unintentionally. This rule
         * will report such cases.
         *
         * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/no-aggregating-enable
         */
        'eslint-comments/no-aggregating-enable': 'error',

        /**
         * Disallow duplicate eslint-disable comments. This rule will report when there are
         * multiple eslint-disable comments for the same rule, either in the same line or enabled
         * by different eslint-disable comments.
         *
         * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/no-duplicate-disable
         */
        'eslint-comments/no-duplicate-disable': 'error',

        /**
         * Disallow eslint-disable comments without rule names. This ensures that we cannot
         * disable all rules in a file using eslint-disable comment.
         *
         * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/no-unlimited-disable
         */
        'eslint-comments/no-unlimited-disable': 'error',

        /**
         * Errors when an eslint-disable comment has no effect. This is useful
         * to prevent unnecessary comments in the code.
         *
         * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/no-unused-disable
         */
        'eslint-comments/no-unused-disable': 'error',
      },
    },
  ]
}
