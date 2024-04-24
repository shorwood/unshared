import { Linter } from 'eslint'
import nodePlugin from 'eslint-plugin-n'

export function node(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        n: nodePlugin,
      },
      rules: {
        ...nodePlugin.configs.recommended.rules,

        /**
         * Enable node built-in rules up to version 20 of Node.js. This will
         * allow the use of newer ECMAScript features and Node.js APIs.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-node-protocol.md
         */
        'n/prefer-node-protocol': ['error', {
          version: '>=20.0.0',
        }],

        /**
         * Disable the no-missing-import as module resolution is already checked
         * by other tools and IDEs extensively. This rule is redundant.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-missing-import.md
         */
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'off',
      },
    },
  ]
}
