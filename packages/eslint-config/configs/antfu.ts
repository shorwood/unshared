import type { Linter } from 'eslint'
import pluginAntfu from 'eslint-plugin-antfu'

/**
 * Anthony extended ESLint rules.
 *
 * @see https://github.com/antfu/eslint-plugin-antfu
 * @returns The configuration for antfu plugin.
 */
export function antfu(): Linter.Config[] {
  return [
    {
      plugins: {
        antfu: pluginAntfu,
      },
      rules: {

        // --- Enforce consistent line breaks for chaining member access.
        'antfu/consistent-chaining': 'error',

        // --- Enforce consistent line breaks inside braces of object/array/named imports/exports and function parameters.
        'antfu/consistent-list-newline': 'error',

        // --- Deduplicate imports.
        'antfu/import-dedupe': 'error',

        // --- Avoid importing from 'dist' directories.
        'antfu/no-import-dist': 'error',

        // --- Enforce `export default` insteand of `export = {}`.
        'antfu/no-ts-export-equal': 'error',

        // --- Enforce `function()` instead of `() => {}` for top-level functions.
        'antfu/top-level-function': 'error',
      },
    },
  ]
}
