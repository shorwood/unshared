import { ESLint, Linter } from 'eslint'
import yamlPlugin from 'eslint-plugin-yml'
import yamlParser from 'yaml-eslint-parser'

export function yaml(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        yaml: yamlPlugin as ESLint.Plugin,
      },
      languageOptions: {
        parser: yamlParser,
        parserOptions: {
          defaultYAMLVersion: '1.2',
        },
      },
      files: [
        '**/*.yaml',
        '**/*.yml',
      ],
      rules: {
        ...yamlPlugin.configs.standard.rules as Linter.RulesRecord,

        /**
         * Enforce single quotes. This rule aims to maintain consistency around the
         * use of single quotes in YAML files. Helps reduce the visual noise in the
         * codebase.
         *
         * @see https://github.com/ota-meshi/eslint-plugin-yml/blob/master/docs/rules/quotes.md
         */
        'spaced-comment': 'off',
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
  ]
}