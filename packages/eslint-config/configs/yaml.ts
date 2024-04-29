import yamlParser from 'yaml-eslint-parser'
import yamlPlugin from 'eslint-plugin-yml'
import { ESLint, Linter } from 'eslint'
import { ESLintConfigOptions } from './all'

export function yaml(options: ESLintConfigOptions): Linter.FlatConfig[] {
  return [
    {
      files: [
        '**/*.yaml',
        '**/*.yml',
      ],
      languageOptions: {
        parser: yamlParser,
        parserOptions: {
          defaultYAMLVersion: '1.2',
        },
      },
      plugins: {
        yaml: yamlPlugin as ESLint.Plugin,
      },
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

        /**
         * Allow empty documents. Useful for placeholder files.
         *
         * @see https://github.com/ota-meshi/eslint-plugin-yml/blob/master/docs/rules/no-empty-document.md
         */
        'yml/no-empty-document': 'off',

        /**
         * Prefer single quotes over double quotes. This rule aims to maintain
         * consistency around the use of single quotes in YAML files. Helps reduce
         * the visual noise in the codebase.
         *
         * @see https://github.com/ota-meshi/eslint-plugin-yml/blob/master/docs/rules/quotes.md
         */
        'yml/quotes': ['error', {
          avoidEscape: false,
          prefer: 'single',
        }],

        /** User-defined rules */
        ...options.rules,
      },
    },
  ]
}
