import type { Linter } from 'eslint'
import pluginSonarjs from 'eslint-plugin-sonarjs'

/**
 * @see https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md
 * @returns ESLint Config for SonarJS.
 */
export function sonarjs(): Linter.Config[] {
  return [
    pluginSonarjs.configs.recommended as Linter.Config,
    {
      rules: {

        // --- Increase the default threshold to 30.
        'sonarjs/cognitive-complexity': ['error', 30],

        // --- Increase the default threshold to 10.
        'sonarjs/no-duplicate-string': ['error', { threshold: 10 }],

        // --- Disable unnecessary rules.
        'sonarjs/use-type-alias': 'off',
        'sonarjs/no-use-of-empty-return-value': 'off',
        'sonarjs/no-nested-functions': 'off',

        // --- Disable rules that are already covered by TypeScript.
        'sonarjs/no-extra-arguments': 'off',
        'sonarjs/function-return-type': 'off',
        'sonarjs/no-misused-promises': 'off',
        'sonarjs/no-invariant-returns': 'off',
        'sonarjs/no-unused-expressions': 'off',
        'sonarjs/different-types-comparison': 'off',

        // --- Allow control characters in regex.
        'sonarjs/sonar-no-control-regex': 'off',

        // --- Disable rules that are causing issues.
        'sonarjs/disabled-resource-integrity': 'off',
        'sonarjs/no-ignored-return': 'off',
      },
    },
    {
      files: [
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      rules: {

        // --- Disable unnecessary rules for test files.
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-useless-constructor': 'off',
        'sonarjs/public-static-readonly': 'off',
      },
    },
  ]
}
