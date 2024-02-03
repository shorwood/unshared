module.exports = {
  extends: [
    'plugin:import/recommended',
  ],
  rules: {
    /**
     * Impose a consistent ordering for `require()`/`import` statements. Removing the
     * task of ordering imports and requires and avoid unnecessary merge conflicts
     * when working on the same file with multiple people.
     *
     * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
     * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
     */
    'import/first': 'error',
    'import/no-absolute-path': 'off',

    'import/no-mutable-exports': 'error',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'error',
    'import/order': ['error', {
      'alphabetize': {
        caseInsensitive: true,
        order: 'asc',
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
}
