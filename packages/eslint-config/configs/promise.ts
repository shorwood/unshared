import { Linter } from 'eslint'
import promisePlugin from 'eslint-plugin-promise'

export function promise(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        promise: promisePlugin,
      },
      rules: {
        /**
         * Recommended rules from the plugin.
         *
         * @see https://github.com/eslint-community/eslint-plugin-promise?tab=readme-ov-file#rules
         */
        // @ts-expect-error: untyped plugin.
        ...promisePlugin.configs.recommended.rules as Linter.RulesRecord,
      },
    },
  ]
}
