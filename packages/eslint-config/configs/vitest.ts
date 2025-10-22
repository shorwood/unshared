import type { Linter } from 'eslint'

export function vitest(): Linter.Config[] {
  return [
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
        "vitest/no-identical-title": "error",
        "vitest/no-commented-out-tests": "error",
        "vitest/valid-expect": "error",
        "vitest/valid-describe-callback": "error",
        "vitest/require-local-test-context-for-concurrent-snapshots": "error",
        "vitest/no-import-node-test": "error",
      },
    },
  ]
}
