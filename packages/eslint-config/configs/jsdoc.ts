import type { Linter } from 'eslint'
import pluginJsdoc from 'eslint-plugin-jsdoc'

/**
 * @returns Configuration for JSDoc ESLint rules.
 * @see https://github.com/gajus/eslint-plugin-jsdoc
 */
export function jsdoc(): Linter.Config[] {
  return [
    pluginJsdoc.configs['flat/recommended-typescript-error'],
    {
      files: [
        '**/*.{ts,mts,cts,tsx,d.ts}',
        '**/*.{js,mjs,cjs,jsx}',
        '**/*.vue',
      ],
      plugins: {
        jsdoc: pluginJsdoc,
      },
      rules: {

        // --- Redudant with TypeScript.
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-yields-type': 'off',
        'jsdoc/require-throws-type': 'off',
        'jsdoc/require-returns-type': 'off',

        // --- Reports malformed JSDoc comments.
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'error',

        // --- Reports invalid block tag names.
        'jsdoc/check-tag-names': ['error', { definedTags: ['category'] }],

        // --- Do not use hyphens before param descriptions.
        'jsdoc/require-hyphen-before-param-description': ['error', 'never'],

        // --- Newline after description.
        'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      },
    },
  ]
}
