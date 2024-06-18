import nodePlugin from 'eslint-plugin-n'
import { ESLint, Linter } from 'eslint'
import { ESLintConfigOptions } from './all'

export function node(options: ESLintConfigOptions): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        n: nodePlugin as ESLint.Plugin,
      },
      rules: {
        ...nodePlugin.configs.recommended.rules,

        /**
         * Disallow the use of extraneous imports. This rule helps prevent the
         * use of third-party modules that are not listed in the project's
         * dependencies.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-extraneous-import.md
         */
        'n/no-extraneous-import': 'error',

        /**
         * Disable the no-missing-import as module resolution is already checked
         * by other tools and IDEs extensively. This rule is redundant.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-missing-import.md
         */
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'off',
        'n/no-unpublished-import': 'off',

        /**
         * Enfore the use of the asyncrounous version of the `fs` and `dns` APIs.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-sync.md
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-promises/fs.md
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-promises/dns.md
         */
        'n/no-sync': 'off',
        'n/prefer-promises/fs': 'error',
        'n/prefer-promises/dns': 'error',

        /**
         * Allow the use of features up to Node.js version 20. This will allow
         * the use of newer ECMAScript features and Node.js APIs.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules
         */
        'n/no-unsupported-features/es-syntax': 'error',
        'n/no-unsupported-features/es-builtins': 'error',
        'n/no-unsupported-features/node-builtins': 'error',

        /**
         * Prepend the `node:` prefix to all Node.js core modules. This helps
         * identify the module as a Node.js core module and not a third-party
         * module.
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-node-protocol.md
         */
        'n/prefer-node-protocol': 'error',

        /** User-defined rules */
        ...options.rules,
      },
      settings: {
        node: {
          version: '>=22.1.0',
        },
      },
    },
  ]
}
