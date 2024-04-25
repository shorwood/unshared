import jsonc from 'eslint-plugin-jsonc'
import { Linter } from 'eslint'

/**
 * @returns The configuration for JSON files.
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/
 */
export function configJson(): Linter.FlatConfig[] {
  return [
    ...jsonc.configs['flat/recommended-with-json'],
    {
      files: [
        '**/*.json',
        '**/*.json5',
      ],
      rules: {
        /**
         * Automatically apply jsonc rules similar to your configured ESLint core rules to JSON.
         *
         * @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/auto.html
         */
        'jsonc/auto': 'error',
      },
    },
  ]
}
