import type { Linter } from 'eslint'
import vitestPlugin from '@vitest/eslint-plugin'

export function vitest(): Linter.Config[] {
  return [
    vitestPlugin.configs.recommended,
    {
      rules: {

        // --- Add the `expectTypeOf` function to the list of assert functions.
        'vitest/expect-expect': ['error', {
          assertFunctionNames: ['expect', 'expectTypeOf'],
        }],

        // --- Enforce a single top-level describe block.
        'vitest/require-top-level-describe': ['error', { maxNumberOfTopLevelDescribes: 1 }],

        // --- Enforce 'should' as the prefix for test titles.
        'vitest/valid-title': ['error', {
          ignoreTypeOfDescribeName: true,
          mustMatch: { test: ['^should'] },
        }],

        // --- Prefer strict equality checks.
        'vitest/prefer-to-be-truthy': 'off',
        'vitest/prefer-to-be-falsy': 'off',

        /// --- Loosen the rules for test files.
        'vitest/no-hooks': 'off',
        'vitest/require-hook': 'off',
        'vitest/no-conditional-in-test': 'off',
        'vitest/no-conditional-tests': 'off',
        'vitest/prefer-expect-assertions': 'off',
        'vitest/padding-around-all': 'off',
        'vitest/padding-around-expect-groups': 'off',
      },
    },
  ]
}
