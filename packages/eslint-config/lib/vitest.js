module.exports = {
  overrides: [
    {
      extends: [
        'plugin:vitest/recommended',
      ],
      files: [
        '*.{ts,mts,cts,tsx,d.ts}',
        '*.{js,mjs,cjs,jsx}',
      ],
      rules: {
        /**
         * This rule aims to enforce having at least one expectation
         * in test body to ensure that the test is actually testing something.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/expect-expect.md
         */
        'vitest/expect-expect': [
          'error',
          {
            assertFunctionNames: [
              'expect',
              'expectTypeOf',
            ],
          },
        ],
      },
    },
  ],
}
