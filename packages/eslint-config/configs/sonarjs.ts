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

        // --- We may want to use `undefined` as a return value.
        'sonarjs/no-use-of-empty-return-value': 'off',

        // --- Disable redundant with TypeScript.
        'sonarjs/function-return-type': 'off',
        'sonarjs/different-types-comparison': 'off',

        // --- Allow control characters in regex.
        'no-control-regex': 'off',
        'sonarjs/sonar-no-control-regex': 'off',
      },
    },
  ]
}
