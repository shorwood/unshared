import pluginJsdoc from 'eslint-plugin-jsdoc'
import { Linter } from 'eslint'

export function jsdoc(): Linter.FlatConfig[] {
  return [
    pluginJsdoc.configs['flat/recommended-typescript-flavor-error'],
    {
      files: [
        '**/*.{ts,mts,cts,tsx,d.ts}',
        '**/*.{js,mjs,cjs,jsx}',
        '**/*.vue',
      ],
      rules: {

        /**
         * Enforce a consistent padding of the block description.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/HEAD/docs/rules/check-alignment.md#readme
         */
        'jsdoc/check-alignment': 'error',

        /**
         * Normalize the indentation in the JSdoc comment to improve readability.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-indentation.md#readme
         */
        'jsdoc/check-indentation': 'error',

        /**
         * Enforce a strict set of tags for the JSDoc comment. This rule also includes
         * some custom tags that are used in our projects.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/.README/rules/check-tag-names.md
         */
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/check-tag-names': ['error', {
          definedTags: [
            'category',
          ],
        }],

        /**
         * Checks for multi-line-style comments which fail to meet the criteria of a jsdoc block,
         * namely that it should begin with two and only two asterisks.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-bad-blocks.md
         */
        'jsdoc/no-bad-blocks': 'error',

        /**
         * It is common practice to prefix a hyphen to parameters in JSDoc. But this
         * is sometimes forgotten and has no real purpose. This rule aims to enforce
         * that no hyphen is used.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-hyphen-before-param-description
         */
        'jsdoc/require-hyphen-before-param-description': ['error', 'never'],

        /**
         * Since we are using TypeScript, we don't need to enforce types in JSDoc.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-param-type.md
         */
        'jsdoc/require-returns-type': 'off',

        /**
         * Enforce a new-line between the JSDoc summary and tags. Aims to improve
         * readability by separating the summary and tags.
         *
         * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md
         */
        'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      },
    },
  ]
}
