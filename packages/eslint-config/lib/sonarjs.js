module.exports = {
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
      extends: [
        'plugin:sonarjs/recommended',
      ],
      files: [
        '*.{ts,mts,cts,tsx,d.ts}',
        '*.{js,mjs,cjs,jsx}',
        '*.vue',
      ],
      plugins: [
        'sonarjs',
      ],
      rules: {

        /**
         * Duplicated string literals make the process of refactoring error-prone,
         * since you must be sure to update all occurrences. On the other hand,
         * constants can be referenced from many places, but only need to be
         * updated in a single place.
         *
         * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-duplicate-string.md
         */
        'sonarjs/no-duplicate-string': ['error', {
          threshold: 10,
        }],

        /**
         * Cognitive Complexity is a measure of how hard the control flow of a function
         * is to understand. Functions with high Cognitive Complexity will be difficult
         * to maintain.
         *
         * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
         */
        'sonarjs/cognitive-complexity': ['error', 20],
      },
    },
  ],
}
