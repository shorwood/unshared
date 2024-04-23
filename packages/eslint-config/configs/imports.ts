import { Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'

export function imports(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        import: importPlugin,
      },
      rules: {
        /**
         * Enforces a consistent ordering for `import` statements. Removing the
         * task of ordering imports and requires and avoid unnecessary merge conflicts
         * when working on the same file with multiple people.
         *
         * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
         * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
         */
        'import/first': 'error',
        'import/no-absolute-path': 'off',

        /**
         * Enforce at least one newline after import statements. This allows for a clear
         * separation between import statements and the rest of the code.
         *
         * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
         */
        'import/newline-after-import': ['error', {
          count: 1,
        }],

        'import/no-mutable-exports': 'error',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'off',
        'import/no-useless-path-segments': 'error',
        'import/order': ['error', {
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
            orderImportKind: 'asc',
          },
          'newlines-between': 'never',
        }],
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: [
              '.js',
              '.mjs',
              '.cjs',
              '.ts',
              '.mts',
              '.cts',
              '.d.ts',
            ],
          },
        },
      },
    },
  ]
}
