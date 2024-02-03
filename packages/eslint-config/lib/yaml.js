module.exports = {
  overrides: [
    {
      parser: 'yaml-eslint-parser',
      parserOptions: {
        defaultYAMLVersion: '1.2',
      },
      extends: [
        'plugin:yml/standard',
      ],
      files: [
        '*.{yaml,yml}',
      ],
      rules: {
        'spaced-comment': 'off',

        /**
         * Enforce single quotes. This rule aims to maintain consistency around the
         * use of single quotes in YAML files. Helps reduce the visual noise in the
         * codebase.
         *
         * @see https://github.com/ota-meshi/eslint-plugin-yml/blob/master/docs/rules/quotes.md
         */
        'yml/quotes': ['error', {
          prefer: 'single',
          avoidEscape: false,
        }],

        /**
         * Allow empty documents. Useful for placeholder files.
         *
         * @see https://github.com/ota-meshi/eslint-plugin-yml/blob/master/docs/rules/no-empty-document.md
         */
        'yml/no-empty-document': 'off',
      },
    },
  ],
}
