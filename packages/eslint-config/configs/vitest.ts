import { Linter } from 'eslint'
import vitestPlugin from 'eslint-plugin-vitest'

export function vitest(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        vitest: vitestPlugin,
      },
      files: [
        '*.{ts,mts,cts,tsx,d.ts}',
        '*.{js,mjs,cjs,jsx}',
      ],
      rules: {
        /**
         * Inject all configuration from eslint-plugin-vitest.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/tree/main?tab=readme-ov-file#rules
         */
        ...vitestPlugin.configs.all.rules,

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

        /**
         * Enforce rule titles starts with 'should'. This is a convention
         * to force the developer to write the test in a way that it reads
         * like a sentence.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
         */
        'vitest/valid-title': [
          'error',
          {
            ignoreTypeOfDescribeName: true,
            mustMatch: ['^should'],
          },
        ],
      },
    },
  ]
}
