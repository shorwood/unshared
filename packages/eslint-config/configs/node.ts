import type { Linter } from 'eslint'
import nodePlugin from 'eslint-plugin-n'

export function node(): Linter.Config[] {
  return [
    nodePlugin.configs['flat/recommended'],
    {
      settings: {
        node: {
          version: '>=20.0.0',
        },
      },
      rules: {

        // --- Redundant with TypeScript module resolution.
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'off',
        'n/no-unpublished-import': 'off',

        // --- Enforce async functions over synchronous functions.
        'n/no-sync': ['error', { allowAtRootLevel: true }],

        // --- Enforce the use of ECMAScript features.
        'n/no-unsupported-features/es-syntax': 'error',
        'n/no-unsupported-features/es-builtins': 'error',
        'n/no-unsupported-features/node-builtins': 'error',

        // --- Prefer the use of global objects over built-in modules.
        'n/prefer-global/buffer': 'error',
        'n/prefer-global/console': 'error',
        'n/prefer-global/process': 'error',
        'n/prefer-global/text-decoder': 'error',
        'n/prefer-global/text-encoder': 'error',
        'n/prefer-global/url': 'error',
        'n/prefer-global/url-search-params': 'error',

        // --- Prefer the use of the `node:` protocol for built-in modules.
        'n/prefer-node-protocol': 'error',

        // --- Prefer the use of promises over callbacks.
        'n/prefer-promises/fs': 'error',
        'n/prefer-promises/dns': 'error',
      },
    },
  ]
}
