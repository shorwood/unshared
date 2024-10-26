import type { Linter } from 'eslint'
import pluginYml from 'eslint-plugin-yml'

/**
 * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/
 * @returns ESLint Config for YAML files.
 */
export function yml(): Linter.Config[] {
  return [
    ...pluginYml.configs['flat/standard'],
    ...pluginYml.configs['flat/recommended'],
    {
      rules: {

        // --- Force single quotes.
        'yml/quotes': ['error', {
          avoidEscape: true,
          prefer: 'single',
        }],

        // --- Remove trailing zeros in numbers.
        'yml/no-trailing-zeros': 'error',

        // --- Prevent empty keys.
        'yml/require-string-key': 'error',

        // --- Prevent empty values or weird newlines in mappings.
        'yml/block-mapping-colon-indicator-newline': 'error',

        // --- No more than one empty line.
        'yml/no-multiple-empty-lines': ['error', {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        }],

        // --- Sort environemnt variables alphabetically.
        'yml/sort-sequence-values': ['error', {
          pathPattern: '^env$',
          order: { type: 'asc' },
        }],
      },
    },
  ]
}
