import vitestPlugin from 'eslint-plugin-vitest'
import { Linter } from 'eslint'

export function vitest(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        vitest: vitestPlugin,
      },
      files: [
        '**/*.{ts,mts,cts,tsx,d.ts}',
        '**/*.{js,mjs,cjs,jsx}',
      ],
      settings: {
        vitest: {
          typecheck: true,
        },
      },
      languageOptions: {
        globals: {
          ...vitestPlugin.environments.env.globals,
          expectTypeOf: true,
        },
      },
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
        'vitest/expect-expect': ['error', {
          assertFunctionNames: [
            'expect',
            'expectTypeOf',
          ],
        }],

        /**
         * Disable the conditional test rule as it is prevent's us to use in-source
         * testing when using the `if (import.meta.vitest)` condition. Also disable
         * the rule that prevents the use of if-else statements in tests as we want
         * to use it to test type predicates.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-in-test.md
         */
        'vitest/no-conditional-in-test': 'off',
        'vitest/no-conditional-tests': 'off',

        /**
         * Allow hooks to be defined at the top-level of the test file.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-hooks.md
         */
        'vitest/no-hooks': 'off',

        /**
         * Disable the rule that enforces the use of `expect.assertions` in tests.
         * As much as this rule enforces a best-practice, it is not always necessary.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-assertions.md
         */
        'vitest/prefer-expect-assertions': 'off',

        /**
         * Some functions may have a single test case, and it is not necessary
         * to wrap them in a describe block.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/require-top-level-describe.md
         */
        'vitest/require-top-level-describe': 'off',

        /**
         * Enforce rule titles starts with 'should'. This is a convention
         * to force the developer to write the test in a way that it reads
         * like a sentence.
         *
         * @see https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
         */
        'vitest/valid-title': ['error', {
          ignoreTypeOfDescribeName: true,
          mustMatch: {
            test: ['^should'],
          },
        }],
      },
    },
  ]
}
