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
         * Enforce using the node: protocol when importing Node.js builtin
         * modules. This highlights the use of Node.js built-in modules.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-node-protocol.md
         */
        'n/prefer-node-protocol': 'error',

        /**
         * Disable the no-missing-import as module resolution is already checked
         * by other tools and IDEs extensively. This rule is redundant.
         */
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'off',
      },
    },
  ]
}
