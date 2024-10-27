import type { Linter } from 'eslint'
import pluginJsonc from 'eslint-plugin-jsonc'

/**
 * @returns The configuration for JSON files.
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/
 */
export function json(): Linter.Config[] {
  return [
    ...pluginJsonc.configs['flat/recommended-with-json'],
    {
      rules: {

        // --- Automatically apply jsonc rules similar to your configured ESLint core rules to JSON.
        'jsonc/auto': 'error',
      },
    },
  ]
}
